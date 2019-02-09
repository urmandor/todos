'use strict';

const handlers = require('../controllers/users');

async function routes(fastify, options, next) {
  fastify.post(
    '/signup',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string' },
            password: { type: 'string' }
          }
        }
      }
    },
    handlers.userSignup
  );

  next();
}

module.exports = routes;
