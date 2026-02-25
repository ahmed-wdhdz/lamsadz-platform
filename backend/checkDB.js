const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
    const users = await prisma.user.findMany({ where: { email: 'ahmedahmed48dzdz@gmail.com' } });
    console.log('Found:', users.length, users);
}
run().catch(console.error).finally(() => prisma.$disconnect());
