async function healthRoutes(fastify, options) {
  fastify.get('/health', async (request, reply) => {
    return {
      status: 'ok',
      message: 'Backend is running!',
      timestamp: new Date().toISOString()
    };
  });
}

module.exports = healthRoutes;
