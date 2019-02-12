const test = require('ava');
const fastify = require('..');
const authMock = require('../mocks/auth');
const firestoreMock = require('../mocks/firestore');

test.after(() => {
  authMock.restore();
  firestoreMock.restore();
});

test.before(() => {
  authMock.reset();
  firestoreMock.reset();
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

test('login without authentication', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: { deviceType: 'android', fcmToken: 'DUMMY_TOKEN' },
    url: 'users/login',
    headers: {},
    method: 'POST'
  });
  t.is(response.statusCode, 403);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('login without deviceId', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: { deviceType: 'android', fcmToken: 'DUMMY_TOKEN' },
    url: 'users/login',
    headers: { authorization: 'Bearer DUMMY_TOKEN' },
    method: 'POST'
  });
  t.is(response.statusCode, 400);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('login without fcmToken', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: { deviceType: 'android', deviceId: 'DUMMY_ID' },
    url: 'users/login',
    headers: { authorization: 'Bearer DUMMY_TOKEN' },
    method: 'POST'
  });
  t.is(response.statusCode, 400);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('login without deviceType', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: { fcmToken: 'DUMMY_TOKEN', deviceId: 'DUMMY_ID' },
    url: 'users/login',
    headers: { authorization: 'Bearer DUMMY_TOKEN' },
    method: 'POST'
  });
  t.is(response.statusCode, 400);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('login with an unknown deviceType', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: {
      deviceType: 'UNKNOWN_DEVICE',
      fcmToken: 'DUMMY_TOKEN',
      deviceId: 'DUMMY_ID'
    },
    url: 'users/login',
    headers: { authorization: 'Bearer DUMMY_TOKEN' },
    method: 'POST'
  });
  t.is(response.statusCode, 400);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('login with android', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: {
      deviceType: 'android',
      fcmToken: 'DUMMY_TOKEN',
      deviceId: 'DUMMY_ID'
    },
    url: 'users/login',
    headers: { authorization: 'Bearer DUMMY_TOKEN' },
    method: 'POST'
  });
  t.is(response.statusCode, 200);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('login with ios', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: {
      deviceType: 'ios',
      fcmToken: 'DUMMY_TOKEN',
      deviceId: 'DUMMY_ID'
    },
    url: 'users/login',
    headers: { authorization: 'Bearer DUMMY_TOKEN' },
    method: 'POST'
  });
  t.is(response.statusCode, 200);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('logout without authentication', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    url: 'users/logout',
    method: 'POST'
  });
  t.is(response.statusCode, 403);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('logout', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    url: 'users/logout',
    headers: { authorization: 'Bearer DUMMY_TOKEN' },
    method: 'POST'
  });
  t.is(response.statusCode, 200);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});
