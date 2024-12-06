export const expectedSchemaResponse = {
  callId: 'e67ef8a0e6314103a7b2ef4bdda4da69',
  statusCode: 200,
  statusReason: 'OK',
  time: '2024-12-05T18:17:23.716Z',
  profileSchema: {
    fields: {
      photoURL: {
        required: false,
        type: 'string',
      },
      'oidcData.address.locality': {
        required: false,
        type: 'string',
      },
      'favorites.activities.category': {
        required: false,
        type: 'string',
      },
      'certifications.number': {
        required: false,
        type: 'basic-string',
      },
      religion: {
        required: false,
        type: 'string',
      },
      'favorites.movies.name': {
        required: false,
        type: 'string',
      },
      'oidcData.address.formatted': {
        required: false,
        type: 'string',
      },
    },
    dynamicSchema: false,
  },
  dataSchema: {
    fields: {
      'loyalty.rewardPoints': {
        required: false,
        type: 'integer',
      },
      'vehicle.model': {
        required: false,
        type: 'string',
      },
      'crm.isProspect': {
        required: false,
        type: 'boolean',
      },
      'loyalty.rewardRedemption.redemptionDate': {
        required: false,
        type: 'date',
      },
      subscribe: {
        required: false,
        type: 'boolean',
      },
      'vehicle.vin': {
        required: false,
        type: 'string',
      },
      'loyalty.loyaltyStatus': {
        required: false,
        type: 'string',
      },
      'loyalty.rewardRedemption.redemptionPoint': {
        required: false,
        type: 'integer',
      },
      terms: {
        required: false,
        type: 'boolean',
      },
      'crm.abcClassification': {
        required: false,
        type: 'string',
      },
      'loyalty.rewardAmount': {
        required: false,
        type: 'float',
      },
      'vehicle.registrationDate': {
        required: false,
        type: 'date',
      },
    },
    dynamicSchema: false,
  },
  subscriptionsSchema: {
    fields: {
      'newsletter.commercial': {},
      'newsletter.passenger': {},
      promotion: {},
    },
  },
  internalSchema: {
    fields: {
      's4hana.s4Id': {
        required: false,
        type: 'string',
      },
      'crm.crmGuid': {
        required: false,
        type: 'string',
      },
      madId: {
        required: false,
        type: 'string',
      },
      'crm.crmId': {
        required: false,
        type: 'string',
      },
    },
    dynamicSchema: false,
  },
  addressesSchema: {
    fields: {
      soldTo: {
        entrance: {
          type: 'string',
          required: false,
          writeAccess: 'clientModify',
          allowNull: true,
          format: null,
          encrypt: 'AES',
        },
      },
      shipTo: {
        apartment: {
          type: 'string',
          required: false,
          writeAccess: 'clientModify',
          allowNull: true,
          format: null,
          encrypt: 'AES',
        },
      },
    },
  },
}

