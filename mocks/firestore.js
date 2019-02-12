const sinon = require('sinon');
const firebase = require('firebase-admin');

const firebaseSnapshots = Promise.resolve({
  docs: [{ data: () => ({ data: 'Dummy Data' }) }],
  id: 1
});

const firebaseSnapshot = Promise.resolve({
  docs: { data: () => ({ data: 'Dummy Data' }) },
  data: () => ({ data: 'Dummy Data', users: [1] }),
  ref: { collection: () => firebaseCollection },
  id: 1
});

const firebaseDoc = {
  id: 1,
  data: () => ({ data: 'dummy' }),
  get: () => firebaseSnapshot,
  set: () => ({}),
  delete: () => ({})
};

const firebaseDocs = {
  ...firebaseDoc,
  docs: [{ data: () => ({ data: 'Dummy Data' }) }],
  get: () => firebaseSnapshots
};

const firebaseCollection = {
  add: () => ({}),
  doc: () => firebaseDoc,
  where: () => ({ get: () => firebaseDocs }),
  get: () => firebaseDocs
};

const mock = sinon.stub(firebase, 'firestore').get(function() {
  return function() {
    return { collection: () => firebaseCollection };
  };
});

module.exports = mock;
