export const getExpectedRejectionErrors = () => {
  const errors = []

  for (let i = 0; i < 16; i++) {
    errors.push(getExpectedRejectionError())
  }
  return errors
}

export const getExpectedRejectionError = () => {
  return {
    apiVersion: 2,
    callId: 'dd9d17c5c14040d8b6302cb0d38ffc29',
    errorCode: 0,
    errorMessage: 'Invalid API key',
    statusCode: 200,
    statusReason: 'OK',
    time: '2023-03-29T13:24:09.547Z',
  }
}
