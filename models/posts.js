const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },

  title: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  imagePath: {
    type: String,
  },

  createdDate: {
    type: Date,
    default: Date.now(),
  },

  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    },
  ],

  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      comment: {
        type: String,
      },
      commentedDate: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

postsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Posts', postsSchema);
