const test = require('ava');
const fastify = require('..');
const authMock = require('../mocks/auth');

test.after(() => {
  authMock.restore();
});

test.before(() => {
  authMock.reset();
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
