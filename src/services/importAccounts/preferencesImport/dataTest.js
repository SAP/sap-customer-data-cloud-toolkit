/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { preferencesBranches } from '../mainDataSet'
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
  },
}
export const mockTransformPreferencesResponse = [{ id: 'preferences', name: 'preferences', value: false, branches: preferencesBranches }]
