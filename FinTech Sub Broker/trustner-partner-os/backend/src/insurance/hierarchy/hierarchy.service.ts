import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHierarchyLevelDto } from './dto/create-hierarchy-level.dto';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';

@Injectable()
export class HierarchyService {
  constructor(private readonly prisma: PrismaService) {}

  async createHierarchyLevel(dto: CreateHierarchyLevelDto) {
    const existing = await this.prisma.hierarchyLevel.findFirst({
      where: { OR: [{ levelNumber: dto.levelNumber }, { levelCode: dto.levelCode }] },
    });
    if (existing) {
      throw new ConflictException('Level number or code already exists');
    }
    return this.prisma.hierarchyLevel.create({ data: dto });
  }

  async getHierarchyLevels() {
    return this.prisma.hierarchyLevel.findMany({
      where: { isActive: true },
      orderBy: { levelNumber: 'asc' },
      include: { _count: { select: { nodes: true } } },
    });
  }

  async updateHierarchyLevel(id: string, dto: Partial<CreateHierarchyLevelDto> & { isActive?: boolean }) {
    const level = await this.prisma.hierarchyLevel.findUnique({ where: { id } });
    if (!level) throw new NotFoundException('Hierarchy level not found');
    return this.prisma.hierarchyLevel.update({ where: { id }, data: dto });
  }

  async createNode(dto: CreateNodeDto) {
    if (dto.parentId) {
      const parent = await this.prisma.salesHierarchyNode.findUnique({ where: { id: dto.parentId } });
      if (!parent) throw new NotFoundException('Parent node not found');
    }
    return this.prisma.salesHierarchyNode.create({
      data: {
        userId: dto.userId,
        hierarchyLevelId: dto.hierarchyLevelId,
        parentId: dto.parentId || null,
        departmentType: dto.departmentType as any,
        branchId: dto.branchId || null,
        regionName: dto.regionName || null,
      },
      include: {
        user: { select: { id: true, email: true, role: true, profile: { select: { firstName: true, lastName: true } } } },
        hierarchyLevel: true,
        parent: { include: { hierarchyLevel: true } },
      },
    });
  }

  async updateNode(id: string, dto: UpdateNodeDto) {
    const node = await this.prisma.salesHierarchyNode.findUnique({ where: { id } });
    if (!node) throw new NotFoundException('Hierarchy node not found');
    return this.prisma.salesHierarchyNode.update({
      where: { id },
      data: dto as any,
      include: {
        user: { select: { id: true, email: true, role: true, profile: { select: { firstName: true, lastName: true } } } },
        hierarchyLevel: true,
        parent: { include: { hierarchyLevel: true } },
      },
    });
  }

  async getNodeTree(rootId?: string) {
    const where: any = { isActive: true };
    if (rootId) {
      where.id = rootId;
    } else {
      where.parentId = null;
    }

    return this.prisma.salesHierarchyNode.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, role: true, profile: { select: { firstName: true, lastName: true } } } },
        hierarchyLevel: true,
        children: {
          where: { isActive: true },
          include: {
            user: { select: { id: true, email: true, role: true, profile: { select: { firstName: true, lastName: true } } } },
            hierarchyLevel: true,
            children: {
              where: { isActive: true },
              include: {
                user: { select: { id: true, email: true, role: true, profile: { select: { firstName: true, lastName: true } } } },
                hierarchyLevel: true,
                children: {
                  where: { isActive: true },
                  include: {
                    user: { select: { id: true, email: true, role: true, profile: { select: { firstName: true, lastName: true } } } },
                    hierarchyLevel: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { hierarchyLevel: { levelNumber: 'asc' } },
    });
  }

  async getNodeChildren(nodeId: string) {
    return this.prisma.salesHierarchyNode.findMany({
      where: { parentId: nodeId, isActive: true },
      include: {
        user: { select: { id: true, email: true, role: true, profile: { select: { firstName: true, lastName: true } } } },
        hierarchyLevel: true,
        _count: { select: { children: true } },
      },
      orderBy: { hierarchyLevel: { levelNumber: 'asc' } },
    });
  }

  async getUserHierarchyPosition(userId: string) {
    const node = await this.prisma.salesHierarchyNode.findFirst({
      where: { userId, isActive: true },
      include: {
        hierarchyLevel: true,
        parent: {
          include: {
            user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
            hierarchyLevel: true,
            parent: {
              include: {
                user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
                hierarchyLevel: true,
                parent: {
                  include: {
                    user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
                    hierarchyLevel: true,
                  },
                },
              },
            },
          },
        },
        _count: { select: { children: true } },
      },
    });
    if (!node) throw new NotFoundException('User has no hierarchy position');
    return node;
  }

  async getTeamMembers(nodeId: string) {
    const collectDescendants = async (parentId: string): Promise<any[]> => {
      const children = await this.prisma.salesHierarchyNode.findMany({
        where: { parentId, isActive: true },
        include: {
          user: { select: { id: true, email: true, role: true, profile: { select: { firstName: true, lastName: true } } } },
          hierarchyLevel: true,
        },
      });
      const allDescendants = [...children];
      for (const child of children) {
        const grandchildren = await collectDescendants(child.id);
        allDescendants.push(...grandchildren);
      }
      return allDescendants;
    };

    return collectDescendants(nodeId);
  }

  async getDepartmentHierarchy(department: string) {
    return this.prisma.salesHierarchyNode.findMany({
      where: { departmentType: department as any, isActive: true, parentId: null },
      include: {
        user: { select: { id: true, email: true, role: true, profile: { select: { firstName: true, lastName: true } } } },
        hierarchyLevel: true,
        children: {
          where: { isActive: true },
          include: {
            user: { select: { id: true, email: true, role: true, profile: { select: { firstName: true, lastName: true } } } },
            hierarchyLevel: true,
            children: {
              where: { isActive: true },
              include: {
                user: { select: { id: true, email: true, role: true, profile: { select: { firstName: true, lastName: true } } } },
                hierarchyLevel: true,
                children: {
                  where: { isActive: true },
                  include: {
                    user: { select: { id: true, email: true, role: true, profile: { select: { firstName: true, lastName: true } } } },
                    hierarchyLevel: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
