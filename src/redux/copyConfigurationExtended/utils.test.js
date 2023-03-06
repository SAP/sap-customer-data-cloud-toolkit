/**
 * @jest-environment jsdom
 */

import {
  findConfiguration,
  propagateConfigurationState,
  clearConfigurationsErrors,
  clearTargetSitesErrors,
  addErrorToConfigurations,
  addErrorToTargetApiKey,
  isTargetSiteDuplicated,
  writeAvailableTargetSitesToLocalStorage,
  getAvailableTargetSitesFromLocalStorage,
  removeCurrentSiteApiKeyFromAvailableTargetSites,
} from './utils'

import { configurationsMockedResponse, initialStateWithErrors, mockedErrorsResponse, initialStateWithTargetApiKey, dummyTargetApiKey, dummySecretKey } from './dataTest'

describe('copyConfigurationSlice utils test suite', () => {
  test('should find a first level configuration', () => {
    const configuration = findConfiguration(configurationsMockedResponse, 'smsTemplatesId')
    expect(configuration.name).toEqual('smsTemplates')
    expect(configuration.value).toEqual(false)
    expect(configuration.branches).toBe(undefined)
  })

  test('should find a second level configuration', () => {
    const configuration = findConfiguration(configurationsMockedResponse, 'dataSchemaId')
    expect(configuration.name).toEqual('dataSchema')
    expect(configuration.value).toEqual(true)
    expect(configuration.branches).toBe(undefined)
  })

  test('should find a third level configuration', () => {
    const configuration = findConfiguration(configurationsMockedResponse, 'customLiteRegistrationId')
    expect(configuration.name).toEqual('customLiteRegistration')
    expect(configuration.value).toEqual(false)
    expect(configuration.branches).toBe(undefined)
  })

  test('should return undefined for a missing configuration id', () => {
    const configuration = findConfiguration(configurationsMockedResponse, 'iDontExistId')
    expect(configuration).toBe(undefined)
  })

  test('should set a first level configuration state', () => {
    const configuration = configurationsMockedResponse[1]
    expect(configuration.value).toEqual(false)
    propagateConfigurationState(configuration, true)
    expect(configuration.value).toEqual(true)
  })

  test('should propagate configuration state to first level configurations', () => {
    const configuration = configurationsMockedResponse[0]
    expect(configuration.value).toEqual(true)
    expect(configuration.branches[0].value).toEqual(true)
    expect(configuration.branches[1].value).toEqual(true)
    propagateConfigurationState(configuration, false)
    expect(configuration.value).toEqual(false)
    expect(configuration.branches[0].value).toEqual(false)
    expect(configuration.branches[1].value).toEqual(false)
  })

  test('should propagate configuration state to second level configurations', () => {
    const configuration = configurationsMockedResponse[2]
    expect(configuration.value).toEqual(false)
    expect(configuration.branches[0].value).toEqual(false)
    expect(configuration.branches[0].branches[0].value).toEqual(false)
    expect(configuration.branches[0].branches[1].value).toEqual(false)
    expect(configuration.branches[1].value).toEqual(false)
    expect(configuration.branches[1].branches[0].value).toEqual(false)
    expect(configuration.branches[1].branches[1].value).toEqual(false)
    propagateConfigurationState(configuration, true)
    expect(configuration.value).toEqual(true)
    expect(configuration.branches[0].value).toEqual(true)
    expect(configuration.branches[0].branches[0].value).toEqual(true)
    expect(configuration.branches[0].branches[1].value).toEqual(true)
    expect(configuration.branches[1].value).toEqual(true)
    expect(configuration.branches[1].branches[0].value).toEqual(true)
    expect(configuration.branches[1].branches[1].value).toEqual(true)
  })

  test('should add a configuration error', () => {
    expect(configurationsMockedResponse[0].error).toBe(undefined)
    addErrorToConfigurations(configurationsMockedResponse, mockedErrorsResponse)
    expect(configurationsMockedResponse[0].error).toBeDefined()
  })

  test('should add a target site error', () => {
    expect(initialStateWithTargetApiKey.targetSites[0].error).toBe(undefined)
    addErrorToTargetApiKey(initialStateWithTargetApiKey.targetSites, mockedErrorsResponse)
    expect(initialStateWithTargetApiKey.targetSites[0].error).toBeDefined()
  })

  test('should clear configuration error', () => {
    const configurations = initialStateWithErrors.configurations
    expect(configurations[0].error).toBeDefined()
    clearConfigurationsErrors(configurations, mockedErrorsResponse)
    expect(configurations[0].error).toBe(undefined)
  })

  test('should clear targetApiKey error', () => {
    const targetApiKeys = initialStateWithErrors.targetSites
    expect(targetApiKeys[0].error).toBeDefined()
    clearTargetSitesErrors(targetApiKeys, mockedErrorsResponse)
    expect(targetApiKeys[0].error).toBe(undefined)
  })

  test('should return true if site with api key is duplicated', () => {
    expect(isTargetSiteDuplicated(dummyTargetApiKey, initialStateWithTargetApiKey.targetSites)).toEqual(true)
  })

  test('should return false if site with api key is not duplicated', () => {
    expect(isTargetSiteDuplicated('1234567890', initialStateWithTargetApiKey.targetSites)).toEqual(false)
  })

  test('should write available target sites to local storage and get them back', () => {
    writeAvailableTargetSitesToLocalStorage(initialStateWithTargetApiKey.targetSites, dummySecretKey)
    expect(getAvailableTargetSitesFromLocalStorage(dummySecretKey)).toEqual(initialStateWithTargetApiKey.targetSites)
  })

  test('should not write available target sites to local storage if they are invalid', () => {
    localStorage.clear()
    writeAvailableTargetSitesToLocalStorage()
    expect(getAvailableTargetSitesFromLocalStorage()).toBeUndefined()
    writeAvailableTargetSitesToLocalStorage([])
    expect(getAvailableTargetSitesFromLocalStorage()).toBeUndefined()
    writeAvailableTargetSitesToLocalStorage({})
    expect(getAvailableTargetSitesFromLocalStorage()).toBeUndefined()
  })

  test('should return undefined when there are no target sites in local storage to get', () => {
    localStorage.clear()
    expect(getAvailableTargetSitesFromLocalStorage(dummySecretKey)).toBeUndefined()
  })

  test('should remove current site api key from available target sites', () => {
    expect(removeCurrentSiteApiKeyFromAvailableTargetSites(initialStateWithTargetApiKey.targetSites, dummyTargetApiKey).length).toEqual(0)
  })
})
