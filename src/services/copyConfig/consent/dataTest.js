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
      langs: ['en'],
      consentVaultRetentionPeriod: 36,
      enforceLocaleReconsent: true,
    },
  },
}

export const getLegalStatementExpectedResponse = {
  callId: '2b2a8eabda8344a1901638ef2f765424',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-03-20T17:43:32.667Z',
  legalStatements: {
    publishedDocDate: '2023-03-03T00:00:00.000Z',
    currentDocDate: '2023-03-03T00:00:00.000Z',
    minDocDate: '2023-03-03T00:00:00.000Z',
    dates: {
      '2023-03-03T00:00:00.000Z': {
        LegalStatementStatus: 'Published',
      },
    },
  },
}
