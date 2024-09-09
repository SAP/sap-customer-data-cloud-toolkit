export function getScreenSetParameters(apiKey, credentials) {
  const parameters = Object.assign({})
  parameters.apiKey = apiKey
  parameters.userKey = credentials.userKey
  parameters.secret = credentials.secret
  parameters.include = 'screenSetID,html,css,javascript,translations,metadata'

  parameters.context = JSON.stringify({ id: 'screenSet', targetApiKey: apiKey })

  return parameters
}

export function setScreenSetParameters(apiKey, body, credentials) {
  const parameters = Object.assign({})
  parameters.apiKey = apiKey
  parameters.userKey = credentials.userKey
  parameters.secret = credentials.secret
  parameters['screenSetID'] = body.screenSetID
  parameters['html'] = body.html
  if (body.css) {
    parameters['css'] = body.css
  }
  if (body.javascript) {
    parameters['javascript'] = body.javascript
  }
  if (body.translations) {
    parameters['translations'] = JSON.stringify(body.translations)
  }
  if (body.metadata) {
    parameters['metadata'] = JSON.stringify(body.metadata)
  }
  parameters['context'] = JSON.stringify({ id: body.screenSetID, targetApiKey: apiKey })
  return parameters
}
