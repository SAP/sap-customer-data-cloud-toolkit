export const sitesConfigurations = [
  {
    siteId: 'dcdd5bcc-0c9d-40f3-897b-cbb07138d0f7',
    sourceSites: [
      {
        apiKey: '4_tskE-LFxBm0-MJyvw0VoAA',
        baseDomain: 'danielc2',
        dataCenter: 'us1',
        partnerId: 79597568,
        partnerName: 'SAP Customer Data Cloud',
      },
    ],
    configurations: [
      {
        id: 'schema',
        name: 'schema',
        value: true,
        branches: [
          {
            id: 'dataSchema',
            name: 'dataSchema',
            value: true,
          },
          {
            id: 'profileSchema',
            name: 'profileSchema',
            value: true,
          },
        ],
      },
    ],
  },
]

export const siteId = 'dcdd5bcc-0c9d-40f3-897b-cbb07138d0f7'

export const testString = 'test'

export const initialState = {
  sitesConfigurations: [],
  isLoading: false,
  isSourceInfoLoading: false,
  errors: [],
  apiCardError: undefined,
}

export const stateWithConfigurations = {
  sitesConfigurations: sitesConfigurations,
  isLoading: false,
  isSourceInfoLoading: false,
  errors: [],
  apiCardError: undefined,
}

export const testSourceSite = {
  apiKey: testString,
  baseDomain: testString,
  dataCenter: 'us1',
  partnerId: 12345667,
  partnerName: 'SAP Customer Data Cloud',
}

export const testConfiguration = {
  id: 'schema',
  name: 'schema',
  value: false,
  branches: [
    {
      id: 'dataSchema',
      name: 'dataSchema',
      value: false,
    },
    {
      id: 'profileSchema',
      name: 'profileSchema',
      value: false,
    },
  ],
}

export const siteInformation = {
  baseDomain: testSourceSite.baseDomain,
  context: { targetApiKey: testSourceSite.apiKey },
  dataCenter: testSourceSite.dataCenter,
  partnerName: testSourceSite.partnerName,
  partnerId: testSourceSite.partnerId,
}
