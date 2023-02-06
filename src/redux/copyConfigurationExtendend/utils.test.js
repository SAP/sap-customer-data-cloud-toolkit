import { findConfiguration, propagateConfigurationState } from './utils'
import { configurationsMockedResponse } from './dataTest'

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
})
