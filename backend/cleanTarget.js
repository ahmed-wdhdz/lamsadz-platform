const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function cleanTarget() {
    const targetId = 17;
    await prisma.workshop.deleteMany({ where: { ownerId: targetId } });
    await prisma.user.delete({ where: { id: targetId } });

    const users = await prisma.user.findMany({ where: { email: 'ahmedahmed48dzdz@gmail.com' } });
    console.log('Target Deleted. Remaining users with this email:', users);
}
cleanTarget().catch(console.error).finally(() => prisma.$disconnect());
