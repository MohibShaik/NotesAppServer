successResposeBuilder = (req, res, statusCode, message) => {
  const returnResponse = {
    statusCode,
    message,
  };

  if (!!req && !!req.type) {
    returnResponse.type = req.type;
  }

  if (res !== null && !!res._id) {
    returnResponse._id = res._id;
    returnResponse.data = res;
  }

  if (res !== null) {
    returnResponse.response = res;
  }

  return returnResponse;
};

errorResponseBuilder = (req, res, error) => {
  const errorStatusCode =
    error.status || error.statusCode || 500;
  const errorResponse =
    error.stack ||
    error.message ||
    'Error Occured while sending response';
  const returnErrorResponse = {
    statusCode: errorStatusCode,
    message: errorResponse,
  };

  if (errorStatusCode === 404) {
    returnErrorResponse.response = [];
  }

  return returnErrorResponse;
};

module.exports = {
  successResposeBuilder,
  errorResponseBuilder,
};
