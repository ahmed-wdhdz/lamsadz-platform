const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function cleanAllMatch() {
    const users = await prisma.user.findMany({ where: { email: 'ahmedahmed48dzdz@gmail.com' } });
    for (const u of users) {
        await prisma.workshop.deleteMany({ where: { ownerId: u.id } });
        await prisma.user.delete({ where: { id: u.id } });
        console.log('Deleted exact match ID:', u.id);
    }
}
cleanAllMatch().catch(console.error).finally(() => prisma.$disconnect());
