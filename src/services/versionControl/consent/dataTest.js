/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

export const getConsentStatementExpectedResponse = {
  errorCode: 0,
  preferences: {
    consentId1: {
      langs: ['en', 'fr'],
      legalStatements: {
        en: 'Legal statement in English',
        fr: 'Déclaration légale en français',
      },
    },
    consentId2: {
      langs: ['en'],
      legalStatements: {
        en: 'Legal statement in English',
      },
    },
  },
}

export const getLegalStatementExpectedResponse = {
  errorCode: 0,
  legalStatements: 'Legal statement content',
}

export const credentials = {
  apiKey: 'testApiKey',
  secret: 'testSecret',
  gigyaConsole: 'testGigyaConsole',
}
