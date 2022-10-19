const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  title: { type: String },
  body: { type: String },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  'Notification',
  NotificationSchema
);
