const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function clean() {
    const emailToClean = 'ahmedahmed48dzdz@gmail.com';
    const user = await prisma.user.findUnique({ where: { email: emailToClean } });

    if (user) {
        // try to rename it instead of delete to avoid foreign key issues
        await prisma.user.update({
            where: { id: user.id },
            data: { email: 'deleted_manual_' + user.id + '_' + emailToClean }
        });
        console.log('Renamed the blocking email account.');
    } else {
        console.log('Account not found, no conflict from exact match.');
    }

    // Double check if there are others
    const users = await prisma.user.findMany({ where: { email: { contains: 'ahmed' } } });
    console.log('Other ahmed users:', users.map(u => ({ email: u.email, isEmailVerified: u.isEmailVerified })));
}
clean().catch(console.error).finally(() => prisma.$disconnect());
