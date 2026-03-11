import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AssignGradeDto } from './dto/assign-grade.dto';

@Injectable()
export class ProductGradeService {
  constructor(private readonly prisma: PrismaService) {}

  async assignGrade(dto: AssignGradeDto) {
    const product = await this.prisma.insuranceProduct.findUnique({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    await this.prisma.productGrade.updateMany({
      where: { productId: dto.productId, isActive: true },
      data: { isActive: false, effectiveTo: new Date() },
    });

    return this.prisma.productGrade.create({
      data: {
        productId: dto.productId,
        grade: dto.grade as any,
        commissionTier: dto.commissionTier || null,
        complexityLevel: dto.complexityLevel as any,
        description: dto.description || null,
      },
      include: { product: { include: { company: true } } },
    });
  }

  async getGrade(productId: string) {
    const grade = await this.prisma.productGrade.findFirst({
      where: { productId, isActive: true },
      include: { product: { include: { company: true } } },
    });
    if (!grade) throw new NotFoundException('No active grade found for this product');
    return grade;
  }

  async getAllGrades(filters?: { grade?: string; complexityLevel?: string; isActive?: boolean }) {
    const where: any = {};
    if (filters?.grade) where.grade = filters.grade;
    if (filters?.complexityLevel) where.complexityLevel = filters.complexityLevel;
    where.isActive = filters?.isActive !== undefined ? filters.isActive : true;

    return this.prisma.productGrade.findMany({
      where,
      include: { product: { include: { company: true } } },
      orderBy: [{ grade: 'asc' }, { product: { productName: 'asc' } }],
    });
  }

  async updateGrade(id: string, dto: Partial<AssignGradeDto>) {
    const existing = await this.prisma.productGrade.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Grade not found');

    await this.prisma.productGrade.update({
      where: { id },
      data: { isActive: false, effectiveTo: new Date() },
    });

    return this.prisma.productGrade.create({
      data: {
        productId: existing.productId,
        grade: (dto.grade || existing.grade) as any,
        commissionTier: dto.commissionTier !== undefined ? dto.commissionTier : existing.commissionTier,
        complexityLevel: (dto.complexityLevel || existing.complexityLevel) as any,
        description: dto.description !== undefined ? dto.description : existing.description,
      },
      include: { product: { include: { company: true } } },
    });
  }

  async autoGradeProducts() {
    const products = await this.prisma.insuranceProduct.findMany({
      where: { isActive: true },
      include: { commissionSlabs: { where: { isActive: true } }, company: true },
    });

    let gradedCount = 0;
    for (const product of products) {
      let commissionTier = 'LOW';
      if (product.commissionSlabs.length > 0) {
        const avgRate = product.commissionSlabs.reduce((sum, s) => sum + Number(s.brokerRate), 0) / product.commissionSlabs.length;
        if (avgRate > 15) commissionTier = 'HIGH';
        else if (avgRate >= 10) commissionTier = 'MEDIUM';
      }

      let complexityLevel = 'MEDIUM';
      const lob = product.lob;
      if (['LIFE_TERM', 'LIFE_ENDOWMENT', 'LIFE_ULIP', 'LIFE_WHOLE_LIFE'].includes(lob)) complexityLevel = 'HIGH';
      else if (lob.startsWith('HEALTH_')) complexityLevel = 'MEDIUM';
      else if (lob.startsWith('MOTOR_')) complexityLevel = 'LOW';
      else if (['MARINE', 'LIABILITY', 'CYBER'].includes(lob)) complexityLevel = 'VERY_HIGH';

      let grade = 'B';
      if (commissionTier === 'HIGH' && (complexityLevel === 'LOW' || complexityLevel === 'MEDIUM')) grade = 'A';
      else if (commissionTier === 'LOW' && (complexityLevel === 'HIGH' || complexityLevel === 'VERY_HIGH')) grade = 'D';
      else if (commissionTier === 'LOW' && (complexityLevel === 'LOW' || complexityLevel === 'MEDIUM')) grade = 'C';

      await this.prisma.productGrade.updateMany({
        where: { productId: product.id, isActive: true },
        data: { isActive: false, effectiveTo: new Date() },
      });

      await this.prisma.productGrade.create({
        data: {
          productId: product.id,
          grade: grade as any,
          commissionTier,
          complexityLevel: complexityLevel as any,
          description: `Auto-graded: ${commissionTier} commission, ${complexityLevel} complexity`,
        },
      });
      gradedCount++;
    }
    return { gradedCount, totalProducts: products.length };
  }

  async getGradeDistribution() {
    const byGrade = await this.prisma.productGrade.groupBy({
      by: ['grade'],
      where: { isActive: true },
      _count: { id: true },
    });
    const byComplexity = await this.prisma.productGrade.groupBy({
      by: ['complexityLevel'],
      where: { isActive: true },
      _count: { id: true },
    });
    return { byGrade, byComplexity };
  }
}
