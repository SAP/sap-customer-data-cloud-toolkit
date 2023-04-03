import { filterConfiguration, getConfiguration, returnSourceConfigurations, returnSourceSites } from './utils'
import { sitesConfigurations, siteId, testString } from './dataTest'

describe('siteDeployerCopyConfiguration utils test suite', () => {
  test('should filter configurations', () => {
    expect(filterConfiguration(sitesConfigurations, siteId)).toEqual([])
  })

  test('should filter not configurations', () => {
    expect(filterConfiguration(sitesConfigurations, '')).toEqual(sitesConfigurations)
    expect(filterConfiguration(sitesConfigurations, testString)).toEqual(sitesConfigurations)
  })

  test('should get an existing configuration', () => {
    expect(getConfiguration(sitesConfigurations, siteId)).toEqual(sitesConfigurations[0])
  })

  test('should return undefined when getting a non existing configuration', () => {
    expect(getConfiguration(sitesConfigurations, testString)).toEqual(undefined)
  })

  test('should return a source configurations array', () => {
    expect(returnSourceConfigurations(sitesConfigurations, siteId)).toEqual(sitesConfigurations[0].configurations)
  })

  test('should return an empty array when source configurations do not exist', () => {
    expect(returnSourceConfigurations(sitesConfigurations, testString)).toEqual([])
  })

  test('should return a source sites array', () => {
    expect(returnSourceSites(sitesConfigurations, siteId)).toEqual(sitesConfigurations[0].sourceSites)
  })

  test('should return an empty array when source sites do not exist', () => {
    expect(returnSourceSites(sitesConfigurations, testString)).toEqual([])
  })
})
