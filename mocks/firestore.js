const sinon = require('sinon');
const firebase = require('firebase-admin');

const firebaseSnapshot = Promise.resolve({
  docs: [{ data: () => ({ data: 'Dummy Data' }) }],
  id: 1
});

const firebaseGetSnap = () => firebaseSnapshot;

const firebaseDoc = {
  id: 1,
  data: () => ({ data: 'dummy' }),
  get: firebaseGetSnap,
  set: () => ({}),
  delete: () => ({})
};

const firebaseCollection = {
  add: () => ({}),
  doc: () => firebaseDoc,
  where: () => ({ get: firebaseGetSnap }),
  get: firebaseGetSnap
};

const mock = sinon.stub(firebase, 'firestore').get(function() {
  return function() {
    return { collection: () => firebaseCollection };
  };
});

module.exports = mock;
