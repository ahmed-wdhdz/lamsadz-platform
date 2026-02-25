const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmin() {
    console.log('Fetching ahmedahmd783ei@gmail.com...');
    try {
        const admin = await prisma.user.findUnique({
            where: { email: 'ahmedahmd783ei@gmail.com' }
        });

        if (admin) {
            console.log('Admin found:');
            console.log(`- ID: ${admin.id}`);
            console.log(`- Role: ${admin.role}`);
            console.log(`- Password Hash Length: ${admin.password ? admin.password.length : 'NULL'}`);
            console.log(`- Blocked: ${admin.blocked}`);
            console.log(`- Verified: ${admin.isEmailVerified}`);
            console.log(`- Provider: ${admin.authProvider}`);
        } else {
            console.log('Admin user NOT FOUND in DB!');
        }
    } catch (error) {
        console.error('Error fetching admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAdmin();
