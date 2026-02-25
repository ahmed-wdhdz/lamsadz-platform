const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
    const users = await prisma.user.findMany({ where: { email: 'ahmedahmed48dzdz@gmail.com' } });
    console.log('Users matching EXACT email:', users.length);
    const usersContains = await prisma.user.findMany({ where: { email: { contains: 'ahmedahmed48dzdz' } } });
    console.log('Users CONTAINING email:', usersContains.map(u => ({ id: u.id, email: u.email })));
}
run().catch(console.error).finally(() => prisma.$disconnect());
