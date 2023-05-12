/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
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
