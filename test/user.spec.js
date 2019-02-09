const test = require('ava');
const sinon = require('sinon');
const fastify = require('..');
const firebase = require('firebase-admin');

test.before(() => {
  sinon.stub(firebase, 'auth').get(function() {
    return function() {
      return { createUser: () => {} };
    };
  });
});

test('signup without email', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: { password: 'asdasd' },
    url: 'users/signup',
    method: 'POST'
  });
  t.is(response.statusCode, 400);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('signup without password', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: { email: 'asd@asd.com' },
    url: 'users/signup',
    method: 'POST'
  });
  t.is(response.statusCode, 400);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('signup with email and password', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: { email: 'asd@asd.com', password: 'asdasd' },
    url: 'users/signup',
    method: 'POST'
  });
  t.is(response.statusCode, 201);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});
