/**
 * Database Configuration
 * Prisma client initialization with connection handling
 */

const { PrismaClient } = require('@prisma/client');

// Create single Prisma instance to prevent connection pool exhaustion
const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

// Graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

module.exports = prisma;
