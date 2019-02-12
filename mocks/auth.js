const sinon = require('sinon');
const firebase = require('firebase-admin');

const mock = sinon.stub(firebase, 'auth').get(function() {
  return function() {
    return {
      verifyIdToken: () => ({ uid: 1 }),
      createUser: () => {}
    };
  };
});

module.exports = mock;
