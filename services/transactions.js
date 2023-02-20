const TransactionModel = require('../models/transactions.model');
const utils = require('../utilities/utils');

async function createNewTransaction(req, res) {
  const Transaction = new TransactionModel({
    user: req.body.userId,
    amount: req.body.amount,
    category: req.body.category,
    note: req.body.note,
    createdDate: req.body.createdDate,
    transactionType: req.body.transactionType,
  });
  try {
    const newTransaction = await Transaction.save();

    const successResponse = utils.successResposeBuilder(
      req,
      newTransaction,
      201,
      'New Transaction created successfully'
    );

    return successResponse;
  } catch (err) {
    throw err;
  }
}

async function getUserTransactions(req, res) {
  const userId = req.params.userId;
  console.log(userId);
  try {
    const result = await TransactionModel.find({
      user: userId,
    });

    return { result };
  } catch (err) {
    return err.message;
  }
}

async function getAllTransactions(req, res) {
  try {
    const result = await TransactionModel.find()
      .populate('user')
      .populate('category');

    return { result };
  } catch (err) {
    return err.message;
  }
}

async function updateTransDetails(req, res) {
  try {
    await TransactionModel.findOneAndUpdate(
      {
        _id: req.params.transId,
      },
      {
        $set: {
          amount: req.body.amount,
          category: req.body.category,
          note: req.body.note,
          createdDate: req.body.createdDate,
          transactionType: req.body.transactionType,
        },
      },
      { upsert: true, new: true }
    )
      .then((result) => {
        if (result) {
          return result;
        }
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createNewTransaction: createNewTransaction,
  getUserTransactions: getUserTransactions,
  getAllTransactions: getAllTransactions,
  updateTransDetails: updateTransDetails,
};
