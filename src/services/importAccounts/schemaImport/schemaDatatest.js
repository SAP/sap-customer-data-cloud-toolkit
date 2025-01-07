/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import {
  profileSchemaFields,
  dataSchemaFields,
  subscriptionsSchemaFields,
  internalSchemaFields,
  addressesSchemaFields,
  profileBranches,
  dataBranches,
  subscriptionsBranches,
  internalBranches,
  addressesBranches,
} from '../mainDataSet'
export const expectedSchemaResponse = {
  callId: 'e67ef8a0e6314103a7b2ef4bdda4da69',
  statusCode: 200,
  statusReason: 'OK',
  time: '2024-12-05T18:17:23.716Z',
  profileSchema: profileSchemaFields,
  dataSchema: dataSchemaFields,
  subscriptionsSchema: subscriptionsSchemaFields,
  internalSchema: internalSchemaFields,
  addressesSchema: addressesSchemaFields,
}

export const expectedLiteSchemaResponse = [
  {
    id: 'profile',
    name: 'profile',
    value: false,
    branches: profileBranches,
    switchId: 'object',
  },
  {
    id: 'data',
    name: 'data',
    value: false,
    branches: dataBranches,
    switchId: 'object',
  },
  {
    id: 'subscriptions',
    name: 'subscriptions',
    value: false,
    branches: subscriptionsBranches,
    switchId: 'object',
  },
]

export const expectedSchemaCleanAddress = {
  profileSchema: profileSchemaFields,
  dataSchema: dataSchemaFields,
  subscriptionsSchema: subscriptionsSchemaFields,
  internalSchema: internalSchemaFields,
  addressesSchema: addressesSchemaFields,
}
export const expectedSchemaResponseWithoutFields = {
  profileSchema: profileSchemaFields,
  dataSchema: dataSchemaFields,
  subscriptionsSchema: subscriptionsSchemaFields,
}
export const expectedSchemaResponseCleaned = {
  callId: 'e67ef8a0e6314103a7b2ef4bdda4da69',
  statusCode: 200,
  statusReason: 'OK',
  time: '2024-12-05T18:17:23.716Z',
  profileSchema: profileSchemaFields,
  dataSchema: dataSchemaFields,
  subscriptionsSchema: subscriptionsSchemaFields,
  internalSchema: internalSchemaFields,
  addressesSchema: addressesSchemaFields,
}
export const transformedSchema = [
  {
    id: 'profile',
    name: 'profile',
    value: false,
    branches: profileBranches,
    switchId: 'object',
  },
  {
    id: 'data',
    name: 'data',
    value: false,
    branches: dataBranches,
    switchId: 'object',
  },
  {
    id: 'subscriptions',
    name: 'subscriptions',
    value: false,
    branches: subscriptionsBranches,
    switchId: 'object',
  },
  {
    id: 'internal',
    name: 'internal',
    value: false,
    branches: internalBranches,
    switchId: 'object',
  },
  {
    id: 'addresses',
    name: 'addresses',
    value: false,
    branches: addressesBranches,
    switchId: 'object',
  },
]

export const expectedTransformedLiteResponse = {
  profileSchema: profileSchemaFields,
  dataSchema: dataSchemaFields,
  subscriptionsSchema: subscriptionsSchemaFields,
}

export const expectedTransformedLiteCleanedResponsed = [
  {
    id: 'profile',
    name: 'profile',
    value: false,
    branches: profileBranches,
    switchId: 'object',
  },
  {
    id: 'data',
    name: 'data',
    value: false,
    branches: dataBranches,
    switchId: 'object',
  },
  {
    id: 'subscriptions',
    name: 'subscriptions',
    value: false,
    branches: subscriptionsBranches,
    switchId: 'object',
  },
]
