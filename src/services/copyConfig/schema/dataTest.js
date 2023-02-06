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

export function getExpectedBodyForParentSite() {
  const expectedBody = JSON.parse(JSON.stringify(expectedSchemaResponse))
  const fields = expectedBody.profileSchema.fields
  delete fields.email.allowNull
  delete fields.birthYear.allowNull
  delete fields.firstName.allowNull
  delete fields.lastName.allowNull
  delete fields.zip.allowNull
  delete fields.country.allowNull
  delete expectedBody.profileSchema.dynamicSchema
  return expectedBody
}

export function getExpectedBodyForChildSite() {
  const expectedBody = getExpectedBodyForParentSite()
  const fields = expectedBody.profileSchema.fields
  delete fields.email.required
  delete fields.birthYear.required
  delete fields.firstName.required
  delete fields.lastName.required
  delete fields.zip.required
  delete fields.country.required
  return expectedBody
}
