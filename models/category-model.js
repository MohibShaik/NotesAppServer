const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
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

module.exports = mongoose.model('Categories', categorySchema);
