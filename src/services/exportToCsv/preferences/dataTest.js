/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { preferencesBranches } from '../../importAccounts/mainDataSet'

export const expectedPreferencesOptions = { id: 'preferences', name: 'preferences', value: false, branches: preferencesBranches }

export const expectedPreferencesResponse = [
  'preferences.terms.sap.isConsentGranted',
  'preferences.terms.sap.actionTimestamp',
  'preferences.terms.sap.lastConsentModified',
  'preferences.terms.sap.docVersion',
  'preferences.terms.sap.docDate',
  'preferences.terms.sap.tags',
  'preferences.terms.sap.entitlements',
]
