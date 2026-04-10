const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const p = await prisma.product.findFirst({
        where: { title: 'tabla' },
        include: { leads: true, promotions: true }
    });
    console.log(JSON.stringify(p, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
