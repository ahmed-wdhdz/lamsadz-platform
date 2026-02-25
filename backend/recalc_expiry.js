const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- RECALCULATING SUBSCRIPTIONS ---");

    const workshops = await prisma.workshop.findMany({
        where: { status: 'APPROVED' },
        include: { payments: true }
    });

    for (const ws of workshops) {
        // 1. Find latest validated payment
        const validPayments = ws.payments
            .filter(p => p.status === 'VALIDATED')
            .sort((a, b) => new Date(b.validatedAt) - new Date(a.validatedAt));

        let startDate;
        let durationMonths = 1; // Default
        let source = "Registration (Default)";

        if (validPayments.length > 0) {
            const lastPayment = validPayments[0];
            startDate = new Date(lastPayment.validatedAt);
            if (lastPayment.plan === 'YEARLY') durationMonths = 12;
            source = `Payment (${lastPayment.plan})`;
        } else {
            // No payment found, use Registration Date
            startDate = new Date(ws.createdAt);
            source = "Registration Date";
        }

        // Calculate End Date
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + durationMonths);

        // Update
        await prisma.workshop.update({
            where: { id: ws.id },
            data: { subscriptionEndsAt: endDate }
        });

        console.log(`Workshop: ${ws.name}`);
        console.log(`  - Start: ${startDate.toLocaleDateString()}`);
        console.log(`  - Source: ${source}`);
        console.log(`  - New Expiry: ${endDate.toLocaleDateString()}`);
        console.log("-----------------------------------------");
    }

    console.log("Done.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
