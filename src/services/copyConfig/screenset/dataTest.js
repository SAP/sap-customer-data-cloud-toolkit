/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

const screenSetTemplate = {
  screenSetID: 'Default-LinkAccounts',
  html: '<div class="gigya-screen-set" id="Default-LinkAccounts" data-on-pending-registration-screen="Default-RegistrationLogin/gigya-complete-registration-screen"/>',
  css: '.gigya-screen-caption{font-family:arial;padding-left:11px;line-height:40px}.gigya-screen,.gigya-screen *{margin:0 auto;padding:0;border:none;color:inherit;',
  javascript: '',
  metadata: {
    version: 1,
    lastModified: 1667560399,
    desc: '',
    designerHtml: '<div class="gigya-screen-set" id="Default-LinkAccounts" data-on-pending-registration-screen="Default-RegistrationLogin/gigya-complete-registration-screen"/>',
    comment: 'Created via UI Builder',
  },
  translations: {
    default: {
      HEADER_119803489452460820_LABEL: 'Log in with an existing site account:',
      HEADER_145260704159400830_LABEL: 'To connect with your existing account, please enter your password:',
    },
  },
  rawTranslations: '',
  compressionType: 1,
}

export function getExpectedScreenSetResponse() {
  const response = {
    callId: '5a4395b432794df383c2a35740ae90b0',
    errorCode: 0,
    apiVersion: 2,
    statusCode: 200,
    statusReason: 'OK',
    time: '2023-02-23T16:19:57.815Z',
    screenSets: [],
  }
  const screenSetIds = [
    'Default-LinkAccounts',
    'Default-LiteRegistration',
    'Default-OrganizationRegistration',
    'Default-PasswordlessLogin',
    'Default-ProfileUpdate',
    'Default-ReAuthentication',
    'Default-RegistrationLogin',
    'Default-Subscriptions',
  ]

  for (const id of screenSetIds) {
    const screenSet = JSON.parse(JSON.stringify(screenSetTemplate))
    screenSet.screenSetID = id
    response.screenSets.push(screenSet)
  }
  return response
}

export function getScreenSetExpectedBody(apiKey, index) {
  const expectedScreenSetResponse = getExpectedScreenSetResponse()
  const expectedBody = JSON.parse(JSON.stringify(expectedScreenSetResponse))
  expectedBody.context = { targetApiKey: apiKey, id: expectedScreenSetResponse.screenSets[index].screenSetID }
  delete expectedBody.rawTranslations
  delete expectedBody.compressionType
  return expectedBody.screenSets[index]
}
