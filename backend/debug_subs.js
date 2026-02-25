const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const workshops = await prisma.workshop.findMany({
        select: {
            id: true,
            name: true,
            status: true,
            subscriptionEndsAt: true
        }
    });

    console.log("--- WORKSHOP SUBSCRIPTION DATA ---");
    console.table(workshops);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
