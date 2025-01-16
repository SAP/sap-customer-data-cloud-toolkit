/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

export const mockConfigurationTree = [
  {
    id: 'data.loyalty',
    name: 'loyalty',
    value: false,
    branches: [
      { id: 'data.loyalty.rewardPoints', name: 'rewardPoints', value: false, branches: [], switchId: 'object' },
      {
        id: 'data.loyalty.rewardRedemption',
        name: 'rewardRedemption',
        value: false,
        branches: [
          { id: 'data.loyalty.rewardRedemption.redemptionDate', name: 'redemptionDate', value: false, branches: [], switchId: 'object' },
          { id: 'data.loyalty.rewardRedemption.redemptionPoint', name: 'redemptionPoint', value: false, branches: [], switchId: 'object' },
        ],
        switchId: 'object',
      },
      { id: 'data.loyalty.loyaltyStatus', name: 'loyaltyStatus', value: false, branches: [], switchId: 'object' },
      { id: 'data.loyalty.rewardAmount', name: 'rewardAmount', value: false, branches: [], switchId: 'object' },
    ],
    switchId: 'object',
  },
  {
    id: 'subscriptions.newsletter.commercial',
    name: 'newsletter.commercial',
    value: true,
    branches: [
      { id: 'subscriptions.newsletter.commercial.isSubscribed', name: 'isSubscribed', value: true, branches: [], mandatory: false },
      { id: 'subscriptions.newsletter.commercial.tags', name: 'tags', value: true, branches: [] },
      { id: 'subscriptions.newsletter.commercial.lastUpdatedSubscriptionState', name: 'lastUpdatedSubscriptionState', value: true, branches: [] },
      {
        id: 'subscriptions.newsletter.commercial.doubleOptIn',
        name: 'doubleOptIn',
        value: true,
        branches: [{ id: 'subscriptions.newsletter.commercial.doubleOptIn.isExternallyVerified', name: 'isExternallyVerified', value: true, branches: [] }],
      },
    ],
    switchId: 'object',
  },
]

export const initialState = {
  configurations: [],
  currentSiteApiKey: '',
  currentSiteInformation: {},
  errors: [],
  isLoading: false,
  parentNode: [],
  selectedConfiguration: [],
  showSuccessMessage: false,
}

export const initialStateWithConfigurations = {
  configurations: mockConfigurationTree,
  currentSiteApiKey: '',
  currentSiteInformation: {},
  errors: [],
  isLoading: false,
  parentNode: [],
  selectedConfiguration: [],
  showSuccessMessage: false,
}

export const mockConfigurationTreeTrue = [
  {
    id: 'data.loyalty',
    name: 'loyalty',
    value: true,
    branches: [
      { id: 'data.loyalty.rewardPoints', name: 'rewardPoints', value: true, branches: [], switchId: 'object' },
      {
        id: 'data.loyalty.rewardRedemption',
        name: 'rewardRedemption',
        value: true,
        branches: [
          { id: 'data.loyalty.rewardRedemption.redemptionDate', name: 'redemptionDate', value: true, branches: [], switchId: 'object' },
          { id: 'data.loyalty.rewardRedemption.redemptionPoint', name: 'redemptionPoint', value: true, branches: [], switchId: 'object' },
        ],
        switchId: 'object',
      },
      { id: 'data.loyalty.loyaltyStatus', name: 'loyaltyStatus', value: true, branches: [], switchId: 'object' },
      { id: 'data.loyalty.rewardAmount', name: 'rewardAmount', value: true, branches: [], switchId: 'object' },
    ],
    switchId: 'object',
  },
]
export const dummyTargetApiKey = 'asdlkjpoiqwekjhdsfbvc'

export const mockedErrorsResponse = [
  {
    callId: '9203bf0eed4b4e31802d4aa02e1ad6a0',
    errorCode: 500000,
    apiVersion: 2,
    statusCode: 200,
    statusReason: 'OK',
    time: '2023-02-08T12:03:36.046Z',
    context: {
      id: 'schemaId',
      targetApiKey: dummyTargetApiKey,
    },
  },
]
