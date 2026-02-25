const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findMany().then(users => console.log(users.map(u => ({ email: u.email, isEmailVerified: u.isEmailVerified })))).finally(() => prisma.$disconnect());
