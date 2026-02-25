const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    // 1. Get credentials from secure environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@lamsadz.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234Secure';

    console.log(`Checking for admin user: ${adminEmail}...`);

    try {
        // 2. Check if admin already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            console.log('✅ Admin user already exists. No action needed.');
            return;
        }

        // 3. Create the admin securely
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const newAdmin = await prisma.user.create({
            data: {
                name: 'مدير النظام',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
                isEmailVerified: true, // Auto-verify the admin
                authProvider: 'LOCAL'
            }
        });

        console.log(`🚀 Success! Admin created successfully.`);
        console.log(`Email: ${newAdmin.email}`);
        console.log(`Password: (hidden)`);
        console.log(`===============================================`);
        console.log(`⚠️ IMPORTANT: Change the ADMIN_PASSWORD environment variable in production!`);

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
