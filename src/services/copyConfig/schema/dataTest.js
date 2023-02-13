export const expectedSchemaResponse = {
  callId: '617d9ce97ce44902afac6083e843d795',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-01-17T10:10:22.541Z',
  profileSchema: {
    fields: {
      email: {
        required: false,
        format: "regex('')",
        type: 'string',
        allowNull: true,
        writeAccess: 'clientModify',
        encrypt: 'AES',
      },
      birthYear: {
        required: false,
        type: 'long',
        allowNull: true,
        writeAccess: 'clientModify',
      },
      firstName: {
        required: false,
        type: 'string',
        allowNull: true,
        writeAccess: 'clientModify',
        encrypt: 'AES',
      },
      lastName: {
        required: false,
        type: 'string',
        allowNull: true,
        writeAccess: 'clientModify',
        encrypt: 'AES',
      },
      zip: {
        required: false,
        type: 'string',
        allowNull: true,
        writeAccess: 'clientModify',
        encrypt: 'AES',
      },
      country: {
        required: false,
        type: 'string',
        allowNull: true,
        writeAccess: 'clientModify',
        encrypt: 'AES',
      },
    },
    dynamicSchema: false,
  },
  dataSchema: {
    fields: {
      terms: {
        required: false,
        type: 'boolean',
        allowNull: true,
        writeAccess: 'clientModify',
      },
      subscribe: {
        required: false,
        type: 'boolean',
        allowNull: true,
        writeAccess: 'clientModify',
      },
    },
    dynamicSchema: true,
  },
  subscriptionsSchema: {
    fields: {},
  },
  preferencesSchema: {
    fields: {
      'terms.test': {
        type: 'consent',
        format: 'true',
        required: false,
        writeAccess: 'clientCreate',
        customData: [],
        consentVaultRetentionPeriod: 36,
        currentDocDate: '2023-01-17T00:00:00Z',
        minDocDate: '2023-01-17T00:00:00Z',
      },
    },
  },
}

export function getDataSchemaExpectedBodyForParentSite(apiKey) {
  const expectedBody = JSON.parse(JSON.stringify(expectedSchemaResponse))
  expectedBody.context = { targetApiKey: apiKey, id: 'dataSchema' }
  delete expectedBody.profileSchema
  delete expectedBody.preferencesSchema
  return expectedBody
}

export function getProfileSchemaExpectedBodyForParentSite(apiKey) {
  const expectedBody = JSON.parse(JSON.stringify(expectedSchemaResponse))
  expectedBody.context = { targetApiKey: apiKey, id: 'profileSchema' }
  const fields = expectedBody.profileSchema.fields
  delete fields.email.allowNull
  delete fields.birthYear.allowNull
  delete fields.firstName.allowNull
  delete fields.lastName.allowNull
  delete fields.zip.allowNull
  delete fields.country.allowNull
  delete expectedBody.profileSchema.dynamicSchema

  delete expectedBody.dataSchema
  delete expectedBody.preferencesSchema
  return expectedBody
}

export function getDataSchemaExpectedBodyForChildSiteStep1(apiKey) {
  const expectedBody = getDataSchemaExpectedBodyForParentSite(apiKey)
  const fields = expectedBody.dataSchema.fields
  delete fields.terms.required
  delete fields.subscribe.required

  delete expectedBody.profileSchema
  delete expectedBody.preferencesSchema
  return expectedBody
}

export function getDataSchemaExpectedBodyForChildSiteStep2(apiKey) {
  const expectedBody = getDataSchemaExpectedBodyForParentSite(apiKey)
  const fields = expectedBody.dataSchema.fields
  delete fields.terms.allowNull
  delete fields.subscribe.allowNull
  delete fields.terms.writeAccess
  delete fields.subscribe.writeAccess
  delete fields.terms.type
  delete fields.subscribe.type
  expectedBody.scope = 'site'

  delete expectedBody.profileSchema
  delete expectedBody.preferencesSchema
  return expectedBody
}

export function getProfileSchemaExpectedBodyForChildSite(apiKey) {
  const expectedBody = getProfileSchemaExpectedBodyForParentSite(apiKey)
  const fields = expectedBody.profileSchema.fields
  delete fields.email.required
  delete fields.birthYear.required
  delete fields.firstName.required
  delete fields.lastName.required
  delete fields.zip.required
  delete fields.country.required

  delete expectedBody.dataSchema
  delete expectedBody.preferencesSchema
  return expectedBody
}
