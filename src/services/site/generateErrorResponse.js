function generateErrorResponse(error, message) {
  return {
    data: {
      errorCode: error.code,
      errorDetails: error.details,
      errorMessage: message,
      time: Date.now(),
    },
  }
}

export default generateErrorResponse