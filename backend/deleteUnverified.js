const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function clean() {
    await prisma.workshop.deleteMany({
        where: { owner: { isEmailVerified: false } }
    });
    const res = await prisma.user.deleteMany({
        where: { isEmailVerified: false }
    });
    console.log('Deleted unverified users', res);
}
clean().catch(console.error).finally(() => prisma.$disconnect());
