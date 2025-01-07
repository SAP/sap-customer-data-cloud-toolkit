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
  'preferences.privacy.sap.isConsentGranted',
  'preferences.privacy.sap.actionTimestamp',
  'preferences.privacy.sap.lastConsentModified',
  'preferences.privacy.sap.docVersion',
  'preferences.privacy.sap.docDate',
  'preferences.privacy.sap.tags',
  'preferences.privacy.sap.entitlements',
  'preferences.cookie.isConsentGranted',
  'preferences.cookie.actionTimestamp',
  'preferences.cookie.lastConsentModified',
  'preferences.cookie.docVersion',
  'preferences.cookie.docDate',
  'preferences.cookie.tags',
  'preferences.cookie.entitlements',
]
