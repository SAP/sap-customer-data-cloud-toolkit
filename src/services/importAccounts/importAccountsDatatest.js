/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { profileBranches, dataBranches, subscriptionsBranches, internalBranches, addressesBranches, preferencesBranches, communicationsBranches } from './mainDataSet'
import { passwordObjectStructure } from './passwordImport/passwordObjectStructure'
import { createSimpleNode } from './utils'
export const expectedFullAccount = [
  { id: 'uid', name: 'uid', value: true, branches: [], mandatory: true, tooltip: 'When importing a new account the UID column must be empty' },
  { id: 'profile', name: 'profile', value: false, branches: profileBranches, switchId: 'object' },
  { id: 'data', name: 'data', value: false, branches: dataBranches, switchId: 'object' },
  { id: 'subscriptions', name: 'subscriptions', value: false, branches: subscriptionsBranches, switchId: 'object' },
  { id: 'internal', name: 'internal', value: false, branches: internalBranches, switchId: 'object' },
  { id: 'addresses', name: 'addresses', value: false, branches: addressesBranches, switchId: 'object' },
  { id: 'preferences', name: 'preferences', value: false, branches: preferencesBranches },
  { id: 'communications', name: 'communications', value: false, branches: communicationsBranches },
  passwordObjectStructure()[0],
  createSimpleNode('phoneNumber'),
  createSimpleNode('loginIds', false, [createSimpleNode('loginIds.username'), createSimpleNode('loginIds.emails'), createSimpleNode('loginIds.unverifiedEmails')]),
  createSimpleNode('isActive'),
  createSimpleNode('isRegistered'),
  createSimpleNode('isVerified'),
  createSimpleNode('verified'),
  createSimpleNode('regSource'),
  createSimpleNode('dataCenter'),
  createSimpleNode('registered'),
  createSimpleNode('context'),
  createSimpleNode('lang'),
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
