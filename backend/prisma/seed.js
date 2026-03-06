const prisma = require('../src/config/prisma');
const bcrypt = require('bcryptjs');

/**
 * Seed script — creates a default ADMIN user.
 * Run with: npx prisma db seed
 */
async function main() {
    console.log('🌱  Seeding database...');

    // ── Default Admin ──
    const adminPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@buraqschool.com' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@buraqschool.com',
            username: 'admin',
            password: adminPassword,
            phone: null,
            role: 'ADMIN',
        },
    });

    console.log(`✅  Admin user seeded: ${admin.email} (id: ${admin.id})`);
}

main()
    .catch((e) => {
        console.error('❌  Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