export const expectedSchemaResponseCleaned = {
  callId: 'e67ef8a0e6314103a7b2ef4bdda4da69',
  statusCode: 200,
  statusReason: 'OK',
  time: '2024-12-05T18:17:23.716Z',
  profileSchema: {
    fields: {
      photoURL: {
        required: false,
        type: 'string',
      },
      'oidcData.address.locality': {
        required: false,
        type: 'string',
      },
      'favorites.activities.category': {
        required: false,
        type: 'string',
      },
      'certifications.number': {
        required: false,
        type: 'basic-string',
      },
      religion: {
        required: false,
        type: 'string',
      },
      'favorites.movies.name': {
        required: false,
        type: 'string',
      },
      'oidcData.address.formatted': {
        required: false,
        type: 'string',
      },
    },
    dynamicSchema: false,
  },
  dataSchema: {
    fields: {
      'loyalty.rewardPoints': {
        required: false,
        type: 'integer',
      },
      'vehicle.model': {
        required: false,
        type: 'string',
      },
      'crm.isProspect': {
        required: false,
        type: 'boolean',
      },
      'loyalty.rewardRedemption.redemptionDate': {
        required: false,
        type: 'date',
      },
      subscribe: {
        required: false,
        type: 'boolean',
      },
      'vehicle.vin': {
        required: false,
        type: 'string',
      },
      'loyalty.loyaltyStatus': {
        required: false,
        type: 'string',
      },
      'loyalty.rewardRedemption.redemptionPoint': {
        required: false,
        type: 'integer',
      },
      terms: {
        required: false,
        type: 'boolean',
      },
      'crm.abcClassification': {
        required: false,
        type: 'string',
      },
      'loyalty.rewardAmount': {
        required: false,
        type: 'float',
      },
      'vehicle.registrationDate': {
        required: false,
        type: 'date',
      },
    },
    dynamicSchema: false,
  },
  subscriptionsSchema: {
    fields: {
      'newsletter.commercial': {},
      'newsletter.passenger': {},
      promotion: {},
    },
  },
  internalSchema: {
    fields: {
      's4hana.s4Id': {
        required: false,
        type: 'string',
      },
      'crm.crmGuid': {
        required: false,
        type: 'string',
      },
      madId: {
        required: false,
        type: 'string',
      },
      'crm.crmId': {
        required: false,
        type: 'string',
      },
    },
    dynamicSchema: false,
  },
  addressesSchema: {
    fields: {
      soldTo: {
        entrance: {
          type: 'string',
          required: false,
          writeAccess: 'clientModify',
          allowNull: true,
          format: null,
          encrypt: 'AES',
        },
      },
      shipTo: {
        apartment: {
          type: 'string',
          required: false,
          writeAccess: 'clientModify',
          allowNull: true,
          format: null,
          encrypt: 'AES',
        },
      },
    },
  },
}

