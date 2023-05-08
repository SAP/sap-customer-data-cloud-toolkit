export function getExpectedWebhookResponse() {
  return {
    callId: '502acc0be4e442a2b42207b1b394ce89',
    errorCode: 0,
    apiVersion: 2,
    statusCode: 200,
    statusReason: 'OK',
    time: '2023-01-01T12:00:00.757Z',
    webhooks: [
      {
        url: 'www.url.com/',
        name: 'webhook1',
        active: true,
        events: ['consentUpdated'],
        useXfCredentials: false,
        headers: [
          {
            name: 'header1',
            value: 'header1',
          },
        ],
        version: '2.0',
        product: 'UserManagement',
        id: '4342782e-f00f-487b-912b-3fe9b5123456',
      },
      {
        url: 'someurl',
        name: 'webhook2',
        active: true,
        events: [
          'accountCreated',
          'accountRegistered',
          'accountUpdated',
          'accountDeleted',
          'accountLoggedIn',
          'accountLockedOut',
          'accountMerged',
          'accountProgressed',
          'accountUidChanged',
          'subscriptionUpdated',
          'sitePreferencesReset',
          'consentUpdated',
          'communicationUpdated',
        ],
        useXfCredentials: false,
        headers: [
          {
            name: 'header21',
            value: 'header21',
          },
          {
            name: 'header2',
            value: 'header2',
          },
        ],
        version: '2.0',
        product: 'UserManagement',
        id: '9aa62862-bab1-4823-9bc6-9143b5123456',
      },
    ],
  }
}

export function getWebhookExpectedBody(apiKey, index) {
  const expectedWebhookResponse = getExpectedWebhookResponse()
  const expectedBody = JSON.parse(JSON.stringify(expectedWebhookResponse))
  expectedBody.context = { targetApiKey: apiKey, id: expectedWebhookResponse.webhooks[index].name }
  return expectedBody.webhooks[index]
}
