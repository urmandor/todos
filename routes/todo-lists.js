'use strict';

const handlers = require('../controllers/todo-lists');

async function routes(fastify, options, next) {
  fastify.addHook('preValidation', require('../utils/auth'));

  fastify.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['name', 'isCollaborative'],
          properties: {
            name: { type: 'string' },
            isCollaborative: { type: 'boolean' }
          }
        }
      }
    },
    handlers.createList
  );

  fastify.get('/', handlers.getAllTodoLists);

  next();
}

module.exports = routes;
