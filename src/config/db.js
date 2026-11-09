let prisma = null;

try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  });
} catch (e) {
  console.warn('⚠️ @prisma/client not generated or unavailable, fallback active:', e.message);
}

module.exports = prisma;
