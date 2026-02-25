const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const OLD_ADMIN_EMAIL = 'ahmedahmed48dzdz@gmail.com';
const NEW_ADMIN_EMAIL = 'ahmedahmd783ei@gmail.com';

async function updateAccounts() {
    console.log('Connecting to Neon DB to update accounts...');
    try {
        // 1. Change old admin to WORKSHOP
        const oldAdmin = await prisma.user.findUnique({
            where: { email: OLD_ADMIN_EMAIL }
        });

        if (oldAdmin) {
            await prisma.user.update({
                where: { id: oldAdmin.id },
                data: { role: 'WORKSHOP' }
            });
            console.log(`✅ Changed ${OLD_ADMIN_EMAIL} to WORKSHOP role.`);

            // Ensure they have a workshop profile
            const existingWorkshop = await prisma.workshop.findUnique({
                where: { ownerId: oldAdmin.id }
            });

            if (!existingWorkshop) {
                await prisma.workshop.create({
                    data: {
                        name: 'ورشة أحمد',
                        description: 'ورشة جديدة',
                        location: 'Alger',
                        phone: '',
                        skills: '',
                        ownerId: oldAdmin.id
                    }
                });
                console.log(`✅ Created a default workshop profile for ${OLD_ADMIN_EMAIL}.`);
            }
        } else {
            console.log(`⚠️ Could not find old admin: ${OLD_ADMIN_EMAIL}`);
        }

        // 2. Create New Admin Account
        const newAdminExists = await prisma.user.findUnique({
            where: { email: NEW_ADMIN_EMAIL }
        });

        if (newAdminExists) {
            await prisma.user.update({
                where: { id: newAdminExists.id },
                data: { role: 'ADMIN', isEmailVerified: true }
            });
            console.log(`✅ ${NEW_ADMIN_EMAIL} already existed. Updated their role to ADMIN.`);
        } else {
            // Hash a default password (they can change it later, or log in with Google since we set authProvider to GOOGLE/LOCAL)
            const hashedPassword = await bcrypt.hash('Admin@123456', 10);

            await prisma.user.create({
                data: {
                    name: 'Admin',
                    email: NEW_ADMIN_EMAIL,
                    password: hashedPassword,
                    role: 'ADMIN',
                    isEmailVerified: true,
                    authProvider: 'LOCAL'
                }
            });
            console.log(`✅ Created new ADMIN account for ${NEW_ADMIN_EMAIL} with default password 'Admin@123456'.`);
        }

        console.log('-----------------------------------');
        console.log('🎉 Account updates completed successfully!');
        console.log('-----------------------------------');
    } catch (error) {
        console.error('Error during account update:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateAccounts();
