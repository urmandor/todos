const fastifyPlugin = require('fastify-plugin');
const admin = require('./firebase-admin');

const sendMessage = (token, title, body) => {
  const dryRun = process.env.NODE_ENV === 'test';
  const message = {
    notification: { title, body },
    token
  };
  return admin.messaging().send(message, dryRun);
};

async function fcm(fastify) {
  fastify.decorate('sendFCM', sendMessage);
}

module.exports = fastifyPlugin(fcm);
