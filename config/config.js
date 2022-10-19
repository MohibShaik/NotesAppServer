const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT,
  connectionString: process.env.CONNECTION_STRING,
  authSource: process.env.AUTH_SOURCE,
  fcmAuthKey: process.env.FCM_AUTHKEY,
};
