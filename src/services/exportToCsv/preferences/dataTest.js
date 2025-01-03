export const expectedPreferencesOptions = [
  {
    id: 'preferences',
    name: 'preferences',
    value: true,
    branches: [
      {
        id: 'preferences.terms',
        name: 'terms',
        value: true,
        branches: [
          {
            id: 'preferences.terms.sap',
            name: 'sap',
            value: true,
            branches: [
              {
                id: 'preferences.terms.sap.isConsentGranted',
                name: 'isConsentGranted',
                value: true,
                branches: [],
                mandatory: true,
              },
              {
                id: 'preferences.terms.sap.actionTimestamp',
                name: 'actionTimestamp',
                value: true,
                branches: [],
              },
              {
                id: 'preferences.terms.sap.lastConsentModified',
                name: 'lastConsentModified',
                value: true,
                branches: [],
              },
              {
                id: 'preferences.terms.sap.docVersion',
                name: 'docVersion',
                value: true,
                branches: [],
              },
              {
                id: 'preferences.terms.sap.docDate',
                name: 'docDate',
                value: true,
                branches: [],
              },
              {
                id: 'preferences.terms.sap.tags',
                name: 'tags',
                value: true,
                branches: [],
              },
              {
                id: 'preferences.terms.sap.entitlements',
                name: 'entitlements',
                value: true,
                branches: [],
              },
            ],
          },
        ],
      },
      {
        id: 'preferences.privacy',
        name: 'privacy',
        value: false,
        branches: [
          {
            id: 'preferences.privacy.sap',
            name: 'sap',
            value: false,
            branches: [
              {
                id: 'preferences.privacy.sap.isConsentGranted',
                name: 'isConsentGranted',
                value: false,
                branches: [],
                mandatory: false,
              },
              {
                id: 'preferences.privacy.sap.actionTimestamp',
                name: 'actionTimestamp',
                value: false,
                branches: [],
              },
              {
                id: 'preferences.privacy.sap.lastConsentModified',
                name: 'lastConsentModified',
                value: false,
                branches: [],
              },
              {
                id: 'preferences.privacy.sap.docVersion',
                name: 'docVersion',
                value: false,
                branches: [],
              },
              {
                id: 'preferences.privacy.sap.docDate',
                name: 'docDate',
                value: false,
                branches: [],
              },
              {
                id: 'preferences.privacy.sap.tags',
                name: 'tags',
                value: false,
                branches: [],
              },
              {
                id: 'preferences.privacy.sap.entitlements',
                name: 'entitlements',
                value: false,
                branches: [],
              },
            ],
          },
        ],
      },
      {
        id: 'preferences.cookie',
        name: 'cookie',
        value: false,
        branches: [
          {
            id: 'preferences.cookie.isConsentGranted',
            name: 'isConsentGranted',
            value: false,
            branches: [],
            mandatory: false,
          },
          {
            id: 'preferences.cookie.actionTimestamp',
            name: 'actionTimestamp',
            value: false,
            branches: [],
          },
          {
            id: 'preferences.cookie.lastConsentModified',
            name: 'lastConsentModified',
            value: false,
            branches: [],
          },
          {
            id: 'preferences.cookie.docVersion',
            name: 'docVersion',
            value: false,
            branches: [],
          },
          {
            id: 'preferences.cookie.docDate',
            name: 'docDate',
            value: false,
            branches: [],
          },
          {
            id: 'preferences.cookie.tags',
            name: 'tags',
            value: false,
            branches: [],
          },
          {
            id: 'preferences.cookie.entitlements',
            name: 'entitlements',
            value: false,
            branches: [],
          },
        ],
      },
    ],
  },
]

export const expectedPreferencesResponse = [
  'preferences.terms.sap.isConsentGranted',
  'preferences.terms.sap.actionTimestamp',
  'preferences.terms.sap.lastConsentModified',
  'preferences.terms.sap.docVersion',
  'preferences.terms.sap.docDate',
  'preferences.terms.sap.tags',
  'preferences.terms.sap.entitlements',
]
