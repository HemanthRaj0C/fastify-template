require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const pool = require('./config/db');
const healthRoutes = require('./routes/health');

const PORT = process.env.PORT || 5000;

// Register plugins
fastify.register(cors);

// Decorate fastify with db pool
fastify.decorate('db', pool);

// Register routes
fastify.register(healthRoutes, { prefix: '/api' });

// Start server
const start = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('📦 Database connected successfully');
    
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.warn('⚠️  Starting with database warning:', err.message);
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
  }
};

start();
