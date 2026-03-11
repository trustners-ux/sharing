import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Database Seed Script
 * Creates initial MIS users for Trustner Partner OS
 *
 * Users:
 * 1. ram@trustner.in - SUPER_ADMIN (Admin)
 * 2. ajanta.saikia@trustner.in - PRINCIPAL_OFFICER (Principal Officer & Admin)
 * 3. trustnermis@gmail.com - MIS_MANAGER (Hirak Jyoti Das)
 * 4. rinjima.das@trustner.in - MIS_CHECKER (Checker Manager)
 *
 * Usage: npm run prisma:seed
 */
async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    const hashPassword = (password: string) => bcrypt.hashSync(password, 12);

    // ============================================================================
    // MIS USERS - Core Team
    // ============================================================================
    console.log('📝 Creating MIS users...');

    // 1. Super Admin - Ram
    const adminUser = await prisma.user.upsert({
      where: { email: 'ram@trustner.in' },
      update: {},
      create: {
        email: 'ram@trustner.in',
        name: 'Ram',
        phone: '+919876543210',
        passwordHash: hashPassword('Trustner@2026'),
        role: UserRole.SUPER_ADMIN,
        isActive: true,
        isApproved: true,
        mustChangePassword: true,
        isEmailVerified: true,
      },
    });
    console.log(`  ✓ Admin: ram@trustner.in (Password: Trustner@2026)`);

    // 2. Principal Officer - Ajanta Saikia
    const poUser = await prisma.user.upsert({
      where: { email: 'ajanta.saikia@trustner.in' },
      update: {},
      create: {
        email: 'ajanta.saikia@trustner.in',
        name: 'Ajanta Saikia',
        phone: '+919876543211',
        passwordHash: hashPassword('Trustner@2026'),
        role: UserRole.PRINCIPAL_OFFICER,
        isActive: true,
        isApproved: true,
        mustChangePassword: true,
        isEmailVerified: true,
        approvedBy: adminUser.id,
        approvedAt: new Date(),
      },
    });
    console.log(`  ✓ Principal Officer: ajanta.saikia@trustner.in (Password: Trustner@2026)`);

    // 3. MIS Manager - Hirak Jyoti Das
    const misManager = await prisma.user.upsert({
      where: { email: 'trustnermis@gmail.com' },
      update: {},
      create: {
        email: 'trustnermis@gmail.com',
        name: 'Hirak Jyoti Das',
        phone: '+919876543212',
        passwordHash: hashPassword('Trustner@2026'),
        role: UserRole.MIS_MANAGER,
        isActive: true,
        isApproved: true,
        mustChangePassword: true,
        isEmailVerified: true,
        approvedBy: adminUser.id,
        approvedAt: new Date(),
      },
    });
    console.log(`  ✓ MIS Manager: trustnermis@gmail.com (Password: Trustner@2026)`);

    // 4. Checker Manager - Rinjima Das
    const checkerUser = await prisma.user.upsert({
      where: { email: 'rinjima.das@trustner.in' },
      update: {},
      create: {
        email: 'rinjima.das@trustner.in',
        name: 'Rinjima Das',
        phone: '+919876543213',
        passwordHash: hashPassword('Trustner@2026'),
        role: UserRole.MIS_CHECKER,
        isActive: true,
        isApproved: true,
        mustChangePassword: true,
        isEmailVerified: true,
        approvedBy: adminUser.id,
        approvedAt: new Date(),
      },
    });
    console.log(`  ✓ Checker Manager: rinjima.das@trustner.in (Password: Trustner@2026)`);

    // ============================================================================
    // HIERARCHY LEVELS — SM → CDM → RM → POSP
    // ============================================================================
    console.log('\n📊 Creating hierarchy levels...');

    const levelSM = await prisma.hierarchyLevel.upsert({
      where: { levelCode: 'SM' },
      update: {},
      create: {
        levelNumber: 1,
        levelName: 'Senior Management',
        levelCode: 'SM',
        description: 'Top-level leadership with full access',
        isActive: true,
      },
    });
    console.log('  ✓ Level 1: Senior Management (SM)');

    const levelCDM = await prisma.hierarchyLevel.upsert({
      where: { levelCode: 'CDM' },
      update: {},
      create: {
        levelNumber: 2,
        levelName: 'Cluster Development Manager',
        levelCode: 'CDM',
        description: 'Manages a cluster of Relationship Managers',
        isActive: true,
      },
    });
    console.log('  ✓ Level 2: Cluster Development Manager (CDM)');

    const levelRM = await prisma.hierarchyLevel.upsert({
      where: { levelCode: 'RM' },
      update: {},
      create: {
        levelNumber: 3,
        levelName: 'Relationship Manager',
        levelCode: 'RM',
        description: 'Manages POSPs and handles day-to-day operations',
        isActive: true,
      },
    });
    console.log('  ✓ Level 3: Relationship Manager (RM)');

    const levelPOSP = await prisma.hierarchyLevel.upsert({
      where: { levelCode: 'POSP' },
      update: {},
      create: {
        levelNumber: 4,
        levelName: 'Point of Sale Person',
        levelCode: 'POSP',
        description: 'Field agent selling insurance policies',
        isActive: true,
      },
    });
    console.log('  ✓ Level 4: Point of Sale Person (POSP)');

    // ============================================================================
    // HIERARCHY NODES — Wire Ram as SM, Ajanta as CDM
    // ============================================================================
    console.log('\n🌳 Creating hierarchy nodes...');

    // Ram as Senior Management (top node)
    const existingSMNode = await prisma.salesHierarchyNode.findFirst({
      where: { userId: adminUser.id, hierarchyLevelId: levelSM.id },
    });
    if (!existingSMNode) {
      await prisma.salesHierarchyNode.create({
        data: {
          userId: adminUser.id,
          hierarchyLevelId: levelSM.id,
          parentId: null,
          isActive: true,
        },
      });
      console.log('  ✓ Ram → Senior Management (top node)');
    } else {
      console.log('  ⏩ Ram → Senior Management node already exists');
    }

    const smNode = await prisma.salesHierarchyNode.findFirst({
      where: { userId: adminUser.id, hierarchyLevelId: levelSM.id },
    });

    // Ajanta as CDM under Ram
    const existingCDMNode = await prisma.salesHierarchyNode.findFirst({
      where: { userId: poUser.id, hierarchyLevelId: levelCDM.id },
    });
    if (!existingCDMNode) {
      await prisma.salesHierarchyNode.create({
        data: {
          userId: poUser.id,
          hierarchyLevelId: levelCDM.id,
          parentId: smNode?.id || null,
          isActive: true,
        },
      });
      console.log('  ✓ Ajanta Saikia → CDM (under Ram)');
    } else {
      console.log('  ⏩ Ajanta Saikia → CDM node already exists');
    }

    // ============================================================================
    // SUMMARY
    // ============================================================================
    console.log('\n✅ Database seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   MIS Users: 4');
    console.log('   Hierarchy Levels: 4 (SM → CDM → RM → POSP)');
    console.log('   Hierarchy Nodes: 2 (Ram=SM, Ajanta=CDM)');
    console.log('\n🔐 Login Credentials (all users must change password on first login):');
    console.log('   1. ram@trustner.in / Trustner@2026 (SUPER_ADMIN)');
    console.log('   2. ajanta.saikia@trustner.in / Trustner@2026 (PRINCIPAL_OFFICER)');
    console.log('   3. trustnermis@gmail.com / Trustner@2026 (MIS_MANAGER)');
    console.log('   4. rinjima.das@trustner.in / Trustner@2026 (MIS_CHECKER)');
    console.log('\n🌳 Hierarchy: Ram (SM) → Ajanta (CDM) → [create RM users via admin]');
    console.log('\n⚠️  All users are required to change their password on first login.');
    console.log('   Password requirements: Min 8 characters, alphanumeric');

  } catch (error) {
    console.error('❌ Error during seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
