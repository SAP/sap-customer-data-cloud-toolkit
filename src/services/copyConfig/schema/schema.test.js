import Schema from './schema'
import * as CommonTestData from '../../servicesDataTest'
import { expectedSchemaResponse, getExpectedBodyForChildSite, getExpectedBodyForParentSite } from './dataTest'
import axios from 'axios'
import { errorCallback, expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk } from '../../servicesDataTest'
import { getSiteConfigSuccessfullyMultipleMember } from '../../configurator/dataTest'

jest.mock('axios')

describe('Schema test suite', () => {
  const apiKey = 'apiKey'
  const dataCenterConfiguration = getSiteConfigSuccessfullyMultipleMember(1)
  const dataCenter = dataCenterConfiguration.dataCenter
  const schema = new Schema(CommonTestData.credentials, apiKey, dataCenter)

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('copy successfully to parent site', async () => {
    let spy = jest.spyOn(schema, 'set')
    const expectCallArgument = getExpectedBodyForParentSite()
    axios.mockResolvedValueOnce({ data: expectedSchemaResponse }).mockResolvedValueOnce({ data: expectedGigyaResponseOk })
    const response = await schema.copy(apiKey, dataCenterConfiguration)
    expect(response).toEqual(expectedGigyaResponseOk)
    expect(response.id).toEqual(`Schema;${apiKey}`)

    expect(spy.mock.calls.length).toBe(1)
    expect(spy).toHaveBeenCalledWith(apiKey, dataCenter, expectCallArgument)
  })

  test('copy successfully to child site', async () => {
    const dataCenterConfiguration = getSiteConfigSuccessfullyMultipleMember(0)
    let spy = jest.spyOn(schema, 'set')
    axios
      .mockResolvedValueOnce({ data: JSON.parse(JSON.stringify(expectedSchemaResponse)) })
      .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
    const response = await schema.copy(apiKey, dataCenterConfiguration)
    expect(response).toEqual(expectedGigyaResponseOk)
    expect(response.id).toEqual(`Schema;${apiKey}`)

    expect(spy.mock.calls.length).toBe(2)
    const expectCallArgument = getExpectedBodyForChildSite()
    delete expectCallArgument.dataSchema.fields.terms.required
    delete expectCallArgument.dataSchema.fields.subscribe.required

    const expectCallArgument2 = getExpectedBodyForChildSite()
    delete expectCallArgument2.profileSchema
    const terms = expectCallArgument2.dataSchema.fields.terms
    delete terms.type
    delete terms.writeAccess
    delete terms.allowNull
    const subscribe = expectCallArgument2.dataSchema.fields.subscribe
    delete subscribe.type
    delete subscribe.writeAccess
    delete subscribe.allowNull
    expectCallArgument2['scope'] = 'site'

    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenter, expectCallArgument)
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenter, expectCallArgument2)
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockedResponse = { data: expectedGigyaResponseInvalidAPI }

    const err = {
      message: mockedResponse.data.errorMessage,
      code: mockedResponse.data.errorCode,
      details: mockedResponse.data.errorDetails,
    }
    axios.mockResolvedValueOnce(mockedResponse)

    await schema
      .copy(apiKey, dataCenterConfiguration)
      .then(() => {
        // It should not reach here
        expect(1).toEqual(0)
      })
      .catch((error) => {
        errorCallback(error, err)
        expect(error.id).toEqual(`Schema;${apiKey}`)
      })
  })

  test('copy unsuccessfully - error on set', async () => {
    const mockedResponse = { data: expectedGigyaResponseInvalidAPI }

    const err = {
      message: mockedResponse.data.errorMessage,
      code: mockedResponse.data.errorCode,
      details: mockedResponse.data.errorDetails,
    }
    axios.mockResolvedValueOnce({ data: expectedSchemaResponse }).mockResolvedValueOnce(mockedResponse)
    await schema
      .copy(apiKey, dataCenterConfiguration)
      .then(() => {
        // It should not reach here
        expect(1).toEqual(0)
      })
      .catch((error) => {
        errorCallback(error, err)
        expect(error.id).toEqual(`Schema;${apiKey}`)
      })
  })
})
