import { findConfiguration, propagateConfigurationState, clearConfigurationsErrors, clearTargetApiKeysErrors, addErrorToConfigurations, addErrorToTargetApiKey } from './utils'
import { configurationsMockedResponse, initialStateWithErrors, mockedErrorsResponse, initialStateWithTargetApiKey } from './dataTest'

describe('copyConfigurationExtended utils test suite', () => {
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

  test('should add a targetApiKey error', () => {
    expect(initialStateWithTargetApiKey.targetApiKeys[0].error).toBe(undefined)
    addErrorToTargetApiKey(initialStateWithTargetApiKey.targetApiKeys, mockedErrorsResponse)
    expect(initialStateWithTargetApiKey.targetApiKeys[0].error).toBeDefined()
  })

  test('should clear configuration error', () => {
    const configurations = initialStateWithErrors.configurations
    expect(configurations[0].error).toBeDefined()
    clearConfigurationsErrors(configurations, mockedErrorsResponse)
    expect(configurations[0].error).toBe(undefined)
  })

  test('should clear targetApiKey error', () => {
    const targetApiKeys = initialStateWithErrors.targetApiKeys
    expect(targetApiKeys[0].error).toBeDefined()
    clearTargetApiKeysErrors(targetApiKeys, mockedErrorsResponse)
    expect(targetApiKeys[0].error).toBe(undefined)
  })
})
