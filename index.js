'use strict';
const fastify = require('fastify')();

fastify.decorateReply('sendResponse', function(status, response) {
  return this.status(status)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(response);
});

fastify.register(require('./utils/firebase-admin'));
fastify.register(require('./routes/user'), { prefix: '/users' });

const start = async () => {
  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    throw err;
  }
};

start();

module.exports = fastify;
