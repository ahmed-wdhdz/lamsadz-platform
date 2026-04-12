const prisma = require('./config/database');
async function test() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3
  });
  console.log(JSON.stringify(leads, null, 2));
}
test().finally(() => prisma.$disconnect());
