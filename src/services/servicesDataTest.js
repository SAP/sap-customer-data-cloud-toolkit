const HttpStatus = {
  OK: 200,
  //   BAD_REQUEST: 400,
  //   INTERNAL_SERVER_ERROR: 500,
}

const credentials = {
  userKey: 'userKey',
  secret: 'secret',
}

const siteCredentials = Object.assign(credentials, { partnerId: 'partnerId' })

const expectedGigyaResponseOk = {
  statusCode: 200,
  errorCode: 0,
  statusReason: 'OK',
  callId: 'callId',
  apiVersion: 2,
  time: Date.now(),
}

const badRequest = 'Bad Request'
const invalidApiParam = 'Invalid ApiKey parameter'
const expectedGigyaResponseInvalidAPI = {
  callId: 'callId',
  errorCode: 400093,
  errorDetails: invalidApiParam,
  errorMessage: invalidApiParam,
  apiVersion: 2,
  statusCode: 400,
  statusReason: badRequest,
  time: Date.now(),
}

function verifyResponseIsOk(response) {
  expect(response.statusCode).toBeDefined()
  expect(response.statusCode).toEqual(HttpStatus.OK)
  expect(response.statusReason).toEqual(expectedGigyaResponseOk.statusReason)
  expect(response.callId).toBeDefined()
  expect(response.time).toBeDefined()
  // error case
  expect(response.errorMessage).toBeUndefined()
  expect(response.errorCode).toEqual(0)
  expect(response.errorDetails).toBeUndefined()
}

function verifyResponseIsNotOk(response, expectedResponse) {
  expect(response.statusCode).toEqual(expectedResponse.statusCode)
  expect(response.statusCode).not.toBe(HttpStatus.OK)
  expect(response.statusReason).toEqual(expectedResponse.statusReason)
  expect(response.callId).toBeDefined()
  expect(response.time).toBeDefined()
  // error case
  expect(response.errorMessage).toEqual(expectedResponse.errorMessage)
  expect(response.errorCode).toEqual(expectedResponse.errorCode)
  expect(response.errorDetails).toEqual(expectedResponse.errorDetails)
}

function createErrorObject(message) {
  const err = {}
  err.code = 'ENOTFOUND'
  err.details = 'getaddrinfo ENOTFOUND accounts..gigya.com'
  err.message = message
  err.time = Date.now()
  return err
}

export { credentials, siteCredentials, expectedGigyaResponseOk, expectedGigyaResponseInvalidAPI, createErrorObject, verifyResponseIsNotOk, verifyResponseIsOk }
