const sinon = require('sinon');
const firebase = require('firebase-admin');

const mock = sinon.stub(firebase, 'messaging').get(function() {
  return function() {
    return { send: () => Promise.resolve(true) };
  };
});

module.exports = mock;
