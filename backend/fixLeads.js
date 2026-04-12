const prisma = require('./config/database');

async function fixLeads() {
    // Fix leads 21 and 22 - change status from SENT to NEW
    const result = await prisma.lead.updateMany({
        where: {
            designId: null,       // custom requests only
            status: 'SENT'        // that are still SENT
        },
        data: { status: 'NEW' }
    });

    console.log(`✅ Fixed ${result.count} leads - changed SENT to NEW`);
}

fixLeads()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
