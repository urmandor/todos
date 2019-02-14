const sinon = require('sinon');
const firebase = require('firebase-admin');

const users = { android: { deviceId: 'DummyId', fcmToken: 'DummyToken' } };
const todolists = {
  name: 'DummyName',
  isCollaborative: false,
  users: [1]
};
const todos = {
  message: 'DummyMessage',
  isComplete: false
};

const getDataFromCollection = name => {
  if (name === 'users') {
    return users;
  }

  if (name === 'todolists') {
    return todolists;
  }

  if (name === 'todos') {
    return todos;
  }

  return undefined;
};

function firebaseSnapshots(name) {
  return Promise.resolve({
    docs: [getDataFromCollection(name)],
    id: 1
  });
}

function firebaseSnapshot(name) {
  return Promise.resolve({
    docs: { data: () => getDataFromCollection(name) },
    data: () => getDataFromCollection(name),
    ref: { collection: firebaseCollection },
    id: 1
  });
}

function firebaseDoc(name) {
  return {
    id: 1,
    data: () => getDataFromCollection(name),
    get: () => firebaseSnapshot(name),
    set: () => ({}),
    delete: () => ({})
  };
}

function firebaseDocs(name) {
  return {
    ...firebaseDoc(name),
    docs: [{ data: () => getDataFromCollection(name) }],
    get: () => firebaseSnapshots(name)
  };
}

function firebaseCollection(name) {
  return {
    add: () => ({}),
    doc: () => firebaseDoc(name),
    where: () => ({ get: () => firebaseDocs(name) }),
    get: () => firebaseDocs(name)
  };
}

function firebaseGetAll() {
  return [{ data: () => getDataFromCollection('users') }];
}

const mock = sinon.stub(firebase, 'firestore').get(function() {
  return function() {
    return { collection: firebaseCollection, getAll: firebaseGetAll };
  };
});

module.exports = mock;
