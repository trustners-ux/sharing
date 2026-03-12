import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import {
  AssignCategoryDto,
  UpdateCategoryDto,
  CreateTierSharingDto,
  UpdateTierSharingDto,
  CreateProductDto,
  UpdateProductDto,
  CalculatePayoutDto,
  BulkCalculatePayoutDto,
} from './dto/posp-category.dto';

// --- Tier Classification Logic ---
function getTier(commissionPercent: number): 'HIGH' | 'MEDIUM' | 'LOW' {
  if (commissionPercent >= 30) return 'HIGH';
  if (commissionPercent >= 15) return 'MEDIUM';
  return 'LOW';
}

// Default tier sharing matrix (seeded into DB, used as fallback)
const DEFAULT_TIER_SHARING: Record<string, Record<string, number>> = {
  A:      { HIGH: 65, MEDIUM: 55, LOW: 40 },
  B:      { HIGH: 70, MEDIUM: 60, LOW: 45 },
  C:      { HIGH: 75, MEDIUM: 65, LOW: 50 },
  D:      { HIGH: 80, MEDIUM: 70, LOW: 55 },
  D_PLUS: { HIGH: 82, MEDIUM: 72, LOW: 57 },
  E:      { HIGH: 82, MEDIUM: 72, LOW: 57 },
  E_PLUS: { HIGH: 85, MEDIUM: 75, LOW: 60 },
  F1:     { HIGH: 85, MEDIUM: 75, LOW: 60 },
  F2:     { HIGH: 88, MEDIUM: 78, LOW: 62 },
  F3:     { HIGH: 90, MEDIUM: 80, LOW: 65 },
};

// Category order for upgrade/downgrade
const CATEGORY_ORDER = ['A', 'B', 'C', 'D', 'D_PLUS', 'E', 'E_PLUS', 'F1', 'F2', 'F3'];

@Injectable()
export class PospCategoryService {
  constructor(private prisma: PrismaService) {}

  // =========================================================================
  // CATEGORY ASSIGNMENTS
  // =========================================================================

  /** Assign a category to a POSP for a specific LOB */
  async assignCategory(dto: AssignCategoryDto, approvedBy: string) {
    // Close any existing active assignment for this POSP + LOB
    const existing = await this.prisma.pospCategoryAssignment.findFirst({
      where: {
        pospId: dto.pospId,
        lob: dto.lob as any,
        effectiveTo: null,
      },
      orderBy: { effectiveFrom: 'desc' },
    });

    const effectiveFrom = dto.effectiveFrom ? new Date(dto.effectiveFrom) : new Date();

    if (existing) {
      await this.prisma.pospCategoryAssignment.update({
        where: { id: existing.id },
        data: { effectiveTo: effectiveFrom },
      });
    }

    return this.prisma.pospCategoryAssignment.create({
      data: {
        pospId: dto.pospId,
        lob: dto.lob as any,
        category: dto.category as any,
        effectiveFrom,
        reason: dto.reason || `Category assigned to ${dto.category}`,
        approvedBy,
      },
    });
  }

  /** Update (upgrade/downgrade) a POSP's category for a specific LOB */
  async updateCategory(pospId: string, lob: string, dto: UpdateCategoryDto, approvedBy: string) {
    return this.assignCategory(
      {
        pospId,
        lob: lob as any,
        category: dto.category,
        reason: dto.reason,
        effectiveFrom: dto.effectiveFrom,
      },
      approvedBy,
    );
  }

  /** Get current category assignments for a POSP (all LOBs) */
  async getPospCategories(pospId: string) {
    const assignments = await this.prisma.pospCategoryAssignment.findMany({
      where: {
        pospId,
        effectiveTo: null, // Only active assignments
      },
    });

    // Build a map: LOB → category
    const categoryMap: Record<string, string> = { GI: 'A', LI: 'A', HI: 'A' };
    for (const a of assignments) {
      categoryMap[a.lob] = a.category;
    }
    return categoryMap;
  }

