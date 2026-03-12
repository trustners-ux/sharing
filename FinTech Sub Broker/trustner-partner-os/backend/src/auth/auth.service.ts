import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { UserRole, AuditAction } from '@prisma/client';

/**
 * Authentication Service
 * Core authentication and authorization logic
 * - User registration with admin approval workflow
 * - Login with JWT token generation + audit logging
 * - Token refresh
 * - Password management (change, reset, force-change on first login)
 * - Login attempt tracking and account lockout
 * - Random password generation for admin-created users
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  private readonly PASSWORD_HASH_ROUNDS = 12;
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION_MINUTES = 30;

  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Generate random alphanumeric password (min 8 chars)
   */
  generateRandomPassword(length = 10): string {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const special = '@#$!&';
    const all = upper + lower + digits + special;

    // Ensure at least one of each category
    let password = '';
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += digits[Math.floor(Math.random() * digits.length)];
    password += special[Math.floor(Math.random() * special.length)];

    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  /**
   * Validate password meets requirements: min 8 chars, alphanumeric
   */
  validatePasswordStrength(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Za-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    return { valid: true };
  }

  /**
   * Admin creates a new user (with approval)
   * Password is auto-generated and should be sent via email
   */
  async createUser(
    adminId: string,
    data: {
      email: string;
      name: string;
      phone?: string;
      role: UserRole;
    },
  ) {
    const existing = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException(`User with email ${data.email} already exists`);
    }

    const tempPassword = this.generateRandomPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, this.PASSWORD_HASH_ROUNDS);

    const user = await this.prismaService.user.create({
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone || null,
        passwordHash: hashedPassword,
        role: data.role,
        isActive: true,
        isApproved: true,
        mustChangePassword: true,
        isEmailVerified: false,
        approvedBy: adminId,
        approvedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        isApproved: true,
        mustChangePassword: true,
        createdAt: true,
      },
    });

    // Audit log
    await this.prismaService.auditLog.create({
      data: {
        userId: adminId,
        action: AuditAction.USER_CREATED,
        entity: 'User',
        entityId: user.id,
        newValue: { email: data.email, role: data.role, name: data.name },
        description: `Admin created user: ${data.email} with role ${data.role}`,
      },
    });

    this.logger.log(`User created by admin: ${data.email} (${data.role})`);

    return {
      user,
      tempPassword, // This should be sent via email to the user
      message: `User created successfully. Temporary password: ${tempPassword}. User must change password on first login.`,
    };
  }

  /**
   * Login with email and password
   * Returns access and refresh tokens
   */
  async login(email: string, password: string, ipAddress?: string, userAgent?: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Log failed login attempt
      await this.logAudit(null, AuditAction.LOGIN_FAILED, 'User', null, {
        email,
        reason: 'User not found',
        ipAddress,
      });
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesRemaining = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / (1000 * 60),
      );
      await this.logAudit(user.id, AuditAction.LOGIN_FAILED, 'User', user.id, {
        reason: 'Account locked',
        minutesRemaining,
        ipAddress,
      });
      throw new UnauthorizedException(
        `Account is locked. Try again in ${minutesRemaining} minutes`,
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      const newAttempts = user.failedAttempts + 1;
      let lockoutUntil = null;

      if (newAttempts >= this.MAX_LOGIN_ATTEMPTS) {
        lockoutUntil = new Date(Date.now() + this.LOCKOUT_DURATION_MINUTES * 60 * 1000);
        this.logger.warn(`Account locked due to max login attempts: ${email}`);
      }

      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: newAttempts,
          lockedUntil: lockoutUntil,
        },
      });

      await this.logAudit(user.id, AuditAction.LOGIN_FAILED, 'User', user.id, {
        reason: 'Invalid password',
        attempts: newAttempts,
        ipAddress,
      });

      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      await this.logAudit(user.id, AuditAction.LOGIN_FAILED, 'User', user.id, {
        reason: 'Account deactivated',
        ipAddress,
      });
      throw new UnauthorizedException('User account is deactivated');
    }

    // Check if user is approved
    if (!user.isApproved) {
      await this.logAudit(user.id, AuditAction.LOGIN_FAILED, 'User', user.id, {
        reason: 'Account not approved',
        ipAddress,
      });
      throw new UnauthorizedException('User account is pending admin approval');
    }

    // Reset login attempts on successful login
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        failedAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress || null,
      },
    });

    // Generate tokens
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_EXPIRY || '3600s',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRY || '604800s',
    });

    // Log successful login
    await this.logAudit(user.id, AuditAction.LOGIN, 'User', user.id, {
      ipAddress,
      userAgent,
    });

    this.logger.log(`User logged in successfully: ${email}`);

    // Fetch profile for avatar
    const profile = await this.prismaService.userProfile.findUnique({
      where: { userId: user.id },
      select: { avatarUrl: true },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
        avatarUrl: profile?.avatarUrl || null,
      },
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const newAccessToken = this.jwtService.sign(
        {
          id: payload.id,
          email: payload.email,
          role: payload.role,
        },
        {
          expiresIn: process.env.JWT_ACCESS_EXPIRY || '3600s',
        },
      );

      return {
        accessToken: newAccessToken,
        refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Change user password (requires current password)
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Validate new password strength
    const validation = this.validatePasswordStrength(newPassword);
    if (!validation.valid) {
      throw new BadRequestException(validation.message);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, this.PASSWORD_HASH_ROUNDS);

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        passwordHash: hashedPassword,
        mustChangePassword: false,
      },
    });

    await this.logAudit(userId, AuditAction.PASSWORD_CHANGE, 'User', userId, {
      description: 'Password changed by user',
    });

    this.logger.log(`Password changed for user: ${user.email}`);

    return { message: 'Password changed successfully' };
  }

  /**
   * Admin reset password for a user
   */
  async resetUserPassword(adminId: string, targetUserId: string) {
    const targetUser = await this.prismaService.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new BadRequestException('User not found');
    }

    const tempPassword = this.generateRandomPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, this.PASSWORD_HASH_ROUNDS);

    await this.prismaService.user.update({
      where: { id: targetUserId },
      data: {
        passwordHash: hashedPassword,
        mustChangePassword: true,
        failedAttempts: 0,
        lockedUntil: null,
      },
    });

    await this.logAudit(adminId, AuditAction.PASSWORD_RESET, 'User', targetUserId, {
      description: `Admin reset password for user: ${targetUser.email}`,
    });

    this.logger.log(`Password reset by admin for user: ${targetUser.email}`);

    return {
      message: `Password reset successful. New temporary password: ${tempPassword}`,
      tempPassword,
      userEmail: targetUser.email,
    };
  }

  /**
   * Validate user from JWT payload
   */
  async validateUser(payload: any) {
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  /**
   * Logout user
   */
  async logout(userId: string) {
    await this.logAudit(userId, AuditAction.LOGOUT, 'User', userId, {});

    this.logger.log(`User logged out: ${userId}`);
    return { message: 'Logged out successfully' };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        isApproved: true,
        mustChangePassword: true,
        createdAt: true,
        lastLoginAt: true,
        profile: {
          select: {
            avatarUrl: true,
            firstName: true,
            lastName: true,
            displayName: true,
          },
        },
      },
    });
  }

  /**
   * Helper: log audit entry
   */
  private async logAudit(
    userId: string | null,
    action: AuditAction,
    entity: string,
    entityId: string | null,
    details: Record<string, any>,
  ) {
    try {
      await this.prismaService.auditLog.create({
        data: {
          userId,
          action,
          entity,
          entityId,
          newValue: details,
          ipAddress: details.ipAddress || null,
          userAgent: details.userAgent || null,
          description: details.description || `${action} on ${entity}`,
        },
      });
    } catch (e) {
      this.logger.error(`Failed to write audit log: ${e.message}`);
    }
  }
}
