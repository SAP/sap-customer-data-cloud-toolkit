import { ERROR_CODE_CANNOT_CHANGE_CONSENTS_ON_CHILD_SITE, ERROR_SEVERITY_WARNING } from '../../errors/generateErrorResponse'

export const getConsentStatementExpectedResponse = {
  callId: '5fa3a71a78f44d289bc12d545d18b102',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-03-21T11:46:39.403Z',
  preferences: {
    'terms.termsConsentId1': {
      isActive: true,
      isMandatory: true,
      langs: ['en'],
      customData: [],
      consentVaultRetentionPeriod: 36,
      defaultLang: 'en',
      enforceLocaleReconsent: false,
    },
    'terms.consentId2': {
      isActive: false,
      isMandatory: true,
      langs: ['en', 'pt'],
      consentVaultRetentionPeriod: 36,
      enforceLocaleReconsent: true,
    },
  },
}

export function getNoConsentStatementExpectedResponse() {
  const response = JSON.parse(JSON.stringify(getConsentStatementExpectedResponse))
  response.preferences = {}
  return response
}

export const getLegalStatementExpectedResponse = {
  callId: 'dbd61423a75a46c98b31beb0c8509f3e',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-03-23T10:13:42.753Z',
  legalStatements: {
    publishedDocVersion: 2.0,
    currentDocVersion: 2.0,
    minDocVersion: 1.0,
    versions: {
      2: {
        purpose: 'english2',
        LegalStatementStatus: 'Published',
      },
      1: {
        purpose: 'english',
        LegalStatementStatus: 'Historic',
      },
    },
  },
}

export const legalConsentAlreadyExists = {
  callId: '3b4e402acc8e4177b782f5dac4eec5cb',
  errorDetails: 'There is already legal statement for consentId en 3/22/2023 12:00:00 AM',
  errorCode: 400009,
  errorMessage: 'Validation error',
  apiVersion: 2,
  statusCode: 400,
  statusReason: 'Bad Request',
  time: '2023-03-23T17:08:31.487Z',
}

export const cannotChangeConsentsOnChildSite = {
  errorCode: ERROR_CODE_CANNOT_CHANGE_CONSENTS_ON_CHILD_SITE,
  errorDetails: 'Cannot change consents on child site if the consents do not exist on parent site. Please copy the consents to the parent site first.',
  errorMessage: 'Cannot copy consents to the destination site',
  statusCode: 412,
  statusReason: 'Precondition Failed',
  time: Date.now(),
  severity: ERROR_SEVERITY_WARNING,
}
