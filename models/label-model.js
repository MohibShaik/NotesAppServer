const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  createdBy: {
    type: String,
    required: true,
  },

  createdDate: {
    type: Date,
    required: false,
    default: Date.now,
  },
});


labelSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model('Labels', labelSchema);
