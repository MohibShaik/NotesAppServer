const dotenv = require('dotenv');
dotenv.config();
const appNotification = require('../services/notification-service');


exports.send = async (req, res, next) => {
  res.send(
    await appNotification.send(req.body).catch(next)
  );
};

