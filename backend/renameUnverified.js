const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function clean() {
    const users = await prisma.user.findMany({ where: { isEmailVerified: false } });
    for (const u of users) {
        if (!u.email.startsWith('deleted_')) {
            await prisma.user.update({ where: { id: u.id }, data: { email: 'deleted_' + u.id + '_' + u.email } });
        }
    }
    console.log('Renamed unverified users');
}
clean().catch(console.error).finally(() => prisma.$disconnect());
