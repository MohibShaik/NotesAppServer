const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  label: {
    type: Array,
    required: false,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    required: false,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notes', notesSchema);
