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

  fastify.register((instance, options, done) => {
    instance.addHook('preValidation', require('../utils/auth'));
    instance.post(
      '/login',
      {
        schema: {
          body: {
            type: 'object',
            required: ['deviceId', 'fcmToken', 'deviceType'],
            properties: {
              deviceId: { type: 'string' },
              fcmToken: { type: 'string' },
              deviceType: { type: 'string' }
            }
          }
        }
      },
      handlers.userLogin
    );
    instance.post('/logout', handlers.userLogout);
    done();
  });

  next();
}

module.exports = routes;
