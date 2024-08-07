/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Schema from './schema.js'
import * as CommonTestData from '../../servicesDataTest.js'
import {
  expectedSchemaResponse,
  getDataSchemaExpectedBodyForParentSite,
  getDataSchemaExpectedBodyForChildSiteStep1,
  getDataSchemaExpectedBodyForChildSiteStep2,
  getProfileSchemaExpectedBodyForChildSiteStep1,
  getProfileSchemaExpectedBodyForChildSiteStep2,
  getProfileSchemaExpectedBodyForParentSite,
  getSubscriptionsSchemaExpectedBodyForParentSite,
  getSubscriptionsSchemaExpectedBodyForChildSiteStep1,
  getSubscriptionsSchemaExpectedBodyForChildSiteStep2,
  expectedSourceChildCopyIssueSchemaResponse,
  expectedDestinationChildCopyIssueSchemaResponse,
  getInternalSchemaExpectedBodyForParentSite,
  getInternalSchemaExpectedBodyForChildSiteStep1,
  getInternalSchemaExpectedBodyForChildSiteStep2,
  getAddressesSchemaExpectedBodyForParentSite,
  getAddressesSchemaExpectedBodyForChildSiteStep1,
  getAddressesSchemaExpectedBodyForChildSiteStep2,
} from './dataTest.js'
import axios from 'axios'
import { expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk } from '../../servicesDataTest.js'
import { getSiteConfigSuccessfullyMultipleMember } from '../../configurator/dataTest.js'
import { getExpectedResponseWithContext, getResponseWithContext, internalSchemaId, profileId, schemaId, subscriptionsId, addressesSchemaId } from '../dataTest.js'
import Options from '../options.js'
import {
  ERROR_CODE_CANNOT_CHANGE_SCHEMA_FIELD_TYPE,
  ERROR_CODE_CANNOT_COPY_CHILD_THAT_HAVE_PARENT_ON_DESTINATION,
  ERROR_CODE_CANNOT_COPY_NEW_FIELD_OF_PROFILE_SCHEMA,
} from '../../errors/generateErrorResponse.js'
import { removePropertyFromObjectCascading } from '../objectHelper.js'

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
      { id: internalSchemaId, name: internalSchemaId, value: true },
      { id: addressesSchemaId, name: addressesSchemaId, value: true },
    ],
  })
  const dataIdIdx = 0
  const profileIdIdx = 1
  const subscriptionsIdIdx = 2
  const internalIdIdx = 3
  const addressesIdIdx = 4

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
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, internalSchemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, addressesSchemaId, apiKey) })
    const responses = await schema.copy(apiKey, dataCenterConfiguration, schemaOptions)
    expect(responses.length).toBe(5)
    expect(responses[dataIdIdx]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey))
    expect(responses[profileIdIdx]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, profileId, apiKey))
    expect(responses[subscriptionsIdIdx]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, subscriptionsId, apiKey))
    expect(responses[internalIdIdx]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, internalSchemaId, apiKey))
    expect(responses[addressesIdIdx]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, addressesSchemaId, apiKey))
    expect(responses[dataIdIdx].context.id).toEqual(schemaId)
    expect(responses[profileIdIdx].context.id).toEqual(profileId)
    expect(responses[subscriptionsIdIdx].context.id).toEqual(subscriptionsId)
    expect(responses[internalIdIdx].context.id).toEqual(internalSchemaId)
    expect(responses[addressesIdIdx].context.id).toEqual(addressesSchemaId)
    expect(responses[profileIdIdx].context.targetApiKey).toEqual(apiKey)
    expect(responses[dataIdIdx].context.targetApiKey).toEqual(apiKey)
    expect(responses[subscriptionsIdIdx].context.targetApiKey).toEqual(apiKey)
    expect(responses[internalIdIdx].context.targetApiKey).toEqual(apiKey)
    expect(responses[addressesIdIdx].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(5)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenter, getDataSchemaExpectedBodyForParentSite(apiKey))
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenter, getProfileSchemaExpectedBodyForParentSite(apiKey))
    expect(spy).toHaveBeenNthCalledWith(3, apiKey, dataCenter, getSubscriptionsSchemaExpectedBodyForParentSite(apiKey))
    expect(spy).toHaveBeenNthCalledWith(4, apiKey, dataCenter, getInternalSchemaExpectedBodyForParentSite(apiKey))
    expect(spy).toHaveBeenNthCalledWith(5, apiKey, dataCenter, getAddressesSchemaExpectedBodyForParentSite(apiKey))
  })

  test('copy successfully to child site', async () => {
    const dataCenterConfiguration = getSiteConfigSuccessfullyMultipleMember(0)
    let spy = jest.spyOn(schema, 'set')
    axios
      .mockResolvedValueOnce({ data: JSON.parse(JSON.stringify(expectedSchemaResponse)) })
      .mockResolvedValueOnce({ data: JSON.parse(JSON.stringify(expectedSchemaResponse)) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, profileId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, profileId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, subscriptionsId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, subscriptionsId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, internalSchemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, internalSchemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, addressesSchemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, addressesSchemaId, apiKey) })

    const responses = await schema.copy(apiKey, dataCenterConfiguration, schemaOptions)
    expect(responses.length).toBe(5)
    expect(responses[dataIdIdx]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey))
    expect(responses[profileIdIdx]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, profileId, apiKey))
    expect(responses[subscriptionsIdIdx]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, subscriptionsId, apiKey))
    expect(responses[internalIdIdx]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, internalSchemaId, apiKey))
    expect(responses[addressesIdIdx]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, addressesSchemaId, apiKey))
    expect(responses[dataIdIdx].context.id).toEqual(schemaId)
    expect(responses[profileIdIdx].context.id).toEqual(profileId)
    expect(responses[subscriptionsIdIdx].context.id).toEqual(subscriptionsId)
    expect(responses[internalIdIdx].context.id).toEqual(internalSchemaId)
    expect(responses[addressesIdIdx].context.id).toEqual(addressesSchemaId)
    expect(responses[profileIdIdx].context.targetApiKey).toEqual(apiKey)
    expect(responses[dataIdIdx].context.targetApiKey).toEqual(apiKey)
    expect(responses[subscriptionsIdIdx].context.targetApiKey).toEqual(apiKey)
    expect(responses[internalIdIdx].context.targetApiKey).toEqual(apiKey)
    expect(responses[addressesIdIdx].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(10)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenter, getDataSchemaExpectedBodyForChildSiteStep1(apiKey))
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenter, getDataSchemaExpectedBodyForChildSiteStep2(apiKey))
    expect(spy).toHaveBeenNthCalledWith(5, apiKey, dataCenter, getSubscriptionsSchemaExpectedBodyForChildSiteStep1(apiKey))
    expect(spy).toHaveBeenNthCalledWith(3, apiKey, dataCenter, getProfileSchemaExpectedBodyForChildSiteStep1(apiKey))
    expect(spy).toHaveBeenNthCalledWith(4, apiKey, dataCenter, getProfileSchemaExpectedBodyForChildSiteStep2(apiKey))
    expect(spy).toHaveBeenNthCalledWith(6, apiKey, dataCenter, getSubscriptionsSchemaExpectedBodyForChildSiteStep2(apiKey))
    expect(spy).toHaveBeenNthCalledWith(7, apiKey, dataCenter, getInternalSchemaExpectedBodyForChildSiteStep1(apiKey))
    expect(spy).toHaveBeenNthCalledWith(8, apiKey, dataCenter, getInternalSchemaExpectedBodyForChildSiteStep2(apiKey))
    expect(spy).toHaveBeenNthCalledWith(9, apiKey, dataCenter, getAddressesSchemaExpectedBodyForChildSiteStep1(apiKey))
    expect(spy).toHaveBeenNthCalledWith(10, apiKey, dataCenter, getAddressesSchemaExpectedBodyForChildSiteStep2(apiKey))
  })

  test('copy successfully to a site with the same field with different type', async () => {
    let spy = jest.spyOn(schema, 'set')
    const schemaResponseWithDifferentType = JSON.parse(JSON.stringify(expectedSchemaResponse))
    schemaResponseWithDifferentType.dataSchema.fields.terms.type = 'long'
    schemaResponseWithDifferentType.dataSchema.fields.subscribe.type = undefined
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: schemaResponseWithDifferentType })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, profileId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, subscriptionsId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, internalSchemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, addressesSchemaId, apiKey) })
    const responses = await schema.copy(apiKey, dataCenterConfiguration, schemaOptions)
    expect(responses.length).toBe(6)
    expect(responses[3]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey))
    expect(responses[dataIdIdx].errorCode).toEqual(ERROR_CODE_CANNOT_CHANGE_SCHEMA_FIELD_TYPE)
    expect(responses[profileIdIdx]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, profileId, apiKey))
    expect(responses[subscriptionsIdIdx]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, subscriptionsId, apiKey))
    expect(responses[internalIdIdx + 1]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, internalSchemaId, apiKey))
    expect(responses[addressesIdIdx + 1]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, addressesSchemaId, apiKey))
    expect(responses[3].context.id).toEqual(schemaId)
    expect(responses[dataIdIdx].context.id).toEqual(schemaId)
    expect(responses[profileIdIdx].context.id).toEqual(profileId)
    expect(responses[subscriptionsIdIdx].context.id).toEqual(subscriptionsId)
    expect(responses[internalIdIdx + 1].context.id).toEqual(internalSchemaId)
    expect(responses[addressesIdIdx + 1].context.id).toEqual(addressesSchemaId)
    expect(responses[dataIdIdx].context.targetApiKey).toEqual(apiKey)
    expect(responses[profileIdIdx].context.targetApiKey).toEqual(apiKey)
    expect(responses[subscriptionsIdIdx].context.targetApiKey).toEqual(apiKey)
    expect(responses[3].context.targetApiKey).toEqual(apiKey)
    expect(responses[internalIdIdx + 1].context.targetApiKey).toEqual(apiKey)
    expect(responses[addressesIdIdx + 1].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(5)
    const expectedSchemaBodyWithDifferentType = getDataSchemaExpectedBodyForParentSite(apiKey)
    expectedSchemaBodyWithDifferentType.dataSchema.fields.terms.type = schemaResponseWithDifferentType.dataSchema.fields.terms.type
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenter, getProfileSchemaExpectedBodyForParentSite(apiKey))
    expect(spy).toHaveBeenNthCalledWith(3, apiKey, dataCenter, getSubscriptionsSchemaExpectedBodyForParentSite(apiKey))
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenter, expectedSchemaBodyWithDifferentType)
    expect(spy).toHaveBeenNthCalledWith(4, apiKey, dataCenter, getInternalSchemaExpectedBodyForParentSite(apiKey))
    expect(spy).toHaveBeenNthCalledWith(5, apiKey, dataCenter, getAddressesSchemaExpectedBodyForParentSite(apiKey))
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
    expect(responses[2]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey))
    expect(responses[1].errorCode).toEqual(ERROR_CODE_CANNOT_COPY_CHILD_THAT_HAVE_PARENT_ON_DESTINATION)
    expect(responses[0].errorCode).toEqual(ERROR_CODE_CANNOT_COPY_CHILD_THAT_HAVE_PARENT_ON_DESTINATION)
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
    expect(responses[2]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, profileId, apiKey))
    expect(responses[1].errorCode).toEqual(ERROR_CODE_CANNOT_COPY_NEW_FIELD_OF_PROFILE_SCHEMA)
    expect(responses[0].errorCode).toEqual(ERROR_CODE_CANNOT_COPY_NEW_FIELD_OF_PROFILE_SCHEMA)
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
    const mockedInternalSchemaResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, internalSchemaId, apiKey)
    const mockedAddressesSchemaResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, addressesSchemaId, apiKey)
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: mockedDataResponse })
      .mockResolvedValueOnce({ data: mockedProfileResponse })
      .mockResolvedValueOnce({ data: mockedSubscriptionsResponse })
      .mockResolvedValueOnce({ data: mockedInternalSchemaResponse })
      .mockResolvedValueOnce({ data: mockedAddressesSchemaResponse })
    const responses = await schema.copy(apiKey, dataCenterConfiguration, schemaOptions)
    expect(responses.length).toBe(5)
    expect(responses[dataIdIdx]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, schemaId, apiKey))
    expect(responses[dataIdIdx].context.id).toEqual(schemaId)
    expect(responses[dataIdIdx].context.targetApiKey).toEqual(apiKey)
    expect(responses[profileIdIdx]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, profileId, apiKey))
    expect(responses[profileIdIdx].context.id).toEqual(profileId)
    expect(responses[profileIdIdx].context.targetApiKey).toEqual(apiKey)
    expect(responses[subscriptionsIdIdx]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, subscriptionsId, apiKey))
    expect(responses[subscriptionsIdIdx].context.id).toEqual(subscriptionsId)
    expect(responses[subscriptionsIdIdx].context.targetApiKey).toEqual(apiKey)
    expect(responses[internalIdIdx]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, internalSchemaId, apiKey))
    expect(responses[internalIdIdx].context.id).toEqual(internalSchemaId)
    expect(responses[internalIdIdx].context.targetApiKey).toEqual(apiKey)
    expect(responses[addressesIdIdx]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, addressesSchemaId, apiKey))
    expect(responses[addressesIdIdx].context.id).toEqual(addressesSchemaId)
    expect(responses[addressesIdIdx].context.targetApiKey).toEqual(apiKey)
  })

  test('copy all schema except subscriptions to parent site', async () => {
    let spy = jest.spyOn(schema, 'set')

    const schemaOptions = new Options({
      branches: [
        { id: schemaId, name: schemaId, value: true },
        { id: profileId, name: profileId, value: true },
      ],
    })
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, profileId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey) })
    const responses = await schema.copy(apiKey, dataCenterConfiguration, schemaOptions)
    expect(responses.length).toBe(2)
    expect(responses[1]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey))
    expect(responses[0]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, profileId, apiKey))
    expect(responses[1].context.id).toEqual(schemaId)
    expect(responses[0].context.id).toEqual(profileId)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)
    expect(responses[1].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(2)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenter, getDataSchemaExpectedBodyForParentSite(apiKey))
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenter, getProfileSchemaExpectedBodyForParentSite(apiKey))
  })

  test('break schema payload into several smaller if needed', async () => {
    const dataSchemaPayload = JSON.parse(JSON.stringify(expectedSchemaResponse))
    removePropertyFromObjectCascading(dataSchemaPayload, Schema.PROFILE_SCHEMA)
    removePropertyFromObjectCascading(dataSchemaPayload, Schema.SUBSCRIPTIONS_SCHEMA)
    removePropertyFromObjectCascading(dataSchemaPayload, Schema.INTERNAL_SCHEMA)
    removePropertyFromObjectCascading(dataSchemaPayload, Schema.ADDRESSES_SCHEMA)
    removePropertyFromObjectCascading(dataSchemaPayload, 'preferencesSchema')
    dataSchemaPayload.dataSchema.fields['email'] = {
      required: false,
      type: 'boolean',
      allowNull: true,
      writeAccess: 'clientModify',
    }
    const payloads = schema.breakSchemaPayloadIntoSeveralSmallerIfNeeded(dataSchemaPayload, 'dataSchema', 300)
    expect(payloads.length).toBe(3)
    expect(Object.keys(payloads[0].dataSchema.fields).length).toEqual(1)
    expect(payloads[0].dataSchema.fields.email).toBeDefined()
    expect(Object.keys(payloads[1].dataSchema.fields).length).toEqual(1)
    expect(payloads[1].dataSchema.fields.subscribe).toBeDefined()
    expect(Object.keys(payloads[2].dataSchema.fields).length).toEqual(1)
    expect(payloads[2].dataSchema.fields.terms).toBeDefined()
  })
})
