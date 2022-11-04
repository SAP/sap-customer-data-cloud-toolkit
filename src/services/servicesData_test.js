const HttpStatus = {
  OK: 200,
  //   BAD_REQUEST: 400,
  //   INTERNAL_SERVER_ERROR: 500,
}

function verifyResponseIsOk(response) {
  expect(response.statusCode).toBeDefined()
  expect(response.statusCode).toEqual(HttpStatus.OK)
  expect(response.statusReason).toEqual('OK')
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

export { verifyResponseIsNotOk, verifyResponseIsOk }
