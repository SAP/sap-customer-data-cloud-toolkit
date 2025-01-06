/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { filterTargetSites, findStringInAvailableTargetSites, getTargetSiteByTargetApiKey } from './utils'
import { mockedAvailableTargetApiKeys } from './dataTest'

describe('search sites input utils test suite', () => {
  test('should filter availableTargetApiKeys if baseDomain contains a string', () => {
    const filteredTargetApiKeys = filterTargetSites('wxy', mockedAvailableTargetApiKeys)
    expect(filteredTargetApiKeys[0]).toEqual(mockedAvailableTargetApiKeys[4])
  })

  test('should filter availableTargetApiKeys if apiKey contains a string', () => {
    const filteredTargetApiKeys = filterTargetSites('111', mockedAvailableTargetApiKeys)
    expect(filteredTargetApiKeys[0]).toEqual(mockedAvailableTargetApiKeys[0])
  })

  test('should filter availableTargetApiKeys if partnerName contains a string', () => {
    const filteredTargetApiKeys = filterTargetSites('Partner 3', mockedAvailableTargetApiKeys)
    expect(filteredTargetApiKeys[0]).toEqual(mockedAvailableTargetApiKeys[2])
  })

  test('should not filter availableTargetApiKeys if no relevant property contains a string', () => {
    const filteredTargetApiKeys = filterTargetSites('z', mockedAvailableTargetApiKeys)
    expect(filteredTargetApiKeys).toEqual([])
  })

  test('should get the target site with the corresponding target api key', () => {
    const targetSite = getTargetSiteByTargetApiKey('111111', mockedAvailableTargetApiKeys)
    expect(targetSite).toEqual(mockedAvailableTargetApiKeys[0])
  })

  test('should return undefined when getting a target site from an unexisting target api key', () => {
    const targetSite = getTargetSiteByTargetApiKey('999999', mockedAvailableTargetApiKeys)
    expect(targetSite).toBeUndefined()
  })

  test('should return true if a string exists in available target sites list', () => {
    expect(findStringInAvailableTargetSites('123455', mockedAvailableTargetApiKeys)).toEqual(true)
    expect(findStringInAvailableTargetSites('uvwxy', mockedAvailableTargetApiKeys)).toEqual(true)
    expect(findStringInAvailableTargetSites('555', mockedAvailableTargetApiKeys)).toEqual(true)
    expect(findStringInAvailableTargetSites('Partner 5', mockedAvailableTargetApiKeys)).toEqual(true)
  })

  test('should return false if a string do not exists in available target sites list', () => {
    expect(findStringInAvailableTargetSites(',./.,', mockedAvailableTargetApiKeys)).toEqual(false)
  })
})
