'use strict';

const handlers = require('../controllers/todos');

async function routes(fastify, options, next) {
  fastify.register(require('../utils/fcm-plugin'));

  fastify.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['message'],
          properties: {
            message: { type: 'string' },
            isComplete: { type: 'boolean' }
          }
        }
      }
    },
    handlers.createTodo
  );

  fastify.put(
    '/:todo',
    {
      schema: {
        body: {
          type: 'object',
          required: ['message', 'isComplete'],
          properties: {
            message: { type: 'string' },
            isComplete: { type: 'boolean' }
          }
        }
      }
    },
    handlers.updateTodo
  );

  fastify.delete('/:todo', handlers.deleteTodo);

  fastify.get('/', handlers.getAllTodos);

  next();
}

module.exports = routes;
