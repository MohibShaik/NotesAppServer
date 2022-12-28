const transService = require('../services/transactions');

exports.createNewTransaction = async (req, res, next) => {
  res.send(
    await transService
      .createNewTransaction(req, res)
      .catch((error) => console.log(error))
  );
};

exports.getTransactionsByUserId = async (req, res, next) => {
  res.send(
    await transService
      .getUserTransactions(req, res)
      .catch((error) => console.log(error))
  );
};


exports.getTransactions = async (req, res, next) => {
  res.send(
    await transService
      .getAllTransactions(req, res)
      .catch((error) => console.log(error))
  );
};

exports.updateTransaction = async (req, res, next) => {
  res.send(
    await transService
      .updateTransDetails(req, res)
      .catch((error) => console.log(error))
  );
};
