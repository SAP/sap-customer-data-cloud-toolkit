/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


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

const expectedGigyaInvalidUserKey = {
  callId: 'f1d05f0a260d4bf48283b10fc27c6d3d',
  errorCode: 403005,
  errorDetails: 'The supplied userkey was not found',
  errorMessage: 'Unauthorized user',
  apiVersion: 2,
  statusCode: 403,
  statusReason: 'Forbidden',
  time: Date.now(),
}

function verifyAllResponsesAreOk(responses) {
  responses.forEach((response) => {
    verifyResponseIsOk(response)
  })
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

function errorCallback(error, err) {
  if (error.errorMessage !== err.message || error.errorCode !== err.code || error.errorDetails !== err.details || error.time === undefined || error.severity !== err.severity) {
    throw new Error('It is not the expected exception')
  }
}

export {
  credentials,
  siteCredentials,
  expectedGigyaResponseOk,
  expectedGigyaResponseInvalidAPI,
  createErrorObject,
  errorCallback,
  verifyAllResponsesAreOk,
  verifyResponseIsNotOk,
  verifyResponseIsOk,
  expectedGigyaInvalidUserKey,
}
