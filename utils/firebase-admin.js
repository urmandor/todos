const admin = require('firebase-admin');
const serviceAccount = require('../todo-app-f5e1f-firebase-adminsdk-pgid6-f8bf73ba4f.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://todo-app-f5e1f.firebaseio.com'
});

module.exports = admin;
