const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
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
  date: {
    type: Date,
    default: Date.now(),
  },
  averageMonthlyIncome: {
    type: Number,
    required: true,
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
