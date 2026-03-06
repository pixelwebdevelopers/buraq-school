const { PrismaClient } = require('../generated/prisma');

/**
 * Singleton Prisma Client instance.
 * Prevents multiple instances during hot-reloading in dev.
 */

let prisma;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!global.__prisma) {
        global.__prisma = new PrismaClient({
            log: ['warn', 'error'],
        });
    }
    prisma = global.__prisma;
}

module.exports = prisma;
