// const moment = require('moment');
const Notification = require('../models/notification');
const appNotification = require('../utilities/notifications/app-notification');

// exports.get = async () => {
//   const query = {
//     createdOn: {
//       $gte: moment.utc().subtract(7, 'days').startOf('day'),
//       $lt: moment.utc().endOf('day'),
//     },
//   };

//   return await Notification.find(query)
//     .sort({ createdOn: -1 })
//     .lean()
//     .exec();
// };

exports.send = async (data) => {
  const { title, body } = data;
  await new Notification({ title, body }).save();
  return await appNotification.send(title, body);
};