  /** Get category assignment history for a POSP */
  async getCategoryHistory(pospId: string, lob?: string) {
    const where: any = { pospId };
    if (lob) where.lob = lob;

    return this.prisma.pospCategoryAssignment.findMany({
      where,
      orderBy: { effectiveFrom: 'desc' },
      take: 50,
    });
  }

  /** List all POSP category assignments with filters */
  async listAssignments(filters: {
    lob?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { lob, category, search, page = 1, limit = 20 } = filters;
    const where: any = { effectiveTo: null }; // Active only

    if (lob) where.lob = lob;
    if (category) where.category = category;

    const [data, total] = await Promise.all([
      this.prisma.pospCategoryAssignment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.pospCategoryAssignment.count({ where }),
    ]);

    // Enrich with POSP names
    const pospIds = [...new Set(data.map(d => d.pospId))];
    const posps = pospIds.length > 0
      ? await this.prisma.pOSPAgent.findMany({
          where: { id: { in: pospIds } },
          select: { id: true, firstName: true, lastName: true, pospCode: true },
        })
      : [];
    const pospMap = new Map(posps.map(p => [p.id, p]));

    const enriched = data.map(d => ({
      ...d,
      pospName: pospMap.has(d.pospId)
        ? `${pospMap.get(d.pospId).firstName} ${pospMap.get(d.pospId).lastName}`
        : 'Unknown',
      pospCode: pospMap.get(d.pospId)?.pospCode || '',
    }));

    return {
      data: enriched,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /** Bulk assign default category (A) to all POSPs without assignments */
  async bulkAssignDefaults(approvedBy: string) {
    const posps = await this.prisma.pOSPAgent.findMany({
      select: { id: true },
    });

    const existingAssignments = await this.prisma.pospCategoryAssignment.findMany({
      where: { effectiveTo: null },
      select: { pospId: true, lob: true },
    });

    const existingSet = new Set(existingAssignments.map(a => `${a.pospId}_${a.lob}`));
    const lobs = ['GI', 'LI', 'HI'] as const;
    const toCreate: any[] = [];

    for (const posp of posps) {
      for (const lob of lobs) {
        if (!existingSet.has(`${posp.id}_${lob}`)) {
          toCreate.push({
            pospId: posp.id,
            lob,
            category: 'A',
            reason: 'Default assignment - new POSP',
            approvedBy,
          });
        }
      }
    }

    if (toCreate.length > 0) {
      await this.prisma.pospCategoryAssignment.createMany({ data: toCreate });
    }

    return { created: toCreate.length, message: `Assigned default category A to ${toCreate.length} POSP-LOB combinations` };
  }

  // =========================================================================
  // TIER SHARING CONFIG
  // =========================================================================

  /** Get all active tier sharing configs */
  async getTierSharingConfigs() {
    const configs = await this.prisma.tierSharingConfig.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { tier: 'asc' }],
    });

    // Build matrix format
    const matrix: Record<string, Record<string, number>> = {};
    for (const config of configs) {
      if (!matrix[config.category]) matrix[config.category] = {};
      matrix[config.category][config.tier] = Number(config.sharingPercent);
    }

    // Fill in defaults for any missing entries
    for (const cat of CATEGORY_ORDER) {
      if (!matrix[cat]) matrix[cat] = {};
      for (const tier of ['HIGH', 'MEDIUM', 'LOW']) {
        if (matrix[cat][tier] === undefined) {
          matrix[cat][tier] = DEFAULT_TIER_SHARING[cat]?.[tier] ?? 50;
        }
      }
    }

    return { configs, matrix };
  }

