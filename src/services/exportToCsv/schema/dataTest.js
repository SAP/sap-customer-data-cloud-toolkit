/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
export const expectedOptions = [
  {
    id: 'data',
    name: 'data',
    value: true,
    branches: [
      {
        id: 'data.loyalty',
        name: 'loyalty',
        value: true,
        branches: [
          {
            id: 'data.loyalty.rewardPoints',
            name: 'rewardPoints',
            value: true,
            branches: [],
            switchId: 'object',
          },
          {
            id: 'data.loyalty.rewardRedemption',
            name: 'rewardRedemption',
            value: true,
            branches: [
              {
                id: 'data.loyalty.rewardRedemption.redemptionDate',
                name: 'redemptionDate',
                value: true,
                branches: [],
                switchId: 'object',
              },
              {
                id: 'data.loyalty.rewardRedemption.redemptionPoint',
                name: 'redemptionPoint',
                value: true,
                branches: [],
                switchId: 'object',
              },
            ],
            switchId: 'object',
          },
          {
            id: 'data.loyalty.loyaltyStatus',
            name: 'loyaltyStatus',
            value: true,
            branches: [],
            switchId: 'object',
          },
          {
            id: 'data.loyalty.rewardAmount',
            name: 'rewardAmount',
            value: true,
            branches: [],
            switchId: 'object',
          },
        ],
        switchId: 'object',
      },
      {
        id: 'data.vehicle',
        name: 'vehicle',
        value: false,
        branches: [
          {
            id: 'data.vehicle.model',
            name: 'model',
            value: false,
            branches: [],
            switchId: 'object',
          },
          {
            id: 'data.vehicle.vin',
            name: 'vin',
            value: false,
            branches: [],
            switchId: 'object',
          },
          {
            id: 'data.vehicle.registrationDate',
            name: 'registrationDate',
            value: false,
            branches: [],
            switchId: 'object',
          },
        ],
        switchId: 'object',
      },
      {
        id: 'data.crm',
        name: 'crm',
        value: false,
        branches: [
          {
            id: 'data.crm.isProspect',
            name: 'isProspect',
            value: false,
            branches: [],
            switchId: 'object',
          },
          {
            id: 'data.crm.abcClassification',
            name: 'abcClassification',
            value: false,
            branches: [],
            switchId: 'object',
          },
        ],
        switchId: 'object',
      },
      {
        id: 'data.subscribe',
        name: 'subscribe',
        value: false,
        branches: [],
        switchId: 'object',
      },
      {
        id: 'data.terms',
        name: 'terms',
        value: false,
        branches: [],
        switchId: 'object',
      },
    ],
    switchId: 'object',
  },
  {
    id: 'subscriptions',
    name: 'subscriptions',
    value: true,
    branches: [
      {
        id: 'subscriptions.newsletter.commercial',
        name: 'newsletter.commercial',
        value: true,
        branches: [
          {
            id: 'subscriptions.newsletter.commercial.isSubscribed',
            name: 'isSubscribed',
            value: true,
            branches: [],
            mandatory: true,
          },
          {
            id: 'subscriptions.newsletter.commercial.tags',
            name: 'tags',
            value: true,
            branches: [],
          },
          {
            id: 'subscriptions.newsletter.commercial.lastUpdatedSubscriptionState',
            name: 'lastUpdatedSubscriptionState',
            value: true,
            branches: [],
          },
          {
            id: 'subscriptions.newsletter.commercial.doubleOptIn',
            name: 'doubleOptIn',
            value: true,
            branches: [
              {
                id: 'subscriptions.newsletter.commercial.doubleOptIn.isExternallyVerified',
                name: 'isExternallyVerified',
                value: true,
                branches: [],
              },
            ],
          },
        ],
        switchId: 'object',
      },
      {
        id: 'subscriptions.newsletter.passenger',
        name: 'newsletter.passenger',
        value: false,
        branches: [
          {
            id: 'subscriptions.newsletter.passenger.isSubscribed',
            name: 'isSubscribed',
            value: false,
            branches: [],
          },
          {
            id: 'subscriptions.newsletter.passenger.tags',
            name: 'tags',
            value: false,
            branches: [],
          },
          {
            id: 'subscriptions.newsletter.passenger.lastUpdatedSubscriptionState',
            name: 'lastUpdatedSubscriptionState',
            value: false,
            branches: [],
          },
          {
            id: 'subscriptions.newsletter.passenger.doubleOptIn',
            name: 'doubleOptIn',
            value: false,
            branches: [
              {
                id: 'subscriptions.newsletter.passenger.doubleOptIn.isExternallyVerified',
                name: 'isExternallyVerified',
                value: false,
                branches: [],
              },
            ],
          },
        ],
        switchId: 'object',
      },
      {
        id: 'subscriptions.promotion',
        name: 'promotion',
        value: false,
        branches: [
          {
            id: 'subscriptions.promotion.isSubscribed',
            name: 'isSubscribed',
            value: false,
            branches: [],
          },
          {
            id: 'subscriptions.promotion.tags',
            name: 'tags',
            value: false,
            branches: [],
          },
          {
            id: 'subscriptions.promotion.lastUpdatedSubscriptionState',
            name: 'lastUpdatedSubscriptionState',
            value: false,
            branches: [],
          },
          {
            id: 'subscriptions.promotion.doubleOptIn',
            name: 'doubleOptIn',
            value: false,
            branches: [
              {
                id: 'subscriptions.promotion.doubleOptIn.isExternallyVerified',
                name: 'isExternallyVerified',
                value: false,
                branches: [],
              },
            ],
          },
        ],
        switchId: 'object',
      },
    ],
    switchId: 'object',
  },
]

export const expectedSchemaResult = [
  'data.loyalty.rewardPoints',
  'data.loyalty.rewardRedemption.redemptionDate',
  'data.loyalty.rewardRedemption.redemptionPoint',
  'data.loyalty.loyaltyStatus',
  'data.loyalty.rewardAmount',
  'subscriptions.newsletter.commercial.isSubscribed',
  'subscriptions.newsletter.commercial.tags',
  'subscriptions.newsletter.commercial.lastUpdatedSubscriptionState',
  'subscriptions.newsletter.commercial.doubleOptIn.isExternallyVerified',
]
