const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

// ✏️ غير هاذي القيم حسب ما تبي
const ADMIN_EMAIL = 'ahmedahmd783ei@gmail.com';
const NEW_PASSWORD = 'Admin@123456';

async function resetPassword() {
    try {
        console.log(`🔍 Searching for user: ${ADMIN_EMAIL}...`);

        const user = await prisma.user.findUnique({
            where: { email: ADMIN_EMAIL },
            select: { id: true, email: true, name: true, role: true }
        });

        if (!user) {
            console.log(`❌ User not found: ${ADMIN_EMAIL}`);
            return;
        }

        console.log(`✅ Found user: ${user.name} (${user.role})`);

        const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);

        await prisma.user.update({
            where: { email: ADMIN_EMAIL },
            data: {
                password: hashedPassword,
                isEmailVerified: true
            }
        });

        console.log(`\n🚀 Password reset DONE!`);
        console.log(`📧 Email: ${ADMIN_EMAIL}`);
        console.log(`🔑 New password: ${NEW_PASSWORD}`);
        console.log(`🛡️  Role: ${user.role}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

resetPassword();
