import { passwordObjectStructure } from './passwordImport/passwordObjectStructure'

export const profileSchemaFields = {
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
}

export const dataSchemaFields = {
  fields: {
    'loyalty.rewardPoints': {
      required: false,
      type: 'integer',
    },
    'loyalty.rewardRedemption.redemptionDate': {
      required: false,
      type: 'date',
    },
    'loyalty.loyaltyStatus': {
      required: false,
      type: 'string',
    },
    'loyalty.rewardRedemption.redemptionPoint': {
      required: false,
      type: 'integer',
    },
    'loyalty.rewardAmount': {
      required: false,
      type: 'float',
    },
  },
  dynamicSchema: false,
}

export const subscriptionsSchemaFields = {
  fields: {
    'newsletter.commercial': {},
  },
}

export const internalSchemaFields = {
  fields: {
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
}

export const addressesSchemaFields = {
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
}

export const profileBranches = [
  {
    id: 'profile.photoURL',
    name: 'photoURL',
    value: false,
    branches: [],
    switchId: 'object',
  },
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
          {
            id: 'profile.oidcData.address.locality',
            name: 'locality',
            value: false,
            branches: [],
            switchId: 'object',
          },
          {
            id: 'profile.oidcData.address.formatted',
            name: 'formatted',
            value: false,
            branches: [],
            switchId: 'object',
          },
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
        branches: [
          {
            id: 'profile.favorites.activities.category',
            name: 'category',
            value: false,
            branches: [],
            switchId: 'object',
          },
        ],
        switchId: 'object',
      },
      {
        id: 'profile.favorites.movies',
        name: 'movies',
        value: false,
        branches: [
          {
            id: 'profile.favorites.movies.name',
            name: 'name',
            value: false,
            branches: [],
            switchId: 'object',
          },
        ],
        switchId: 'object',
      },
    ],
    switchId: 'object',
  },
  {
    id: 'profile.certifications',
    name: 'certifications',
    value: false,
    branches: [
      {
        id: 'profile.certifications.number',
        name: 'number',
        value: false,
        branches: [],
        switchId: 'object',
      },
    ],
    switchId: 'object',
  },
  {
    id: 'profile.religion',
    name: 'religion',
    value: false,
    branches: [],
    switchId: 'object',
  },
]

export const dataBranches = [
  {
    id: 'data.loyalty',
    name: 'loyalty',
    value: false,
    branches: [
      {
        id: 'data.loyalty.rewardPoints',
        name: 'rewardPoints',
        value: false,
        branches: [],
        switchId: 'object',
      },
      {
        id: 'data.loyalty.rewardRedemption',
        name: 'rewardRedemption',
        value: false,
        branches: [
          {
            id: 'data.loyalty.rewardRedemption.redemptionDate',
            name: 'redemptionDate',
            value: false,
            branches: [],
            switchId: 'object',
          },
          {
            id: 'data.loyalty.rewardRedemption.redemptionPoint',
            name: 'redemptionPoint',
            value: false,
            branches: [],
            switchId: 'object',
          },
        ],
        switchId: 'object',
      },
      {
        id: 'data.loyalty.loyaltyStatus',
        name: 'loyaltyStatus',
        value: false,
        branches: [],
        switchId: 'object',
      },
      {
        id: 'data.loyalty.rewardAmount',
        name: 'rewardAmount',
        value: false,
        branches: [],
        switchId: 'object',
      },
    ],
    switchId: 'object',
  },
]

export const subscriptionsBranches = [
  {
    id: 'subscriptions.newsletter.commercial',
    name: 'newsletter.commercial',
    value: false,
    branches: [
      {
        id: 'subscriptions.newsletter.commercial.isSubscribed',
        name: 'isSubscribed',
        value: false,
        branches: [],
      },
      {
        id: 'subscriptions.newsletter.commercial.tags',
        name: 'tags',
        value: false,
        branches: [],
      },
      {
        id: 'subscriptions.newsletter.commercial.lastUpdatedSubscriptionState',
        name: 'lastUpdatedSubscriptionState',
        value: false,
        branches: [],
      },
      {
        id: 'subscriptions.newsletter.commercial.doubleOptIn',
        name: 'doubleOptIn',
        value: false,
        branches: [
          {
            id: 'subscriptions.newsletter.commercial.doubleOptIn.isExternallyVerified',
            name: 'isExternallyVerified',
            value: false,
            branches: [],
          },
        ],
      },
    ],
    switchId: 'object',
  },
]

export const internalBranches = [
  {
    id: 'internal.crm',
    name: 'crm',
    value: false,
    branches: [
      {
        id: 'internal.crm.crmGuid',
        name: 'crmGuid',
        value: false,
        branches: [],
        switchId: 'object',
      },
      {
        id: 'internal.crm.crmId',
        name: 'crmId',
        value: false,
        branches: [],
        switchId: 'object',
      },
    ],
    switchId: 'object',
  },
  {
    id: 'internal.madId',
    name: 'madId',
    value: false,
    branches: [],
    switchId: 'object',
  },
]

export const addressesBranches = [
  {
    id: 'addresses.soldTo',
    name: 'soldTo',
    value: false,
    branches: [
      {
        id: 'addresses.soldTo.entrance',
        name: 'entrance',
        value: false,
        branches: [],
      },
    ],
  },
  {
    id: 'addresses.shipTo',
    name: 'shipTo',
    value: false,
    branches: [
      {
        id: 'addresses.shipTo.apartment',
        name: 'apartment',
        value: false,
        branches: [],
      },
    ],
  },
]

export const preferencesBranches = [
  {
    id: 'preferences.terms',
    name: 'terms',
    value: false,
    branches: [
      {
        id: 'preferences.terms.sap',
        name: 'sap',
        value: false,
        branches: [
          { id: 'preferences.terms.sap.isConsentGranted', name: 'isConsentGranted', value: false, branches: [] },
          { id: 'preferences.terms.sap.actionTimestamp', name: 'actionTimestamp', value: false, branches: [] },
          { id: 'preferences.terms.sap.lastConsentModified', name: 'lastConsentModified', value: false, branches: [] },
          { id: 'preferences.terms.sap.docVersion', name: 'docVersion', value: false, branches: [] },
          { id: 'preferences.terms.sap.docDate', name: 'docDate', value: false, branches: [] },
          { id: 'preferences.terms.sap.tags', name: 'tags', value: false, branches: [] },
          { id: 'preferences.terms.sap.entitlements', name: 'entitlements', value: false, branches: [] },
        ],
      },
    ],
  },
]

export const communicationsBranches = [
  {
    id: 'communications.C_Email',
    name: 'C_Email',
    value: false,
    branches: [{ id: 'communications.C_Email.status', name: 'status', value: false, branches: [] }],
  },
  {
    id: 'communications.T_Email',
    name: 'T_Email',
    value: false,
    branches: [{ id: 'communications.T_Email.status', name: 'status', value: false, branches: [] }],
  },
  {
    id: 'communications.C_mobileApp',
    name: 'C_mobileApp',
    value: false,
    branches: [
      { id: 'communications.C_mobileApp.status', name: 'status', value: false, branches: [] },
      { id: 'communications.C_mobileApp.optIn.acceptanceLocation', name: 'acceptanceLocation', value: false, branches: [] },
      { id: 'communications.C_mobileApp.optIn.sourceApplication', name: 'sourceApplication', value: false, branches: [] },
    ],
  },
]

export const passwordBranches = [passwordObjectStructure()]
