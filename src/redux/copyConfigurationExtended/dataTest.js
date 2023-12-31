/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


export const configurationsMockedResponse = [
  {
    id: 'schemaId',
    name: 'schema',
    value: true,
    branches: [
      { id: 'dataSchemaId', name: 'dataSchema', value: true },
      { id: 'profileSchemaId', name: 'profileSchema', value: true },
    ],
  },
  { id: 'smsTemplatesId', name: 'smsTemplates', value: false },
  {
    id: 'screenSetsId',
    name: 'screenSets',
    value: false,
    branches: [
      {
        id: 'defaultId',
        name: 'default',
        value: false,
        branches: [
          { id: 'defaultLinkAccountsId', name: 'defaultLinkAccounts', value: false },
          { id: 'defaultLiteRegistrationId', name: 'defaultLiteRegistration', value: false },
        ],
      },
      {
        id: 'customId',
        name: 'custom',
        value: false,
        branches: [
          { id: 'customLinkAccountsId', name: 'customLinkAccounts', value: false },
          { id: 'customLiteRegistrationId', name: 'customLiteRegistration', value: false },
        ],
      },
    ],
  },
]

export const initialState = {
  configurations: [],
  errors: [],
  apiCardError: undefined,
  isLoading: false,
  targetSites: [],
  showSuccessMessage: false,
  availableTargetSites: [],
  currentSiteInformation: {},
  isTargetInfoLoading: false,
  currentSiteApiKey: '',
  unfilteredAvailableTargetSites: [],
}

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

export const initialStateWithConfigurations = {
  configurations: configurationsMockedResponse,
  errors: [],
  isLoading: false,
  targetSites: [],
  showSuccessMessage: false,
}

export const initialStateWithErrors = {
  configurations: [
    {
      id: 'schemaId',
      name: 'schema',
      value: true,
      branches: [
        { id: 'dataSchemaId', name: 'dataSchema', value: true },
        { id: 'profileSchemaId', name: 'profileSchema', value: true },
      ],
      error: mockedErrorsResponse,
    },
  ],
  errors: mockedErrorsResponse,
  isLoading: false,
  targetSites: [{ apiKey: dummyTargetApiKey, error: mockedErrorsResponse }],
  showSuccessMessage: false,
}

export const siteConfigResponse = {
  targetSite: {
    baseDomain: 'a_b_c_dummy_site',
    apiKey: dummyTargetApiKey,
    dataCenter: 'eu1',
    context: { targetApiKey: dummyTargetApiKey },
    partnerName: 'test',
    partnerId: 123456,
  },
}

export const expectedTargetSite = {
  baseDomain: 'a_b_c_dummy_site',
  dataCenter: 'eu1',
  apiKey: dummyTargetApiKey,
  partnerName: 'test',
  partnerId: 123456,
}

export const initialStateWithTargetApiKey = {
  configurations: [],
  errors: [],
  isLoading: false,
  targetSites: [expectedTargetSite],
  showSuccessMessage: false,
}

export const initialStateWithTargetApiKeyAndConfigurations = {
  configurations: configurationsMockedResponse,
  errors: [],
  isLoading: false,
  targetSites: [expectedTargetSite],
  showSuccessMessage: false,
}

export const setConfigSuccessResponse = {
  callId: '9203bf0eed4b4e31802d4aa02e1ad6a0',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-02-08T12:03:36.046Z',
}

export const getUserSitesResponse = [
  {
    apiKey: dummyTargetApiKey,
    baseDomain: 'dev.test.com',
    dataCenter: 'eu1',
  },
]

export const duplicatedWarningMessage = 'The Site you are adding is already in the Target Sites List!'

export const initialStateWithApiCardError = {
  configurations: [],
  errors: [],
  apiCardError: { errorMessage: duplicatedWarningMessage },
  isLoading: false,
  targetSites: [],
  showSuccessMessage: false,
  availableTargetSites: [],
  currentSiteInformation: {},
  isTargetInfoLoading: false,
}

export const dummySecretKey = '1234567890abcdef'

export const getAvailableTargetApiKeysPayload = {
  availableTargetSites: getUserSitesResponse,
  secret: dummySecretKey,
}

export const configurationsWithDataflows = [
  {
    id: 'dataflows',
    name: 'schema',
    value: true,
    branches: [
      { id: 'dataflow1', name: 'dataflow1', value: true, variables: [{ variable: 'var1', value: 'test1' }] },
      { id: 'dataflow2', name: 'dataflow2', value: true, variables: [{ variable: 'var2', value: '' }] },
    ],
  },
]

export const initialStateWithDataflows = {
  configurations: configurationsWithDataflows,
  errors: [],
  apiCardError: undefined,
  isLoading: false,
  targetSites: [],
  showSuccessMessage: false,
  availableTargetSites: [],
  currentSiteInformation: {},
  isTargetInfoLoading: false,
}
