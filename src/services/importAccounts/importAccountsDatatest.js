/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { profileBranches, dataBranches, subscriptionsBranches, internalBranches, addressesBranches, preferencesBranches, communicationsBranches } from './mainDataSet'
import { passwordObjectStructure } from './passwordImport/passwordObjectStructure'
export const expectedFullAccount = [
  { id: 'uid', name: 'uid', value: true, branches: [], mandatory: true },
  { id: 'profile', name: 'profile', value: false, branches: profileBranches, switchId: 'object' },
  { id: 'data', name: 'data', value: false, branches: dataBranches, switchId: 'object' },
  { id: 'subscriptions', name: 'subscriptions', value: false, branches: subscriptionsBranches, switchId: 'object' },
  { id: 'internal', name: 'internal', value: false, branches: internalBranches, switchId: 'object' },
  { id: 'addresses', name: 'addresses', value: false, branches: addressesBranches, switchId: 'object' },
  { id: 'preferences', name: 'preferences', value: false, branches: preferencesBranches },
  { id: 'communications', name: 'communications', value: false, branches: communicationsBranches },
  passwordObjectStructure()[0],
  { id: 'phoneNumber', name: 'phoneNumber', value: false, branches: [] },
  {
    id: 'loginIds',
    name: 'loginIds',
    value: false,
    branches: [
      { id: 'loginIds.username', name: 'username', value: false, branches: [] },
      { id: 'loginIds.emails', name: 'emails', value: false, branches: [] },
      { id: 'loginIds.unverifiedEmails', name: 'unverifiedEmails', value: false, branches: [] },
    ],
  },
  { id: 'isActive', name: 'isActive', value: false, branches: [] },
  { id: 'isRegistered', name: 'isRegistered', value: false, branches: [] },
  { id: 'isVerified', name: 'isVerified', value: false, branches: [] },
  { id: 'verified', name: 'verified', value: false, branches: [] },
  { id: 'regSource', name: 'regSource', value: false, branches: [] },
  { id: 'dataCenter', name: 'dataCenter', value: false, branches: [] },
  { id: 'registered', name: 'registered', value: false, branches: [] },
  { id: 'context', name: 'context', value: false, branches: [] },
  { id: 'lang', name: 'lang', value: false, branches: [] },
]

export const expectedResultFromTree = [
  'uid',
  'phoneNumber',
  'loginIds.username',
  'loginIds.emails',
  'isActive',
  'profile.photoURL',
  'profile.oidcData.website',
  'data.loyalty.rewardPoints',
  'data.subscribe',
  'subscriptions.newsletter.commercial.isSubscribed',
  'subscriptions.newsletter.commercial.tags',
  'internal.s4hana.s4Id',
  'internal.madId',
  'addresses.soldTo.entrance',
  'addresses.soldTo.countryISOCode3',
  'addresses.shipTo.apartment',
  'addresses.shipTo.city',
  'preferences.terms.sap.isConsentGranted',
  'preferences.terms.sap.actionTimestamp',
  'communications.C_mobileApp.status',
  'communications.C_mobileApp.optIn.acceptanceLocation',
  'password.compoundHashedPassword',
  'password.hashedPassword',
]
