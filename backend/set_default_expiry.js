const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const result = await prisma.workshop.updateMany({
        where: {
            status: 'APPROVED',
            subscriptionEndsAt: null
        },
        data: {
            subscriptionEndsAt: nextMonth
        }
    });

    console.log(`Updated ${result.count} workshops with default subscription date.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
