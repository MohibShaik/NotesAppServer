const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
  requester: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
});

friendRequestSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model(
  'friendRequests',
  friendRequestSchema
);