export const transformedSchema = [
  {
    id: 'profile',
    name: 'profile',
    value: false,
    branches: [
      { id: 'profile.photoURL', name: 'photoURL', value: false, branches: [], switchId: 'object' },
      {
        id: 'profile.oidcData',
        name: 'oidcData',
        value: false,
        branches: [
          {
            id: 'profile.oidcData.address',
            name: 'address',
            value: false,
            branches: [
              { id: 'profile.oidcData.address.locality', name: 'locality', value: false, branches: [], switchId: 'object' },
              { id: 'profile.oidcData.address.formatted', name: 'formatted', value: false, branches: [], switchId: 'object' },
            ],
            switchId: 'object',
          },
        ],
        switchId: 'object',
      },
      {
        id: 'profile.favorites',
        name: 'favorites',
        value: false,
        branches: [
          {
            id: 'profile.favorites.activities',
            name: 'activities',
            value: false,
            branches: [{ id: 'profile.favorites.activities.category', name: 'category', value: false, branches: [], switchId: 'object' }],
            switchId: 'object',
          },
          {
            id: 'profile.favorites.movies',
            name: 'movies',
            value: false,
            branches: [{ id: 'profile.favorites.movies.name', name: 'name', value: false, branches: [], switchId: 'object' }],
            switchId: 'object',
          },
        ],
        switchId: 'object',
      },
      {
        id: 'profile.certifications',
        name: 'certifications',
        value: false,
        branches: [{ id: 'profile.certifications.number', name: 'number', value: false, branches: [], switchId: 'object' }],
        switchId: 'object',
      },
      { id: 'profile.religion', name: 'religion', value: false, branches: [], switchId: 'object' },
    ],
    switchId: 'object',
  },
  {
    id: 'data',
    name: 'data',
    value: false,
    branches: [
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
        id: 'data.vehicle',
        name: 'vehicle',
        value: false,
        branches: [
          { id: 'data.vehicle.model', name: 'model', value: false, branches: [], switchId: 'object' },
          { id: 'data.vehicle.vin', name: 'vin', value: false, branches: [], switchId: 'object' },
          { id: 'data.vehicle.registrationDate', name: 'registrationDate', value: false, branches: [], switchId: 'object' },
        ],
        switchId: 'object',
      },
      {
        id: 'data.crm',
        name: 'crm',
        value: false,
        branches: [
          { id: 'data.crm.isProspect', name: 'isProspect', value: false, branches: [], switchId: 'object' },
          { id: 'data.crm.abcClassification', name: 'abcClassification', value: false, branches: [], switchId: 'object' },
        ],
        switchId: 'object',
      },
      { id: 'data.subscribe', name: 'subscribe', value: false, branches: [], switchId: 'object' },
      { id: 'data.terms', name: 'terms', value: false, branches: [], switchId: 'object' },
    ],
    switchId: 'object',
  },
  {
    id: 'subscriptions',
    name: 'subscriptions',
    value: false,
    branches: [
      {
        id: 'subscriptions.newsletter.commercial',
        name: 'newsletter.commercial',
        value: false,
        branches: [
          { id: 'subscriptions.newsletter.commercial.isSubscribed', name: 'isSubscribed', value: false, branches: [] },
          { id: 'subscriptions.newsletter.commercial.tags', name: 'tags', value: false, branches: [] },
          { id: 'subscriptions.newsletter.commercial.lastUpdatedSubscriptionState', name: 'lastUpdatedSubscriptionState', value: false, branches: [] },
          {
            id: 'subscriptions.newsletter.commercial.doubleOptIn',
            name: 'doubleOptIn',
            value: false,
            branches: [{ id: 'subscriptions.newsletter.commercial.doubleOptIn.isExternallyVerified', name: 'isExternallyVerified', value: false, branches: [] }],
          },
        ],
        switchId: 'object',
      },
      {
        id: 'subscriptions.newsletter.passenger',
        name: 'newsletter.passenger',
        value: false,
        branches: [
          { id: 'subscriptions.newsletter.passenger.isSubscribed', name: 'isSubscribed', value: false, branches: [] },
          { id: 'subscriptions.newsletter.passenger.tags', name: 'tags', value: false, branches: [] },
          { id: 'subscriptions.newsletter.passenger.lastUpdatedSubscriptionState', name: 'lastUpdatedSubscriptionState', value: false, branches: [] },
          {
            id: 'subscriptions.newsletter.passenger.doubleOptIn',
            name: 'doubleOptIn',
            value: false,
            branches: [{ id: 'subscriptions.newsletter.passenger.doubleOptIn.isExternallyVerified', name: 'isExternallyVerified', value: false, branches: [] }],
          },
        ],
        switchId: 'object',
      },
      {
        id: 'subscriptions.promotion',
        name: 'promotion',
        value: false,
        branches: [
          { id: 'subscriptions.promotion.isSubscribed', name: 'isSubscribed', value: false, branches: [] },
          { id: 'subscriptions.promotion.tags', name: 'tags', value: false, branches: [] },
          { id: 'subscriptions.promotion.lastUpdatedSubscriptionState', name: 'lastUpdatedSubscriptionState', value: false, branches: [] },
          {
            id: 'subscriptions.promotion.doubleOptIn',
            name: 'doubleOptIn',
            value: false,
            branches: [{ id: 'subscriptions.promotion.doubleOptIn.isExternallyVerified', name: 'isExternallyVerified', value: false, branches: [] }],
          },
        ],
        switchId: 'object',
      },
    ],
    switchId: 'object',
  },
  {
    id: 'internal',
    name: 'internal',
    value: false,
    branches: [
      {
        id: 'internal.s4hana',
        name: 's4hana',
        value: false,
        branches: [{ id: 'internal.s4hana.s4Id', name: 's4Id', value: false, branches: [], switchId: 'object' }],
        switchId: 'object',
      },
      {
        id: 'internal.crm',
        name: 'crm',
        value: false,
        branches: [
          { id: 'internal.crm.crmGuid', name: 'crmGuid', value: false, branches: [], switchId: 'object' },
          { id: 'internal.crm.crmId', name: 'crmId', value: false, branches: [], switchId: 'object' },
        ],
        switchId: 'object',
      },
      { id: 'internal.madId', name: 'madId', value: false, branches: [], switchId: 'object' },
    ],
    switchId: 'object',
  },
  {
    id: 'addresses',
    name: 'addresses',
    value: false,
    branches: [
      {
        id: 'addresses.soldTo',
        name: 'soldTo',
        value: false,
        branches: [{ id: 'addresses.entrance', name: 'entrance', value: false, branches: [], switchId: 'object' }],
        switchId: 'object',
      },
      {
        id: 'addresses.shipTo',
        name: 'shipTo',
        value: false,
        branches: [{ id: 'addresses.apartment', name: 'apartment', value: false, branches: [], switchId: 'object' }],
        switchId: 'object',
      },
    ],
    switchId: 'object',
  },
]
