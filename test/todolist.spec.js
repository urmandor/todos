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

test('create todolist without authorization header', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: { name: 'mytodos', isCollaborative: false },
    headers: {},
    url: 'todolists',
    method: 'POST'
  });
  t.is(response.statusCode, 403);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('create todolist without specifying type', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: { name: 'mytodos' },
    headers: { authorization: 'Bearer FirebaseDummyToken' },
    url: 'todolists',
    method: 'POST'
  });
  t.is(response.statusCode, 400);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('create personal todolist without name', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: { isCollaborative: false },
    headers: { authorization: 'Bearer FirebaseDummyToken' },
    url: 'todolists',
    method: 'POST'
  });
  t.is(response.statusCode, 400);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('create personal todolist', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: { isCollaborative: false, name: 'mytodos' },
    headers: { authorization: 'Bearer FirebaseDummyToken' },
    url: 'todolists',
    method: 'POST'
  });
  t.is(response.statusCode, 201);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('create collaborative todolist', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: { isCollaborative: false, name: 'mytodos', users: ['A', 'B'] },
    headers: { authorization: 'Bearer FirebaseDummyToken' },
    url: 'todolists',
    method: 'POST'
  });
  t.is(response.statusCode, 201);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('get all todolists', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    headers: { authorization: 'Bearer FirebaseDummyToken' },
    url: 'todolists',
    method: 'GET'
  });
  t.is(response.statusCode, 200);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});
