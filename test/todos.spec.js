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

test('create todo without authorization header', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: { message: 'mytodos', isComplete: false },
    headers: {},
    url: 'todolists/1/todos',
    method: 'POST'
  });
  t.is(response.statusCode, 403);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('create todo without message', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: { isComplete: false },
    headers: { authorization: 'Bearer FirebaseDummyToken' },
    url: 'todolists/1/todos',
    method: 'POST'
  });
  t.is(response.statusCode, 400);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('create todo', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: { message: 'hello', isComplete: false },
    headers: { authorization: 'Bearer FirebaseDummyToken' },
    url: 'todolists/1/todos',
    method: 'POST'
  });
  t.is(response.statusCode, 201);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('update todo without message', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: { isComplete: false },
    headers: { authorization: 'Bearer FirebaseDummyToken' },
    url: 'todolists/1/todos/1',
    method: 'PUT'
  });
  t.is(response.statusCode, 400);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('update todo without isComplete', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: { message: 'hello' },
    headers: { authorization: 'Bearer FirebaseDummyToken' },
    url: 'todolists/1/todos/1',
    method: 'PUT'
  });
  t.is(response.statusCode, 400);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('update todo', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: { message: 'hello', isComplete: true },
    headers: { authorization: 'Bearer FirebaseDummyToken' },
    url: 'todolists/1/todos/1',
    method: 'PUT'
  });
  t.is(response.statusCode, 200);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('delete todo', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    payload: {},
    headers: { authorization: 'Bearer FirebaseDummyToken' },
    url: 'todolists/1/todos/1',
    method: 'DELETE'
  });
  t.is(response.statusCode, 200);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});

test('get all todos', async t => {
  await fastify.ready();
  const response = await fastify.inject({
    headers: { authorization: 'Bearer FirebaseDummyToken' },
    url: 'todolists/1/todos',
    method: 'GET'
  });
  t.is(response.statusCode, 200);
  t.is(response.headers['content-type'], 'application/json; charset=utf-8');
});
