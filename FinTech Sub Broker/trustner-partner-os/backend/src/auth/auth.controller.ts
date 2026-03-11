import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  /**
   * Login with email and password
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const ipAddress = req.ip || req.socket?.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    return this.authService.login(loginDto.email, loginDto.password, ipAddress, userAgent);
  }

  /**
   * Refresh access token
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  /**
   * Get current user profile
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get current user profile' })
  async getCurrentUser(@CurrentUser() user: any) {
    return this.authService.getUserById(user.id);
  }

  /**
   * Change password (authenticated user)
   */
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password' })
  async changePassword(
    @CurrentUser() user: any,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    if (!body.oldPassword || !body.newPassword) {
      throw new BadRequestException('Both oldPassword and newPassword are required');
    }
    return this.authService.changePassword(user.id, body.oldPassword, body.newPassword);
  }

  /**
   * Logout user
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  async logout(@CurrentUser() user: any) {
    return this.authService.logout(user.id);
  }

  // ============================================================================
  // ADMIN USER MANAGEMENT ENDPOINTS
  // ============================================================================

  /**
   * Admin creates a new user
   */
  @Post('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL_OFFICER)
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Admin creates a new user' })
  async createUser(
    @CurrentUser() admin: any,
    @Body() body: { email: string; name: string; phone?: string; role: UserRole },
  ) {
    if (!body.email || !body.name || !body.role) {
      throw new BadRequestException('email, name, and role are required');
    }
    return this.authService.createUser(admin.id, body);
  }

  /**
   * List all users (admin only)
   */
  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL_OFFICER, UserRole.MIS_MANAGER)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'List all users' })
  async listUsers(
    @Query('role') role?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '50', 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (role) {
      where.role = role;
    }
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          isActive: true,
          isApproved: true,
          mustChangePassword: true,
          lastLoginAt: true,
          createdAt: true,
          approvedBy: true,
          approvedAt: true,
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Get single user details (admin)
   */
  @Get('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL_OFFICER, UserRole.MIS_MANAGER)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUser(@Param('id') id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        isApproved: true,
        mustChangePassword: true,
        lastLoginAt: true,
        lastLoginIp: true,
        failedAttempts: true,
        createdAt: true,
        updatedAt: true,
        approvedBy: true,
        approvedAt: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  /**
   * Admin deactivate/activate user
   */
  @Post('users/:id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL_OFFICER)
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle user active status' })
  async toggleUserActive(@CurrentUser() admin: any, @Param('id') id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('User not found');

    const updated = await this.prismaService.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: { id: true, email: true, isActive: true },
    });

    await this.prismaService.auditLog.create({
      data: {
        userId: admin.id,
        action: updated.isActive ? 'APPROVE' : 'USER_DEACTIVATED',
        entity: 'User',
        entityId: id,
        description: `Admin ${updated.isActive ? 'activated' : 'deactivated'} user: ${user.email}`,
      },
    });

    return updated;
  }

  /**
   * Admin reset user password
   */
  @Post('users/:id/reset-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL_OFFICER)
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user password' })
  async resetUserPassword(@CurrentUser() admin: any, @Param('id') id: string) {
    return this.authService.resetUserPassword(admin.id, id);
  }

  /**
   * Update user role (admin only)
   */
  @Post('users/:id/update-role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL_OFFICER)
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user role' })
  async updateUserRole(
    @CurrentUser() admin: any,
    @Param('id') id: string,
    @Body() body: { role: UserRole },
  ) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('User not found');

    const updated = await this.prismaService.user.update({
      where: { id },
      data: { role: body.role },
      select: { id: true, email: true, role: true },
    });

    await this.prismaService.auditLog.create({
      data: {
        userId: admin.id,
        action: 'UPDATE',
        entity: 'User',
        entityId: id,
        oldValue: { role: user.role },
        newValue: { role: body.role },
        description: `Admin changed role for ${user.email}: ${user.role} -> ${body.role}`,
      },
    });

    return updated;
  }

  // ============================================================================
  // AUDIT LOG ENDPOINTS
  // ============================================================================

  /**
   * Get audit logs (admin only)
   */
  @Get('audit-logs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL_OFFICER, UserRole.MIS_MANAGER)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get audit logs' })
  async getAuditLogs(
    @Query('action') action?: string,
    @Query('entity') entity?: string,
    @Query('userId') userId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '50', 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (action) where.action = action;
    if (entity) where.entity = entity;
    if (userId) where.userId = userId;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const [logs, total] = await Promise.all([
      this.prismaService.auditLog.findMany({
        where,
        include: {
          user: {
            select: { id: true, email: true, name: true, role: true },
          },
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Get login logs specifically
   */
  @Get('login-logs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL_OFFICER, UserRole.MIS_MANAGER)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get login/logout logs' })
  async getLoginLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '50', 10);
    const skip = (pageNum - 1) * limitNum;

    const where = {
      action: { in: ['LOGIN', 'LOGIN_FAILED', 'LOGOUT'] as any },
    };

    const [logs, total] = await Promise.all([
      this.prismaService.auditLog.findMany({
        where,
        include: {
          user: {
            select: { id: true, email: true, name: true, role: true },
          },
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }
}
