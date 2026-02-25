const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function forceClean() {
    const emailRegex = 'ahmed';
    const users = await prisma.user.findMany({ where: { email: { contains: emailRegex } } });

    for (const u of users) {
        if (!u.email.startsWith('deleted_force_')) {
            await prisma.user.update({
                where: { id: u.id },
                data: { email: 'deleted_force_' + u.id + '_' + u.email }
            });
            console.log('Force renamed:', u.email);
        }
    }
}
forceClean().catch(console.error).finally(() => prisma.$disconnect());
