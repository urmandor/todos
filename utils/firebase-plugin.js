const fastifyPlugin = require('fastify-plugin');
const admin = require('./firebase-admin');

async function firebase(fastify) {
  fastify.decorate('admin', admin);
}

module.exports = fastifyPlugin(firebase);
