const firebase = require("firebase-admin");

const credentials = require("../feeds-d79cb-firebase-adminsdk-mud07-1f5ce76276.json");

firebase.initializeApp({
  credential: firebase.credential.cert(credentials),
  databaseURL: "https://feeds.firebaseio.com",
});

module.exports = firebase;