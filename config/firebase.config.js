var admin = require('firebase-admin');

var serviceAccount = require('../feeds-d79cb-firebase-adminsdk-mud07-1f5ce76276.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports.admin = admin;
