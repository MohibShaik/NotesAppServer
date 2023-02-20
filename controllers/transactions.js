const transService = require('../services/transactions');

exports.createNewTransaction = async function (
  request,
  response
) {
  try {
    console.log('Started creating new Transaction');
    const createNewTransactionResponse =
      await transService.createNewTransaction(
        request,
        response
      );
    response
      .status(createNewTransactionResponse.statusCode)
      .send(createNewTransactionResponse);
  } catch (error) {
    const errorResponse = utils.errorResponseBuilder(
      request,
      response,
      error
    );

    console.log(
      'error occured during creation of transaction',
      error
    );
    response
      .status(errorResponse.statusCode)
      .send(errorResponse);
  }
};

exports.getTransactionsByUserId = async (
  req,
  res,
  next
) => {
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
