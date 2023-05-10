export function getExpectedExtensionResponse() {
  return {
    callId: '502acc0be4e442a2b42207b1b394ce89',
    errorCode: 0,
    apiVersion: 2,
    statusCode: 200,
    statusReason: 'OK',
    time: '2023-01-01T12:00:00.757Z',
    result: [
      {
        created: '2023-05-09T09:06:24.6322028Z',
        lastModified: '2023-05-09T09:06:30.1555859Z',
        extensionFuncUrl: 'url',
        description: 'extension description',
        timeout: 1000,
        fallback: 'IgnoreAllErrors',
        headers: [
          {
            name: 'Header1',
            value: 'Header1Value',
          },
        ],
        integration: 'Generic',
        id: '025b280361734074ac4dab4534000001',
        extensionPoint: 'OnBeforeAccountsRegister',
        friendlyName: 'extension1',
        enabled: true,
      },
      {
        created: '2023-05-09T09:06:24.6322028Z',
        lastModified: '2023-05-09T09:06:30.1555859Z',
        extensionFuncUrl: 'url',
        description: 'extension description',
        timeout: 1000,
        fallback: 'IgnoreAllErrors',
        headers: [
          {
            name: 'Header21',
            value: 'Header21Value',
          },
          {
            name: 'Header2',
            value: 'Header2Value',
          },
        ],
        integration: 'Generic',
        id: '025b280361734074ac4dab4534000002',
        extensionPoint: 'OnBeforeAccountsLogin',
        friendlyName: 'extension2',
        enabled: false,
      },
    ],
  }
}

export function getExtensionExpectedBody(apiKey) {
  const expectedExtensionResponse = getExpectedExtensionResponse()
  const expectedBody = JSON.parse(JSON.stringify(expectedExtensionResponse))
  expectedBody.result[0].context = { targetApiKey: apiKey, id: expectedExtensionResponse.result[0].extensionPoint }
  expectedBody.result[1].context = { targetApiKey: apiKey, id: expectedExtensionResponse.result[1].extensionPoint }
  return expectedBody.result
}

export function getChildExtensionExpectedBody(apiKey) {
  const expectedExtensionResponse = getExpectedExtensionResponse()
  const expectedBody = []
  expectedBody.push({
    id: expectedExtensionResponse.result[0].id,
    enabled: expectedExtensionResponse.result[0].enabled,
    extensionFuncUrl: expectedExtensionResponse.result[0].extensionFuncUrl,
    context: JSON.stringify({ id: 'extensions_' + expectedExtensionResponse.result[0].extensionPoint, targetApiKey: apiKey }),
  })
  expectedBody.push({
    id: expectedExtensionResponse.result[1].id,
    enabled: expectedExtensionResponse.result[1].enabled,
    extensionFuncUrl: expectedExtensionResponse.result[1].extensionFuncUrl,
    context: JSON.stringify({ id: 'extensions_' + expectedExtensionResponse.result[1].extensionPoint, targetApiKey: apiKey }),
  })
  return expectedBody
}

export function getEmptyExtensionResponse() {
  return {
    callId: '502acc0be4e442a2b42207b1b394ce89',
    errorCode: 0,
    apiVersion: 2,
    statusCode: 200,
    statusReason: 'OK',
    time: '2023-01-01T12:00:00.757Z',
    result: [],
  }
}
