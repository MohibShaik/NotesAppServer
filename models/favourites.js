const mongoose = require('mongoose');

const favouritesModel = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Posts',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  actionDate: {
    type: Array,
  },
  lastUpdatedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  'Favourites',
  favouritesModel
);
