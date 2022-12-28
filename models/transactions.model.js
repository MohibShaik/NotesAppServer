const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionsSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },

  amount: {
    type: Number,
    default: false,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categories',
    required: true,
  },

  note: {
    type: String,
  },

  createdDate: {
    type: Date,
    default: Date.now(),
  },

  transactionType: {
    type: String,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

TransactionsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const User = mongoose.model(
  'transactions',
  TransactionsSchema
);

module.exports = User;
