const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  gender: {
    type: String,
  },
  dateofbirth: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  averageMonthlyIncome: {
    type: Number,
  },

  lastActive: {
    type: String,
    required: false,
  },

  active: {
    type: Boolean,
    default: false,
  },

  otp: {
    type: String,
    required: true,
  },

  imagePath: {
    type: String,
  },
});

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    //do not reveal passwordHash
    delete returnedObject.password;
  },
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
