/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
export const expectedSchemaStucture = [
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
]

export const expectedNormalResult = [
  'data.loyalty.rewardPoints',
  'data.loyalty.rewardRedemption.redemptionDate',
  'data.loyalty.rewardRedemption.redemptionPoint',
  'data.loyalty.loyaltyStatus',
  'data.loyalty.rewardAmount',
]

export const expectedParentArrayChildObjectStructure = [
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
            switchId: 'array',
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
            switchId: 'array',
          },
          {
            id: 'data.loyalty.rewardAmount',
            name: 'rewardAmount',
            value: true,
            branches: [],
            switchId: 'array',
          },
        ],
        switchId: 'array',
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
]

export const expectedParentArrayChildObjectResult = [
  'data.loyalty.0.rewardPoints',
  'data.loyalty.0.rewardRedemption.redemptionDate',
  'data.loyalty.0.rewardRedemption.redemptionPoint',
  'data.loyalty.0.loyaltyStatus',
  'data.loyalty.0.rewardAmount',
]
export const expectedParentChildArrayStructure = [
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
            switchId: 'array',
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
                switchId: 'array',
              },
              {
                id: 'data.loyalty.rewardRedemption.redemptionPoint',
                name: 'redemptionPoint',
                value: true,
                branches: [],
                switchId: 'array',
              },
            ],
            switchId: 'array',
          },
          {
            id: 'data.loyalty.loyaltyStatus',
            name: 'loyaltyStatus',
            value: true,
            branches: [],
            switchId: 'array',
          },
          {
            id: 'data.loyalty.rewardAmount',
            name: 'rewardAmount',
            value: true,
            branches: [],
            switchId: 'array',
          },
        ],
        switchId: 'array',
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
]

export const expectedParentChildArrayResult = [
  'data.loyalty.0.rewardPoints',
  'data.loyalty.0.rewardRedemption.0.redemptionDate',
  'data.loyalty.0.rewardRedemption.0.redemptionPoint',
  'data.loyalty.0.loyaltyStatus',
  'data.loyalty.0.rewardAmount',
]
export const expectedParentObjectChildArrayStructure = [
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
                switchId: 'array',
              },
              {
                id: 'data.loyalty.rewardRedemption.redemptionPoint',
                name: 'redemptionPoint',
                value: true,
                branches: [],
                switchId: 'array',
              },
            ],
            switchId: 'array',
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
]

export const expectedParentObjectChildArrayResult = [
  'data.loyalty.rewardPoints',
  'data.loyalty.rewardRedemption.0.redemptionDate',
  'data.loyalty.rewardRedemption.0.redemptionPoint',
  'data.loyalty.loyaltyStatus',
  'data.loyalty.rewardAmount',
]
