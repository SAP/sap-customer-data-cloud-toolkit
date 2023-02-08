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

export const mockedErrorsResponse = [{ statusCode: 40000, message: 'I am a dummy error' }]

export const initialState = {
  configurations: [],
  errors: [],
  isLoading: false,
  targetApiKeys: [],
  showSuccessMessage: false,
  currentSiteInformation: {},
}

export const initialStateWithConfigurations = {
  configurations: configurationsMockedResponse,
  errors: [],
  isLoading: false,
  targetApiKeys: [],
  showSuccessMessage: false,
}

export const initialStateWithErrors = {
  configurations: [],
  errors: mockedErrorsResponse,
  isLoading: false,
  targetApiKeys: [],
  showSuccessMessage: false,
}

export const siteConfigResponse = {
  baseDomain: 'a_b_c_dummy_site',
}

export const dummyTargetApiKey = 'asdlkjpoiqwekjhdsfbvc'

export const initialStateWithTargetApiKey = {
  configurations: [],
  errors: mockedErrorsResponse,
  isLoading: false,
  targetApiKeys: [dummyTargetApiKey],
  showSuccessMessage: false,
}
