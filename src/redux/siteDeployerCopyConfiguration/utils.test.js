/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import { filterConfiguration, getConfiguration, returnSourceConfigurations, returnSourceSites, addSourceSiteInternal } from './utils'
import { sitesConfigurations, siteId, testString, testSourceSite } from './dataTest'

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

  test('should create a new Site Configuration and add a source site', () => {
    const emptySitesConfigurations = []
    addSourceSiteInternal(emptySitesConfigurations, siteId, testSourceSite)
    expect(emptySitesConfigurations.length).toEqual(1)
    const newSiteConfiguration = emptySitesConfigurations[0]
    expect(newSiteConfiguration.siteId).toEqual(siteId)
    expect(newSiteConfiguration.sourceSites.length).toEqual(1)
    expect(newSiteConfiguration.sourceSites[0]).toEqual(testSourceSite)
  })

  test('should update the source site in an existing Site Configuration', () => {
    addSourceSiteInternal(sitesConfigurations, siteId, testSourceSite)
    const newSiteConfiguration = sitesConfigurations[0]
    expect(newSiteConfiguration.siteId).toEqual(siteId)
    expect(newSiteConfiguration.sourceSites.length).toEqual(1)
    expect(newSiteConfiguration.sourceSites[0]).toEqual(testSourceSite)
  })
})
