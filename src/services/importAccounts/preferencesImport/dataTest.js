/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
export const mockPreferencesResponse = {
  callId: '8294ea97691f4594921df2c4d12009b0',
  context: '{"id":"consent_consentStatement_get","targetApiKey":"4_anUcVDIu7iIQP-uPNKi7aQ"}',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2024-12-19T15:19:45.218Z',
  preferences: {
    'terms.sap': {
      isActive: false,
      isMandatory: true,
      langs: ['en', 'de'],
      customData: [{ key: 'Source', value: 'C4C' }],
      consentVaultRetentionPeriod: 36,
      defaultLang: 'en',
      enforceLocaleReconsent: true,
      writeAccess: 'clientModify',
    },
    'privacy.sap': {
      isActive: false,
      isMandatory: true,
      langs: ['en'],
      consentVaultRetentionPeriod: 36,
      defaultLang: 'en',
      enforceLocaleReconsent: false,
      writeAccess: 'clientModify',
    },
    cookie: { isActive: false, isMandatory: false, langs: ['en'], consentVaultRetentionPeriod: 36, defaultLang: 'en', enforceLocaleReconsent: true, writeAccess: 'clientModify' },
  },
}

export const mockCleanPreferencesResponse = {
  preferences: {
    'terms.sap': {
      isActive: false,
      isMandatory: true,
      langs: ['en', 'de'],
      customData: [
        {
          key: 'Source',
          value: 'C4C',
        },
      ],
      consentVaultRetentionPeriod: 36,
      defaultLang: 'en',
      enforceLocaleReconsent: true,
      writeAccess: 'clientModify',
    },
    'privacy.sap': {
      isActive: false,
      isMandatory: true,
      langs: ['en'],
      consentVaultRetentionPeriod: 36,
      defaultLang: 'en',
      enforceLocaleReconsent: false,
      writeAccess: 'clientModify',
    },
    cookie: {
      isActive: false,
      isMandatory: false,
      langs: ['en'],
      consentVaultRetentionPeriod: 36,
      defaultLang: 'en',
      enforceLocaleReconsent: true,
      writeAccess: 'clientModify',
    },
  },
}
export const mockTransformPreferencesResponse = [
  {
    id: 'preferences',
    name: 'preferences',
    value: false,
    branches: [
      {
        id: 'preferences.terms',
        name: 'terms',
        value: false,
        branches: [
          {
            id: 'preferences.terms.sap',
            name: 'sap',
            value: false,
            branches: [
              { id: 'preferences.terms.sap.isConsentGranted', name: 'isConsentGranted', value: false, branches: [] },
              { id: 'preferences.terms.sap.actionTimestamp', name: 'actionTimestamp', value: false, branches: [] },
              { id: 'preferences.terms.sap.lastConsentModified', name: 'lastConsentModified', value: false, branches: [] },
              { id: 'preferences.terms.sap.docVersion', name: 'docVersion', value: false, branches: [] },
              { id: 'preferences.terms.sap.docDate', name: 'docDate', value: false, branches: [] },
              { id: 'preferences.terms.sap.tags', name: 'tags', value: false, branches: [] },
              { id: 'preferences.terms.sap.entitlements', name: 'entitlements', value: false, branches: [] },
            ],
          },
        ],
      },
      {
        id: 'preferences.privacy',
        name: 'privacy',
        value: false,
        branches: [
          {
            id: 'preferences.privacy.sap',
            name: 'sap',
            value: false,
            branches: [
              { id: 'preferences.privacy.sap.isConsentGranted', name: 'isConsentGranted', value: false, branches: [] },
              { id: 'preferences.privacy.sap.actionTimestamp', name: 'actionTimestamp', value: false, branches: [] },
              { id: 'preferences.privacy.sap.lastConsentModified', name: 'lastConsentModified', value: false, branches: [] },
              { id: 'preferences.privacy.sap.docVersion', name: 'docVersion', value: false, branches: [] },
              { id: 'preferences.privacy.sap.docDate', name: 'docDate', value: false, branches: [] },
              { id: 'preferences.privacy.sap.tags', name: 'tags', value: false, branches: [] },
              { id: 'preferences.privacy.sap.entitlements', name: 'entitlements', value: false, branches: [] },
            ],
          },
        ],
      },
      {
        id: 'preferences.cookie',
        name: 'cookie',
        value: false,
        branches: [
          { id: 'preferences.cookie.isConsentGranted', name: 'isConsentGranted', value: false, branches: [] },
          { id: 'preferences.cookie.actionTimestamp', name: 'actionTimestamp', value: false, branches: [] },
          { id: 'preferences.cookie.lastConsentModified', name: 'lastConsentModified', value: false, branches: [] },
          { id: 'preferences.cookie.docVersion', name: 'docVersion', value: false, branches: [] },
          { id: 'preferences.cookie.docDate', name: 'docDate', value: false, branches: [] },
          { id: 'preferences.cookie.tags', name: 'tags', value: false, branches: [] },
          { id: 'preferences.cookie.entitlements', name: 'entitlements', value: false, branches: [] },
        ],
      },
    ],
  },
]
