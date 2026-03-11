import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContestDto } from './dto/create-contest.dto';
import { AddMetricDto } from './dto/add-metric.dto';

@Injectable()
export class ContestService {
  constructor(private readonly prisma: PrismaService) {}

  private generateContestCode(type: string, startDate: Date): string {
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, '0');
    const quarter = Math.ceil((startDate.getMonth() + 1) / 3);
    const rand = String(Math.floor(100 + Math.random() * 900));
    if (type === 'QUARTERLY' || type === 'HALF_YEARLY') return `CONTEST-${year}-Q${quarter}-${rand}`;
    return `CONTEST-${year}-M${month}-${rand}`;
  }

  async createContest(dto: CreateContestDto, userId: string) {
    const totalWeight = dto.metrics.reduce((sum, m) => sum + m.weight, 0);
    if (totalWeight !== 100) throw new BadRequestException(`Metric weights must sum to 100, got ${totalWeight}`);

    return this.prisma.contest.create({
      data: {
        contestCode: this.generateContestCode(dto.type, new Date(dto.startDate)),
        name: dto.name,
        description: dto.description || null,
        type: dto.type as any,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        departmentFilter: (dto.departmentFilter as any) || null,
        hierarchyLevelFilter: dto.hierarchyLevelFilter || null,
        createdBy: userId,
        metrics: {
          create: dto.metrics.map((m) => ({
            metricType: m.metricType as any,
            weight: m.weight,
            targetValue: m.targetValue || null,
            description: m.description || null,
          })),
        },
      },
      include: { metrics: true },
    });
  }

  async updateContest(id: string, dto: Partial<CreateContestDto>) {
    const contest = await this.prisma.contest.findUnique({ where: { id } });
    if (!contest) throw new NotFoundException('Contest not found');
    if (contest.status !== 'DRAFT') throw new BadRequestException('Can only update DRAFT contests');

    const data: any = {};
    if (dto.name) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    if (dto.departmentFilter !== undefined) data.departmentFilter = dto.departmentFilter || null;

    return this.prisma.contest.update({ where: { id }, data, include: { metrics: true } });
  }

  async activateContest(id: string) {
    const contest = await this.prisma.contest.findUnique({ where: { id }, include: { metrics: true } });
    if (!contest) throw new NotFoundException('Contest not found');
    if (contest.status !== 'DRAFT') throw new BadRequestException('Contest is not in DRAFT status');
    if (contest.metrics.length === 0) throw new BadRequestException('Contest must have at least one metric');

    // Auto-enroll participants
    const nodeWhere: any = { isActive: true };
    if (contest.departmentFilter) nodeWhere.departmentType = contest.departmentFilter;
    if (contest.hierarchyLevelFilter) {
      const level = await this.prisma.hierarchyLevel.findFirst({ where: { levelNumber: contest.hierarchyLevelFilter } });
      if (level) nodeWhere.hierarchyLevelId = level.id;
    }

    const nodes = await this.prisma.salesHierarchyNode.findMany({ where: nodeWhere });

    const contestEntries = nodes.map((node) => ({
      contestId: id,
      participantUserId: node.userId,
      hierarchyNodeId: node.id,
    }));

    if (contestEntries.length > 0) {
      await this.prisma.contestEntry.createMany({ data: contestEntries, skipDuplicates: true });
    }

    const updated = await this.prisma.contest.update({
      where: { id },
      data: { status: 'ACTIVE' },
      include: { metrics: true, _count: { select: { entries: true } } },
    });

    return { ...updated, enrolledCount: contestEntries.length };
  }

  async closeContest(id: string) {
    await this.calculateEntries(id);
    return this.prisma.contest.update({
      where: { id },
      data: { status: 'COMPLETED' },
      include: { metrics: true, entries: { orderBy: { rank: 'asc' }, take: 10, include: { hierarchyNode: { include: { hierarchyLevel: true, user: { select: { email: true, profile: { select: { firstName: true, lastName: true } } } } } } } } },
    });
  }

  async findAll(page = 1, limit = 20, filters?: { status?: string; type?: string }) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.type) where.type = filters.type;

    const [data, total] = await Promise.all([
      this.prisma.contest.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { metrics: true, _count: { select: { entries: true } } } }),
      this.prisma.contest.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const contest = await this.prisma.contest.findUnique({
      where: { id },
      include: { metrics: true, entries: { orderBy: { rank: 'asc' }, take: 20, include: { hierarchyNode: { include: { hierarchyLevel: true, user: { select: { email: true, profile: { select: { firstName: true, lastName: true } } } } } } } } },
    });
    if (!contest) throw new NotFoundException('Contest not found');
    return contest;
  }

  async addMetric(contestId: string, dto: AddMetricDto) {
    const existing = await this.prisma.contestMetric.findMany({ where: { contestId } });
    const currentWeight = existing.reduce((sum, m) => sum + Number(m.weight), 0);
    if (currentWeight + dto.weight > 100) throw new BadRequestException(`Adding this metric would exceed 100% total weight (current: ${currentWeight}%)`);

    return this.prisma.contestMetric.create({
      data: { contestId, metricType: dto.metricType as any, weight: dto.weight, targetValue: dto.targetValue || null, description: dto.description || null },
    });
  }

  async removeMetric(contestId: string, metricId: string) {
    return this.prisma.contestMetric.delete({ where: { id: metricId } });
  }

  async calculateEntries(contestId: string) {
    const contest = await this.prisma.contest.findUnique({ where: { id: contestId }, include: { metrics: true, entries: true } });
    if (!contest) throw new NotFoundException('Contest not found');

    for (const entry of contest.entries) {
      // Query verified MIS entries for this participant in contest period
      const misEntries = await this.prisma.mISEntry.findMany({
        where: {
          pospId: entry.participantUserId,
          status: 'VERIFIED',
          createdAt: { gte: contest.startDate, lte: contest.endDate },
        },
      });

      const premiumVolume = misEntries.reduce((sum, e) => sum + Number(e.grossPremium || 0), 0);
      const policyCount = misEntries.length;
      const newCustomers = misEntries.filter((e) => e.isNewCustomer).length;
      const renewals = misEntries.filter((e) => e.isRenewal).length;
      const commissionEarned = misEntries.reduce((sum, e) => sum + Number(e.commissionAmount || 0), 0);

      // Calculate weighted score
      let weightedScore = 0;
      for (const metric of contest.metrics) {
        let achieved = 0;
        switch (metric.metricType) {
          case 'PREMIUM_VOLUME': achieved = premiumVolume; break;
          case 'POLICY_COUNT': achieved = policyCount; break;
          case 'NEW_CUSTOMERS': achieved = newCustomers; break;
          case 'RENEWALS': achieved = renewals; break;
          case 'COMMISSION_EARNED': achieved = commissionEarned; break;
        }
        const target = Number(metric.targetValue) || 1;
        weightedScore += (achieved / target) * Number(metric.weight);
      }

      await this.prisma.contestEntry.update({
        where: { id: entry.id },
        data: { premiumVolume, policyCount, newCustomers, renewals, commissionEarned, weightedScore, lastCalculatedAt: new Date() },
      });
    }

    // Rank entries
    const rankedEntries = await this.prisma.contestEntry.findMany({
      where: { contestId },
      orderBy: { weightedScore: 'desc' },
    });

    for (let i = 0; i < rankedEntries.length; i++) {
      await this.prisma.contestEntry.update({
        where: { id: rankedEntries[i].id },
        data: { rank: i + 1 },
      });
    }

    return { calculated: rankedEntries.length };
  }

  async getLeaderboard(contestId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.contestEntry.findMany({
        where: { contestId },
        skip,
        take: limit,
        orderBy: { rank: 'asc' },
        include: { hierarchyNode: { include: { hierarchyLevel: true, user: { select: { email: true, profile: { select: { firstName: true, lastName: true } } } } } } },
      }),
      this.prisma.contestEntry.count({ where: { contestId } }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getMyPerformance(userId: string, contestId?: string) {
    const where: any = { participantUserId: userId };
    if (contestId) where.contestId = contestId;

    return this.prisma.contestEntry.findMany({
      where,
      include: { contest: { include: { metrics: true } } },
      orderBy: { contest: { startDate: 'desc' } },
    });
  }
}
