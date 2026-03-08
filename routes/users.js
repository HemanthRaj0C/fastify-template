const pool = require('../config/db');

async function userRoutes(fastify, options) {
  // Get all users
  fastify.get('/users', async (request, reply) => {
    try {
      const result = await pool.query('SELECT * FROM users ORDER BY id');
      return result.rows;
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  });

  // Get user by ID
  fastify.get('/users/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'User not found' });
      }
      return result.rows[0];
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  });

  // Create user
  fastify.post('/users', async (request, reply) => {
    try {
      const { name, email } = request.body;
      const result = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
      );
      reply.status(201).send(result.rows[0]);
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  });

  // Update user
  fastify.put('/users/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { name, email } = request.body;
      const result = await pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
        [name, email, id]
      );
      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'User not found' });
      }
      return result.rows[0];
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  });

  // Delete user
  fastify.delete('/users/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'User not found' });
      }
      return { message: 'User deleted successfully' };
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  });
}

module.exports = userRoutes;
