import PayloadCreator from './payloadCreator.js'
import { expectedSchemaResponse } from './dataTest.js'
import { removePropertyFromObjectCascading } from '../objectHelper.js'

describe('Payload Creator test suite', () => {
  test('createPayloadWithRequiredOnly v1', async () => {
    const originalPayload = {
      addressesSchema: {
        fields: {
          fieldEcryptedRegex: {
            required: false,
            type: 'string',
            allowNull: true,
            writeAccess: 'serverOnly',
            encrypt: 'AES',
          },
        },
      },
    }
    const expectedPayload = {
      fields: {
        fieldEcryptedRegex: {
          required: false,
        },
      },
    }
    const obj = PayloadCreator.createPayloadWithRequiredOnly(originalPayload, 'addressesSchema')
    expect(obj.addressesSchema).toStrictEqual(expectedPayload)
  })

  test('createPayloadWithRequiredOnly v2', async () => {
    const originalPayload = {
      addressesSchema: {
        fields: {
          fieldEcryptedRegex: {
            required: false,
            type: 'string',
            allowNull: true,
            writeAccess: 'serverOnly',
            encrypt: 'AES',
          },
          otherFieldEcryptedRegex: {
            required: true,
            type: 'string',
            allowNull: true,
            writeAccess: 'serverOnly',
            encrypt: 'AES',
          },
          metadata: {
            selectedSuggestion: {
              type: 'string',
              required: false,
              writeAccess: 'serverOnly',
              allowNull: true,
              format: null,
              encrypt: 'AES',
            },
            verifiedAddress: {
              floor: {
                type: 'string',
                required: false,
                writeAccess: 'serverOnly',
                allowNull: true,
                format: null,
                encrypt: 'AES',
              },
              apartment: {
                type: 'string',
                required: true,
                writeAccess: 'serverOnly',
                allowNull: true,
                format: null,
                encrypt: 'AES',
              },
            },
          },
        },
      },
    }
    const expectedPayload = {
      fields: {
        fieldEcryptedRegex: {
          required: false,
        },
        otherFieldEcryptedRegex: {
          required: true,
        },
        metadata: {
          selectedSuggestion: {
            required: false,
          },
          verifiedAddress: {
            floor: {
              required: false,
            },
            apartment: {
              required: true,
            },
          },
        },
      },
    }
    const obj = PayloadCreator.createPayloadWithRequiredOnly(originalPayload, 'addressesSchema')
    expect(obj.addressesSchema).toStrictEqual(expectedPayload)
  })

  test('createPayloadWithRequiredOnly', async () => {
    const expectedResponse = JSON.parse(JSON.stringify(expectedSchemaResponse.addressesSchema))
    removePropertyFromObjectCascading(expectedResponse, 'type')
    removePropertyFromObjectCascading(expectedResponse, 'writeAccess')
    removePropertyFromObjectCascading(expectedResponse, 'allowNull')
    removePropertyFromObjectCascading(expectedResponse, 'format')
    removePropertyFromObjectCascading(expectedResponse, 'encrypt')
    const obj = PayloadCreator.createPayloadWithRequiredOnly(expectedSchemaResponse, 'addressesSchema')
    expect(obj.addressesSchema).toStrictEqual(expectedResponse)
  })
})
