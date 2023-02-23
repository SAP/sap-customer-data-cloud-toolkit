import { areConfigurationsFilled, filterTargetSites, getTargetSiteByTargetApiKey, extractTargetApiKeyFromTargetSiteListItem } from './utils'
import { configurationsMockedResponse } from '../../redux/copyConfigurationExtended/dataTest'
import { mockedAvailableTargetApiKeys, targetSiteListItem } from './dataTest'

describe('copyConfigurationExtended utils test suite', () => {
  test('return false if no checkboxes are filled', () => {
    configurationsMockedResponse[0].value = false
    configurationsMockedResponse[0].branches[0].value = false
    configurationsMockedResponse[0].branches[1].value = false
    expect(areConfigurationsFilled(configurationsMockedResponse)).toEqual(false)
  })
  test('return true if a first level checkbox is filled', () => {
    configurationsMockedResponse[1].value = true
    expect(areConfigurationsFilled(configurationsMockedResponse)).toEqual(true)
  })
  test('return true if a second level checkbox is filled', () => {
    configurationsMockedResponse[0].branches[0].value = true
    expect(areConfigurationsFilled(configurationsMockedResponse)).toEqual(true)
  })
  test('return true if a third level checkbox is filled', () => {
    configurationsMockedResponse[2].branches[0].branches[0].value = true
    expect(areConfigurationsFilled(configurationsMockedResponse)).toEqual(true)
  })

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

  test('should extract target api key from target site list item', () => {
    const targetApiKey = extractTargetApiKeyFromTargetSiteListItem(targetSiteListItem)
    expect(targetApiKey).toEqual(mockedAvailableTargetApiKeys[0].apiKey)
  })
})
