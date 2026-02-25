import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ADMIN_EMAIL = 'ahmedahmed48dzdz@gmail.com';

async function clean() {
    console.log('Starting production database cleanup (Neon DB)...');

    try {
        // 1. Delete deeply nested dependencies first
        console.log('Deleting Notifications, Reviews, Promotions...');
        await prisma.notification.deleteMany();
        await prisma.review.deleteMany();
        await prisma.promotionRequest.deleteMany();
        await prisma.portfolioImage.deleteMany();
        await prisma.workshopPayment.deleteMany();

        console.log('Deleting Lead Offers, Sales, Deliveries...');
        await prisma.offer.deleteMany();
        await prisma.leadSale.deleteMany();
        await prisma.leadDelivery.deleteMany();

        console.log('Deleting Leads and Products...');
        await prisma.lead.deleteMany();
        await prisma.product.deleteMany();

        console.log('Deleting Workshops...');
        await prisma.workshop.deleteMany();

        console.log('Deleting Test Users...');
        // Delete all users except the admin
        const result = await prisma.user.deleteMany({
            where: {
                email: {
                    not: ADMIN_EMAIL
                }
            }
        });

        console.log('-----------------------------------');
        console.log(`✅ Cleanup completed perfectly!`);
        console.log(`🗑️ Deleted ${result.count} test users.`);
        console.log(`🛡️ Kept admin account: ${ADMIN_EMAIL}`);
        console.log('-----------------------------------');
    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clean();
