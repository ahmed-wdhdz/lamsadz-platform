const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const leads = await prisma.lead.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
            deliveries: {
                include: { workshop: true }
            }
        }
    });

    console.log("--- DEBUGGING LEADS AND DELIVERIES ---");
    leads.forEach(lead => {
        console.log(`ID: ${lead.id}, Type: ${lead.type}, Status: ${lead.status}`);
        console.log(`Deliveries Count: ${lead.deliveries.length}`);
        if (lead.deliveries.length > 0) {
            lead.deliveries.forEach(d => {
                console.log(`  - Delivery ID: ${d.id}, Workshop ID: ${d.workshopId}, Workshop Name: ${d.workshop?.name}`);
            });
        } else {
            console.log("  - No deliveries found.");
        }
        console.log("-----------------------------------------");
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
