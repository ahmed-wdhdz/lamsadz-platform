const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const leads = await prisma.lead.findMany({
        where: {
            clientName: {
                in: ['jalil', 'ahmed wdh']
            }
        },
        include: {
            deliveries: {
                include: { workshop: true }
            }
        }
    });

    console.log("--- DEBUGGING SPECIFIC LEADS ---");
    leads.forEach(lead => {
        console.log(`ID: ${lead.id}, Client: ${lead.clientName}, Status: ${lead.status}`);
        console.log(`Deliveries Count: ${lead.deliveries.length}`);
        lead.deliveries.forEach(d => {
            console.log(`  - Delivery ID: ${d.id}, Workshop: ${d.workshop?.name}`);
        });
        console.log("Full Delivery Object:", JSON.stringify(lead.deliveries, null, 2));
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
