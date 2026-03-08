const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

async function userRoutes(fastify, options) {
  // Get all users
  fastify.get('/users', async (request, reply) => {
    try {
      const db = getDB();
      const users = await db.collection('users').find().toArray();
      return users;
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  });

  // Get user by ID
  fastify.get('/users/:id', async (request, reply) => {
    try {
      const db = getDB();
      const user = await db.collection('users').findOne({ 
        _id: new ObjectId(request.params.id) 
      });
      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }
      return user;
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  });

  // Create user
  fastify.post('/users', async (request, reply) => {
    try {
      const db = getDB();
      const { name, email } = request.body;
      const result = await db.collection('users').insertOne({ name, email });
      reply.status(201).send({ _id: result.insertedId, name, email });
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  });

  // Update user
  fastify.put('/users/:id', async (request, reply) => {
    try {
      const db = getDB();
      const { name, email } = request.body;
      const result = await db.collection('users').findOneAndUpdate(
        { _id: new ObjectId(request.params.id) },
        { $set: { name, email } },
        { returnDocument: 'after' }
      );
      if (!result) {
        return reply.status(404).send({ error: 'User not found' });
      }
      return result;
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  });

  // Delete user
  fastify.delete('/users/:id', async (request, reply) => {
    try {
      const db = getDB();
      const result = await db.collection('users').deleteOne({ 
        _id: new ObjectId(request.params.id) 
      });
      if (result.deletedCount === 0) {
        return reply.status(404).send({ error: 'User not found' });
      }
      return { message: 'User deleted successfully' };
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  });
}

module.exports = userRoutes;
