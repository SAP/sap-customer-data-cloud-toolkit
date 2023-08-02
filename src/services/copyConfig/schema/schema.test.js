/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Schema from './schema'
import * as CommonTestData from '../../servicesDataTest'
import {
  expectedSchemaResponse,
  getDataSchemaExpectedBodyForParentSite,
  getDataSchemaExpectedBodyForChildSiteStep1,
  getDataSchemaExpectedBodyForChildSiteStep2,
  getProfileSchemaExpectedBodyForChildSite,
  getProfileSchemaExpectedBodyForParentSite,
  getSubscriptionsSchemaExpectedBodyForParentSite,
  getSubscriptionsSchemaExpectedBodyForChildSiteStep1,
  getSubscriptionsSchemaExpectedBodyForChildSiteStep2,
  expectedSourceChildCopyIssueSchemaResponse,
  expectedDestinationChildCopyIssueSchemaResponse,
} from './dataTest'
import axios from 'axios'
import { expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk } from '../../servicesDataTest'
import { getSiteConfigSuccessfullyMultipleMember } from '../../configurator/dataTest'
import { getExpectedResponseWithContext, getResponseWithContext, profileId, schemaId, subscriptionsId } from '../dataTest'
import Options from '../options'
import {
  ERROR_CODE_CANNOT_CHANGE_SCHEMA_FIELD_TYPE,
  ERROR_CODE_CANNOT_COPY_CHILD_THAT_HAVE_PARENT_ON_DESTINATION,
  ERROR_CODE_CANNOT_COPY_NEW_FIELD_OF_PROFILE_SCHEMA,
} from '../../errors/generateErrorResponse'

jest.mock('axios')

