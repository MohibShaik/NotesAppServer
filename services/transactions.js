const TransactionModel = require('../models/transactions.model');

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
    return res.status(201).json(newTransaction);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function getUserTransactions(req, res) {
  const userId = req.params.userId;
  try {
    const result = await TransactionModel.find({
      user: userId,
    })
      .populate('user')
      .populate('category');

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllTransactions(req, res) {
  try {
    const result = await TransactionModel.find()
      .populate('user')
      .populate('category');

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateTransDetails(req, res) {
  try {
    await TransactionModel
      .findOneAndUpdate(
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
          return res.status(200).json({message:"Project details updated successfully" , data:result});
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