  /** Create or update a tier sharing config */
  async upsertTierSharing(dto: CreateTierSharingDto) {
    // Deactivate existing
    await this.prisma.tierSharingConfig.updateMany({
      where: {
        category: dto.category as any,
        tier: dto.tier as any,
        isActive: true,
      },
      data: { isActive: false, effectiveTo: new Date() },
    });

    return this.prisma.tierSharingConfig.create({
      data: {
        category: dto.category as any,
        tier: dto.tier as any,
        sharingPercent: dto.sharingPercent,
        isActive: true,
      },
    });
  }

  /** Update an existing tier sharing config */
  async updateTierSharing(id: string, dto: UpdateTierSharingDto) {
    return this.prisma.tierSharingConfig.update({
      where: { id },
      data: {
        sharingPercent: dto.sharingPercent,
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
    });
  }

  // =========================================================================
  // COMMISSION PRODUCT CATALOG
  // =========================================================================

  /** Get products with filters */
  async getProducts(filters: {
    lob?: string;
    insurer?: string;
    productLine?: string;
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { lob, insurer, productLine, search, isActive = true, page = 1, limit = 50 } = filters;
    const where: any = {};

    if (lob) where.lob = lob;
    if (insurer) where.insurer = { contains: insurer, mode: 'insensitive' };
    if (productLine) where.productLine = { contains: productLine, mode: 'insensitive' };
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where.OR = [
        { productName: { contains: search, mode: 'insensitive' } },
        { insurer: { contains: search, mode: 'insensitive' } },
        { productLine: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.commissionProduct.findMany({
        where,
        orderBy: [{ lob: 'asc' }, { productLine: 'asc' }, { insurer: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.commissionProduct.count({ where }),
    ]);

    return {
      data,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /** Get product by ID */
  async getProduct(id: string) {
    const product = await this.prisma.commissionProduct.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  /** Create a product */
  async createProduct(dto: CreateProductDto) {
    return this.prisma.commissionProduct.create({
      data: {
        lob: dto.lob as any,
        productLine: dto.productLine,
        productName: dto.productName,
        insurer: dto.insurer,
        trustnerCommission: dto.trustnerCommission,
        basis: dto.basis,
        remarks: dto.remarks,
      },
    });
  }

  /** Update a product */
  async updateProduct(id: string, dto: UpdateProductDto) {
    return this.prisma.commissionProduct.update({
      where: { id },
      data: {
        ...(dto.trustnerCommission !== undefined ? { trustnerCommission: dto.trustnerCommission } : {}),
        ...(dto.basis !== undefined ? { basis: dto.basis } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        ...(dto.remarks !== undefined ? { remarks: dto.remarks } : {}),
      },
    });
  }

  /** Get product catalog summary stats */
  async getProductStats() {
    const [giCount, liCount, hiCount, total, insurers, productLines] = await Promise.all([
      this.prisma.commissionProduct.count({ where: { lob: 'GI', isActive: true } }),
      this.prisma.commissionProduct.count({ where: { lob: 'LI', isActive: true } }),
      this.prisma.commissionProduct.count({ where: { lob: 'HI', isActive: true } }),
      this.prisma.commissionProduct.count({ where: { isActive: true } }),
      this.prisma.commissionProduct.groupBy({
        by: ['insurer'],
        where: { isActive: true },
        _count: true,
      }),
      this.prisma.commissionProduct.groupBy({
        by: ['productLine', 'lob'],
        where: { isActive: true },
        _count: true,
      }),
    ]);

    return {
      total,
      byLob: { GI: giCount, LI: liCount, HI: hiCount },
      insurerCount: insurers.length,
      insurers: insurers.map(i => ({ name: i.insurer, count: i._count }))
        .sort((a, b) => b.count - a.count),
      productLines: productLines.map(p => ({
        name: p.productLine,
        lob: p.lob,
        count: p._count,
      })),
    };
  }

  /** Get distinct filter options */
  async getFilterOptions() {
    const [insurers, productLines] = await Promise.all([
      this.prisma.commissionProduct.groupBy({
        by: ['insurer'],
        where: { isActive: true },
        orderBy: { insurer: 'asc' },
      }),
      this.prisma.commissionProduct.groupBy({
        by: ['productLine', 'lob'],
        where: { isActive: true },
        orderBy: { productLine: 'asc' },
      }),
    ]);

    return {
      insurers: insurers.map(i => i.insurer),
      productLines: productLines.map(p => ({ name: p.productLine, lob: p.lob })),
    };
  }

  // =========================================================================
  // PAYOUT CALCULATION ENGINE
  // =========================================================================

  /** Calculate payout for a single policy/product */
  async calculatePayout(dto: CalculatePayoutDto, calculatedBy: string) {
    // 1. Get the product
    const product = await this.prisma.commissionProduct.findUnique({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    // 2. Get POSP's current category for this LOB
    const categoryAssignment = await this.prisma.pospCategoryAssignment.findFirst({
      where: {
        pospId: dto.pospId,
        lob: product.lob,
        effectiveTo: null,
      },
      orderBy: { effectiveFrom: 'desc' },
    });
    const pospCategory = categoryAssignment?.category || 'A';

    // 3. Get tier from Trustner's commission percentage
    const trustnerCommPct = Number(product.trustnerCommission);
    const tier = getTier(trustnerCommPct);

    // 4. Get sharing % from config (DB first, fallback to default)
    const sharingConfig = await this.prisma.tierSharingConfig.findFirst({
      where: {
        category: pospCategory as any,
        tier: tier as any,
        isActive: true,
      },
      orderBy: { effectiveFrom: 'desc' },
    });
    const sharingPct = sharingConfig
      ? Number(sharingConfig.sharingPercent)
      : DEFAULT_TIER_SHARING[pospCategory]?.[tier] ?? 50;

    // 5. Calculate amounts
    const agentPayoutPct = +(trustnerCommPct * sharingPct / 100).toFixed(4);
    const premiumAmount = dto.premiumAmount;
    const agentPayoutAmt = +(premiumAmount * agentPayoutPct / 100).toFixed(4);
    const trustnerRetainAmt = +(premiumAmount * trustnerCommPct / 100 - agentPayoutAmt).toFixed(4);
    const tdsAmount = +(agentPayoutAmt * 5 / 100).toFixed(4); // 5% TDS
    const gstAmount = +(agentPayoutAmt * 18 / 100).toFixed(4); // 18% GST
    const netPayout = +(agentPayoutAmt - tdsAmount).toFixed(4); // Net after TDS (GST billed separately)

    const now = new Date();

    // 6. Create payout record
    const record = await this.prisma.brokeragePayoutRecord.create({
      data: {
        pospId: dto.pospId,
        policyId: dto.policyId,
        misEntryId: dto.misEntryId,
        lob: product.lob,
        productId: product.id,
        productName: product.productName,
        insurer: product.insurer,
        premiumAmount,
        basis: product.basis,
        trustnerCommPct: trustnerCommPct,
        tier: tier as any,
        pospCategory: pospCategory as any,
        sharingPct,
        agentPayoutPct,
        agentPayoutAmt,
        trustnerRetainAmt,
        tdsAmount,
        gstAmount,
        netPayout,
        status: 'PENDING',
        periodMonth: now.getMonth() + 1,
        periodYear: now.getFullYear(),
      },
    });

    return {
      record,
      breakdown: {
        product: product.productName,
        insurer: product.insurer,
        basis: product.basis,
        premiumAmount,
        trustnerCommPct,
        tier,
        pospCategory,
        sharingPct,
        agentPayoutPct,
        agentPayoutAmt,
        trustnerRetainAmt,
        tdsAmount,
        gstAmount,
        netPayout,
      },
    };
  }

  /** Get payout records with filters */
  async getPayoutRecords(filters: {
    pospId?: string;
    lob?: string;
    status?: string;
    periodMonth?: number;
    periodYear?: number;
    page?: number;
    limit?: number;
  }) {
    const { pospId, lob, status, periodMonth, periodYear, page = 1, limit = 20 } = filters;
    const where: any = {};

    if (pospId) where.pospId = pospId;
    if (lob) where.lob = lob;
    if (status) where.status = status;
    if (periodMonth) where.periodMonth = periodMonth;
    if (periodYear) where.periodYear = periodYear;

    const [data, total, aggregates] = await Promise.all([
      this.prisma.brokeragePayoutRecord.findMany({
        where,
        orderBy: { calculatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.brokeragePayoutRecord.count({ where }),
      this.prisma.brokeragePayoutRecord.aggregate({
        where,
        _sum: {
          agentPayoutAmt: true,
          trustnerRetainAmt: true,
          tdsAmount: true,
          netPayout: true,
        },
        _count: true,
      }),
    ]);

    // Enrich with POSP names
    const pospIds = [...new Set(data.map(d => d.pospId))];
    const posps = pospIds.length > 0
      ? await this.prisma.pOSPAgent.findMany({
          where: { id: { in: pospIds } },
          select: { id: true, firstName: true, lastName: true, pospCode: true },
        })
      : [];
    const pospMap = new Map(posps.map(p => [p.id, p]));

    const enriched = data.map(d => ({
      ...d,
      pospName: pospMap.has(d.pospId)
        ? `${pospMap.get(d.pospId).firstName} ${pospMap.get(d.pospId).lastName}`
        : 'Unknown',
      pospCode: pospMap.get(d.pospId)?.pospCode || '',
    }));

    return {
      data: enriched,
      summary: {
        totalPayouts: aggregates._count,
        totalAgentPayout: Number(aggregates._sum.agentPayoutAmt || 0),
        totalTrustnerRetains: Number(aggregates._sum.trustnerRetainAmt || 0),
        totalTds: Number(aggregates._sum.tdsAmount || 0),
        totalNetPayout: Number(aggregates._sum.netPayout || 0),
      },
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /** Approve a payout record */
  async approvePayout(id: string, approvedBy: string) {
    return this.prisma.brokeragePayoutRecord.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        approvedBy,
      },
    });
  }

  /** Mark a payout as paid */
  async markPayoutPaid(id: string, bankRefNumber: string) {
    return this.prisma.brokeragePayoutRecord.update({
      where: { id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        bankRefNumber,
      },
    });
  }

  /** Get payout summary for a POSP */
  async getPospPayoutSummary(pospId: string) {
    const [categories, payouts] = await Promise.all([
      this.getPospCategories(pospId),
      this.prisma.brokeragePayoutRecord.groupBy({
        by: ['lob', 'status'],
        where: { pospId },
        _sum: { agentPayoutAmt: true, netPayout: true },
        _count: true,
      }),
    ]);

    return {
      categories,
      payoutsByLob: payouts.map(p => ({
        lob: p.lob,
        status: p.status,
        count: p._count,
        totalPayout: Number(p._sum.agentPayoutAmt || 0),
        netPayout: Number(p._sum.netPayout || 0),
      })),
    };
  }

  // =========================================================================
  // QUICK CALCULATOR (no DB record, just returns breakdown)
  // =========================================================================

  /** Quick calculate without creating a record */
  async quickCalculate(params: {
    trustnerCommPct: number;
    category: string;
    premiumAmount: number;
  }) {
    const { trustnerCommPct, category, premiumAmount } = params;
    const tier = getTier(trustnerCommPct);

    // Try DB config first, fallback to defaults
    const sharingConfig = await this.prisma.tierSharingConfig.findFirst({
      where: {
        category: category as any,
        tier: tier as any,
        isActive: true,
      },
      orderBy: { effectiveFrom: 'desc' },
    });
    const sharingPct = sharingConfig
      ? Number(sharingConfig.sharingPercent)
      : DEFAULT_TIER_SHARING[category]?.[tier] ?? 50;

    const agentPayoutPct = +(trustnerCommPct * sharingPct / 100).toFixed(4);
    const agentPayoutAmt = +(premiumAmount * agentPayoutPct / 100).toFixed(4);
    const trustnerCommAmt = +(premiumAmount * trustnerCommPct / 100).toFixed(4);
    const trustnerRetainAmt = +(trustnerCommAmt - agentPayoutAmt).toFixed(4);
    const tdsAmount = +(agentPayoutAmt * 5 / 100).toFixed(2);
    const netPayout = +(agentPayoutAmt - tdsAmount).toFixed(2);

    return {
      tier,
      category,
      sharingPct,
      trustnerCommPct,
      agentPayoutPct,
      premiumAmount,
      trustnerCommAmt,
      agentPayoutAmt,
      trustnerRetainAmt,
      tdsAmount,
      netPayout,
    };
  }

  // =========================================================================
  // SEED DATA
  // =========================================================================

  /** Seed the tier sharing matrix (30 configs) */
  async seedTierSharing() {
    const categories = CATEGORY_ORDER;
    const tiers = ['HIGH', 'MEDIUM', 'LOW'] as const;
    let created = 0;

    for (const cat of categories) {
      for (const tier of tiers) {
        const existing = await this.prisma.tierSharingConfig.findFirst({
          where: { category: cat as any, tier: tier as any, isActive: true },
        });
        if (!existing) {
          await this.prisma.tierSharingConfig.create({
            data: {
              category: cat as any,
              tier: tier as any,
              sharingPercent: DEFAULT_TIER_SHARING[cat][tier],
              isActive: true,
            },
          });
          created++;
        }
      }
    }
    return { created, message: `Seeded ${created} tier sharing configs` };
  }

  /** Seed product catalog from data */
  async seedProducts(products: Array<{
    lob: string;
    productLine: string;
    productName: string;
    insurer: string;
    trustnerCommission: number;
    basis: string;
  }>) {
    // Clear existing and re-seed
    const existing = await this.prisma.commissionProduct.count();
    if (existing > 0) {
      return { created: 0, message: `Product catalog already has ${existing} products. Skipping seed.` };
    }

    const data = products.map(p => ({
      lob: p.lob as any,
      productLine: p.productLine,
      productName: p.productName,
      insurer: p.insurer,
      trustnerCommission: p.trustnerCommission,
      basis: p.basis,
      isActive: true,
    }));

    await this.prisma.commissionProduct.createMany({ data });
    return { created: data.length, message: `Seeded ${data.length} products` };
  }

  /** Get dashboard stats for POSP category system */
  async getDashboardStats() {
    const [
      totalProducts,
      totalAssignments,
      totalPayoutRecords,
      categoryDistribution,
      payoutsByStatus,
    ] = await Promise.all([
      this.prisma.commissionProduct.count({ where: { isActive: true } }),
      this.prisma.pospCategoryAssignment.count({ where: { effectiveTo: null } }),
      this.prisma.brokeragePayoutRecord.count(),
      this.prisma.pospCategoryAssignment.groupBy({
        by: ['category'],
        where: { effectiveTo: null },
        _count: true,
      }),
      this.prisma.brokeragePayoutRecord.groupBy({
        by: ['status'],
        _sum: { agentPayoutAmt: true, netPayout: true },
        _count: true,
      }),
    ]);

    return {
      totalProducts,
      totalAssignments,
      totalPayoutRecords,
      categoryDistribution: categoryDistribution.map(c => ({
        category: c.category,
        count: c._count,
      })),
      payoutsByStatus: payoutsByStatus.map(p => ({
        status: p.status,
        count: p._count,
        totalPayout: Number(p._sum.agentPayoutAmt || 0),
        netPayout: Number(p._sum.netPayout || 0),
      })),
    };
  }
}
