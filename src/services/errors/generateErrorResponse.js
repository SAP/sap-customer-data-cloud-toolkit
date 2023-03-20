function generateErrorResponse(error, message) {
  return error.response
    ? error.response
    : {
        data: {
          errorCode: error.code,
          errorDetails: error.details ? error.details : error.message,
          errorMessage: message,
          time: Date.now(),
        },
      }
}

export default generateErrorResponse
