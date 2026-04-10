const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Fixing subscription dates for existing APPROVED workshops...");
    
    // Set default expiration to 30 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    
    const count = await prisma.workshop.updateMany({
        where: {
            status: 'APPROVED',
            subscriptionEndsAt: null
        },
        data: {
            subscriptionEndsAt: defaultDate
        }
    });

    console.log(`Successfully updated ${count.count} workshops to have a 30-day subscription.`);
}

main()
  .catch(e => {
        console.error(e);
        process.exit(1);
    })
  .finally(async () => {
        await prisma.$disconnect();
    });
