const { getDB } = require('../config/db');

async function healthRoutes(fastify, options) {
  fastify.get('/health', async (request, reply) => {
    let database = false;
    try {
      const db = getDB();
      await db.command({ ping: 1 });
      database = true;
    } catch {}

    return {
      status: 'ok',
      message: 'Backend is running!',
      timestamp: new Date().toISOString(),
      database
    };
  });
}

module.exports = healthRoutes;