describe('Schema test suite', () => {
  const apiKey = 'apiKey'
  const dataCenterConfiguration = getSiteConfigSuccessfullyMultipleMember(1)
  const dataCenter = dataCenterConfiguration.dataCenter
  const schema = new Schema(CommonTestData.credentials, apiKey, dataCenter)
  const schemaOptions = new Options({
    branches: [
      { id: schemaId, name: schemaId, value: true },
      { id: profileId, name: profileId, value: true },
      { id: subscriptionsId, name: subscriptionsId, value: true },
    ],
  })

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('copy successfully to parent site', async () => {
    let spy = jest.spyOn(schema, 'set')
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, profileId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, subscriptionsId, apiKey) })
    const responses = await schema.copy(apiKey, dataCenterConfiguration, schemaOptions)
    expect(responses.length).toBe(3)
    expect(responses[1]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey))
    expect(responses[0]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, profileId, apiKey))
    expect(responses[2]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, subscriptionsId, apiKey))
    expect(responses[1].context.id).toEqual(schemaId)
    expect(responses[0].context.id).toEqual(profileId)
    expect(responses[2].context.id).toEqual(subscriptionsId)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)
    expect(responses[1].context.targetApiKey).toEqual(apiKey)
    expect(responses[2].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(3)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenter, getDataSchemaExpectedBodyForParentSite(apiKey))
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenter, getProfileSchemaExpectedBodyForParentSite(apiKey))
    expect(spy).toHaveBeenNthCalledWith(3, apiKey, dataCenter, getSubscriptionsSchemaExpectedBodyForParentSite(apiKey))
  })

  test('copy successfully to child site', async () => {
    const dataCenterConfiguration = getSiteConfigSuccessfullyMultipleMember(0)
    let spy = jest.spyOn(schema, 'set')
    axios
      .mockResolvedValueOnce({ data: JSON.parse(JSON.stringify(expectedSchemaResponse)) })
      .mockResolvedValueOnce({ data: JSON.parse(JSON.stringify(expectedSchemaResponse)) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, subscriptionsId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, profileId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, subscriptionsId, apiKey) })

    const responses = await schema.copy(apiKey, dataCenterConfiguration, schemaOptions)
    expect(responses.length).toBe(3)
    expect(responses[1]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey))
    expect(responses[0]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, profileId, apiKey))
    expect(responses[2]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, subscriptionsId, apiKey))
    expect(responses[1].context.id).toEqual(schemaId)
    expect(responses[0].context.id).toEqual(profileId)
    expect(responses[2].context.id).toEqual(subscriptionsId)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)
    expect(responses[1].context.targetApiKey).toEqual(apiKey)
    expect(responses[2].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(5)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenter, getDataSchemaExpectedBodyForChildSiteStep1(apiKey))
    expect(spy).toHaveBeenNthCalledWith(4, apiKey, dataCenter, getDataSchemaExpectedBodyForChildSiteStep2(apiKey))
    expect(spy).toHaveBeenNthCalledWith(3, apiKey, dataCenter, getSubscriptionsSchemaExpectedBodyForChildSiteStep1(apiKey))
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenter, getProfileSchemaExpectedBodyForChildSite(apiKey))
    expect(spy).toHaveBeenNthCalledWith(5, apiKey, dataCenter, getSubscriptionsSchemaExpectedBodyForChildSiteStep2(apiKey))
  })

  test('copy successfully to a site with the same field with different type', async () => {
    let spy = jest.spyOn(schema, 'set')
    const schemaResponseWithDifferentType = JSON.parse(JSON.stringify(expectedSchemaResponse))
    schemaResponseWithDifferentType.dataSchema.fields.terms.type = 'long'
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: schemaResponseWithDifferentType })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, profileId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, subscriptionsId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey) })
    const responses = await schema.copy(apiKey, dataCenterConfiguration, schemaOptions)
    expect(responses.length).toBe(4)
    expect(responses[3]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey))
    expect(responses[2].errorCode).toEqual(ERROR_CODE_CANNOT_CHANGE_SCHEMA_FIELD_TYPE)
    expect(responses[1]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, profileId, apiKey))
    expect(responses[0]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, subscriptionsId, apiKey))
    expect(responses[3].context.id).toEqual(schemaId)
    expect(responses[2].context.id).toEqual(schemaId)
    expect(responses[1].context.id).toEqual(profileId)
    expect(responses[0].context.id).toEqual(subscriptionsId)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)
    expect(responses[1].context.targetApiKey).toEqual(apiKey)
    expect(responses[2].context.targetApiKey).toEqual(apiKey)
    expect(responses[3].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(3)
    const expectedSchemaBodyWithDifferentType = getDataSchemaExpectedBodyForParentSite(apiKey)
    delete expectedSchemaBodyWithDifferentType.dataSchema.fields.terms.type
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenter, getProfileSchemaExpectedBodyForParentSite(apiKey))
    expect(spy).toHaveBeenNthCalledWith(3, apiKey, dataCenter, getSubscriptionsSchemaExpectedBodyForParentSite(apiKey))
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenter, expectedSchemaBodyWithDifferentType)
  })

  test('copy successfully child fields to a site with parent object created', async () => {
    const _schemaOptions = new Options({
      branches: [
        { id: schemaId, name: schemaId, value: true },
        { id: profileId, name: profileId, value: false },
        { id: subscriptionsId, name: subscriptionsId, value: false },
      ],
    })
    let spy = jest.spyOn(schema, 'set')
    axios
      .mockResolvedValueOnce({ data: expectedSourceChildCopyIssueSchemaResponse })
      .mockResolvedValueOnce({ data: expectedDestinationChildCopyIssueSchemaResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey) })
    const responses = await schema.copy(apiKey, dataCenterConfiguration, _schemaOptions)
    expect(responses.length).toBe(3)
    expect(responses[0]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey))
    expect(responses[1].errorCode).toEqual(ERROR_CODE_CANNOT_COPY_CHILD_THAT_HAVE_PARENT_ON_DESTINATION)
    expect(responses[2].errorCode).toEqual(ERROR_CODE_CANNOT_COPY_CHILD_THAT_HAVE_PARENT_ON_DESTINATION)
    expect(responses[0].context.id).toEqual(schemaId)
    expect(responses[1].context.id).toEqual(schemaId)
    expect(responses[2].context.id).toEqual(schemaId)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)
    expect(responses[1].context.targetApiKey).toEqual(apiKey)
    expect(responses[2].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(1)
    const expectedSchemaBodyWithOutChildren = JSON.parse(JSON.stringify(expectedSourceChildCopyIssueSchemaResponse))
    expectedSchemaBodyWithOutChildren.context = { targetApiKey: apiKey, id: schemaId }
    delete expectedSchemaBodyWithOutChildren.dataSchema.fields['nutritionCookingDislikes.item']
    delete expectedSchemaBodyWithOutChildren.dataSchema.fields['nutritionCookingDislikes.flag']
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenter, expectedSchemaBodyWithOutChildren)
  })

  test('copy successfully profile schema with extra fields on source site', async () => {
    const _schemaOptions = new Options({
      branches: [
        { id: schemaId, name: schemaId, value: false },
        { id: profileId, name: profileId, value: true },
        { id: subscriptionsId, name: subscriptionsId, value: false },
      ],
    })
    let spy = jest.spyOn(schema, 'set')
    const expectedDestinationSiteSchemaResponse = JSON.parse(JSON.stringify(expectedSchemaResponse))
    delete expectedDestinationSiteSchemaResponse.profileSchema.fields.email
    delete expectedDestinationSiteSchemaResponse.profileSchema.fields.birthYear
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: expectedDestinationSiteSchemaResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, profileId, apiKey) })
    const responses = await schema.copy(apiKey, dataCenterConfiguration, _schemaOptions)
    expect(responses.length).toBe(3)
    expect(responses[0]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, profileId, apiKey))
    expect(responses[1].errorCode).toEqual(ERROR_CODE_CANNOT_COPY_NEW_FIELD_OF_PROFILE_SCHEMA)
    expect(responses[2].errorCode).toEqual(ERROR_CODE_CANNOT_COPY_NEW_FIELD_OF_PROFILE_SCHEMA)
    expect(responses[0].context.id).toEqual(profileId)
    expect(responses[1].context.id).toEqual(profileId)
    expect(responses[2].context.id).toEqual(profileId)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)
    expect(responses[1].context.targetApiKey).toEqual(apiKey)
    expect(responses[2].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(1)
    const expectedSchemaBodyWithOutExtraFields = getProfileSchemaExpectedBodyForParentSite(apiKey)
    delete expectedSchemaBodyWithOutExtraFields.profileSchema.fields.email
    delete expectedSchemaBodyWithOutExtraFields.profileSchema.fields.birthYear
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenter, expectedSchemaBodyWithOutExtraFields)
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockedResponse = JSON.parse(JSON.stringify(expectedGigyaResponseInvalidAPI))
    mockedResponse.context = JSON.stringify({ id: 'schema', targetApiKey: apiKey })
    axios.mockResolvedValueOnce({ data: mockedResponse })

    const response = await schema.copy(apiKey, dataCenterConfiguration, schemaOptions)
    expect(response).toEqual(mockedResponse)
    expect(response.context.id).toEqual('schema')
    expect(response.context.targetApiKey).toEqual(`${apiKey}`)
  })

  test('copy unsuccessfully - error on set data', async () => {
    const mockedDataResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, schemaId, apiKey)
    const mockedProfileResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, profileId, apiKey)
    const mockedSubscriptionsResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, subscriptionsId, apiKey)
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: mockedDataResponse })
      .mockResolvedValueOnce({ data: mockedProfileResponse })
      .mockResolvedValueOnce({ data: mockedSubscriptionsResponse })
    const responses = await schema.copy(apiKey, dataCenterConfiguration, schemaOptions)
    expect(responses.length).toBe(3)
    expect(responses[1]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, schemaId, apiKey))
    expect(responses[1].context.id).toEqual(schemaId)
    expect(responses[1].context.targetApiKey).toEqual(apiKey)
    expect(responses[0]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, profileId, apiKey))
    expect(responses[0].context.id).toEqual(profileId)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)
    expect(responses[2]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, subscriptionsId, apiKey))
    expect(responses[2].context.id).toEqual(subscriptionsId)
    expect(responses[2].context.targetApiKey).toEqual(apiKey)
  })

  test('copy all schema except subscriptions to parent site', async () => {
    let spy = jest.spyOn(schema, 'set')
    const schemaResponse = expectedSchemaResponse
    delete schemaResponse.subscriptionsSchema.fields.subscription1
    delete schemaResponse.subscriptionsSchema.fields.subscription2

    const schemaOptions = new Options({
      branches: [
        { id: schemaId, name: schemaId, value: true },
        { id: profileId, name: profileId, value: true },
      ],
    })
    axios
      .mockResolvedValueOnce({ data: schemaResponse })
      .mockResolvedValueOnce({ data: schemaResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, profileId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey) })
    const responses = await schema.copy(apiKey, dataCenterConfiguration, schemaOptions)
    expect(responses.length).toBe(2)
    expect(responses[0]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey))
    expect(responses[1]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, profileId, apiKey))
    expect(responses[0].context.id).toEqual(schemaId)
    expect(responses[1].context.id).toEqual(profileId)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)
    expect(responses[1].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(2)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenter, getDataSchemaExpectedBodyForParentSite(apiKey))
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenter, getProfileSchemaExpectedBodyForParentSite(apiKey))
  })
})
