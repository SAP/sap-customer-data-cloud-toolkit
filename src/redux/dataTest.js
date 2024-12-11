/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

export const testErrorObject = {
  callId: '1234567890',
  errorCode: 500000,
  apiVersion: 2,
  statusCode: 200,
  errorMessage: 'Test error',
  statusReason: 'Error',
  time: '2023-02-08T12:03:36.046Z',
  context: '{id: test, apiKey: 1234567890}',
}

export const testErrorArray = [testErrorObject]
