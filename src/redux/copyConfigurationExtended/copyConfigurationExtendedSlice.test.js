/**
 * @jest-environment jsdom
 */

import copyConfigurationExtendedReducer, {
  addTargetSite,
  removeTargetSite,
  setConfigurationStatus,
  clearConfigurations,
  clearErrors,
  getConfigurations,
  setConfigurations,
  clearTargetApiKeys,
  getAvailableTargetSites,
  getCurrentSiteInformation,
  getTargetSiteInformation,
  clearApiCardError,
} from './copyConfigurationExtendedSlice'

import {
  initialState,
  initialStateWithConfigurations,
  initialStateWithErrors,
  initialStateWithTargetApiKey,
  dummyTargetApiKey,
  configurationsMockedResponse,
  mockedErrorsResponse,
  setConfigSuccessResponse,
  initialStateWithTargetApiKeyAndConfigurations,
  getUserSitesResponse,
  siteConfigResponse,
  expectedTargetSite,
  duplicatedWarningMessage,
  initialStateWithApiCardError,
  getAvailableTargetApiKeysPayload,
} from './dataTest'

describe('copyConfigurationExtendedSlice test suite', () => {
  test('should return initial state', () => {
    expect(copyConfigurationExtendedReducer(undefined, { type: undefined })).toEqual(initialState)
  })

  test('should add a target site', () => {
    const newState = copyConfigurationExtendedReducer(initialState, addTargetSite(siteConfigResponse))
    expect(newState.targetSites[0]).toEqual(siteConfigResponse)
    expect(newState.apiCardError).toBeUndefined()
  })

  test('should update apiCardError when adding a duplicated target site', () => {
    let newState = copyConfigurationExtendedReducer(initialState, addTargetSite(siteConfigResponse))
    newState = copyConfigurationExtendedReducer(newState, addTargetSite(siteConfigResponse))
    expect(newState.targetSites.length).toEqual(1)
    expect(newState.targetSites[0]).toEqual(siteConfigResponse)
    expect(newState.apiCardError.errorMessage).toEqual(duplicatedWarningMessage)
  })

  test('should remove a target site', () => {
    const newState = copyConfigurationExtendedReducer(initialStateWithTargetApiKey, removeTargetSite(dummyTargetApiKey))
    expect(newState.targetSites.length).toEqual(0)
  })

  test('should set a configuration status to true', () => {
    expect(initialStateWithConfigurations.configurations[1].value).toEqual(false)
    const newState = copyConfigurationExtendedReducer(initialStateWithConfigurations, setConfigurationStatus({ checkBoxId: 'smsTemplatesId', value: true }))
    expect(newState.configurations[1].value).toEqual(true)
  })

  test('should clear configurations, i.e., set all values to false', () => {
    expect(initialStateWithConfigurations.configurations[0].value).toEqual(true)
    expect(initialStateWithConfigurations.configurations[0].branches[0].value).toEqual(true)
    expect(initialStateWithConfigurations.configurations[0].branches[0].value).toEqual(true)
    const newState = copyConfigurationExtendedReducer(initialStateWithConfigurations, clearConfigurations())
    expect(newState.configurations[0].value).toEqual(false)
    expect(newState.configurations[0].branches[0].value).toEqual(false)
    expect(newState.configurations[0].branches[0].value).toEqual(false)
  })

  test('should clear errors', () => {
    expect(initialStateWithErrors.errors.length).toEqual(1)
    expect(initialStateWithErrors.configurations[0].error).toBeDefined()
    expect(initialStateWithErrors.targetSites[0].error).toBeDefined()
    const newState = copyConfigurationExtendedReducer(initialStateWithErrors, clearErrors())
    expect(newState.errors.length).toEqual(0)
    expect(newState.configurations[0].error).toBe(undefined)
    expect(newState.targetSites[0].error).toBe(undefined)
  })

  test('should clear target sites', () => {
    expect(initialStateWithTargetApiKey.targetSites.length).toEqual(1)
    const newState = copyConfigurationExtendedReducer(initialStateWithTargetApiKey, clearTargetApiKeys())
    expect(newState.targetSites.length).toEqual(0)
  })

  test('should clear apiCardError', () => {
    const newState = copyConfigurationExtendedReducer(initialStateWithApiCardError, clearApiCardError())
    expect(newState.apiCardError).toBeUndefined()
  })

  test('should update state when getConfigurations is pending', () => {
    const action = getConfigurations.pending
    const newState = copyConfigurationExtendedReducer(initialState, action)
    expect(newState.isLoading).toEqual(true)
    expect(newState.errors.length).toEqual(0)
    expect(newState.configurations.length).toEqual(0)
  })

  test('should update state when getConfigurations is fulfilled', () => {
    const action = getConfigurations.fulfilled(configurationsMockedResponse)
    const newState = copyConfigurationExtendedReducer(initialState, action)
    expect(newState.configurations).toEqual(configurationsMockedResponse)
    expect(newState.isLoading).toEqual(false)
  })

  test('should update state when getConfigurations is rejected', () => {
    const action = getConfigurations.rejected('', '', '', mockedErrorsResponse)
    const newState = copyConfigurationExtendedReducer(initialState, action)
    expect(newState.errors).toEqual(mockedErrorsResponse)
    expect(newState.isLoading).toEqual(false)
  })

  test('should update state when setConfigurations is pending', () => {
    const action = setConfigurations.pending
    const newState = copyConfigurationExtendedReducer(initialState, action)
    expect(newState.isLoading).toEqual(true)
    expect(newState.errors.length).toEqual(0)
    expect(newState.configurations.length).toEqual(0)
  })

  test('should update state when setConfigurations is fulfilled with success', () => {
    const action = setConfigurations.fulfilled([setConfigSuccessResponse])
    const newState = copyConfigurationExtendedReducer(initialState, action)
    expect(newState.isLoading).toEqual(false)
    expect(newState.showSuccessMessage).toEqual(true)
  })

  test('should update state when setConfigurations is fulfilled with errors', () => {
    const action = setConfigurations.fulfilled(mockedErrorsResponse)
    const newState = copyConfigurationExtendedReducer(initialStateWithTargetApiKeyAndConfigurations, action)
    expect(newState.isLoading).toEqual(false)
    expect(newState.showSuccessMessage).toEqual(false)
    expect(newState.configurations[0].error).toBeDefined()
    expect(newState.targetSites[0].error).toBeDefined()
  })

  test('should update state when setConfigurations is rejected', () => {
    const action = setConfigurations.rejected('', '', '', mockedErrorsResponse)
    const newState = copyConfigurationExtendedReducer(initialState, action)
    expect(newState.errors).toEqual(mockedErrorsResponse)
    expect(newState.isLoading).toEqual(false)
    expect(newState.showSuccessMessage).toEqual(false)
  })

  test('should update state when getAvailableTargetApiKeys is fulfilled', () => {
    const action = getAvailableTargetSites.fulfilled(getAvailableTargetApiKeysPayload)
    const newState = copyConfigurationExtendedReducer(initialState, action)
    expect(newState.isLoading).toEqual(false)
    expect(newState.availableTargetSites).toEqual(getUserSitesResponse)
  })

  test('should update state when getAvailableTargetApiKeys is rejected', () => {
    const action = getAvailableTargetSites.rejected('', '', '', mockedErrorsResponse)
    const newState = copyConfigurationExtendedReducer(initialState, action)
    expect(newState.isLoading).toEqual(false)
    expect(newState.availableTargetSites).toEqual([])
    expect(newState.apiCardError).toEqual(mockedErrorsResponse)
  })

  test('should update state when getCurrentSiteInformation is fulfilled', () => {
    const action = getCurrentSiteInformation.fulfilled(siteConfigResponse)
    const newState = copyConfigurationExtendedReducer(initialState, action)
    expect(newState.currentSiteInformation.baseDomain).toEqual(siteConfigResponse.baseDomain)
    expect(newState.isLoading).toEqual(false)
  })

  test('should update state when getCurrentSiteInformation is rejected', () => {
    const action = getCurrentSiteInformation.rejected('', '', '', mockedErrorsResponse)
    const newState = copyConfigurationExtendedReducer(initialState, action)
    expect(newState.errors).toEqual([mockedErrorsResponse])
    expect(newState.isLoading).toEqual(false)
    expect(newState.showSuccessMessage).toEqual(false)
  })

  test('should update state when getTargetSiteInformation is fulfilled', () => {
    const action = getTargetSiteInformation.fulfilled(siteConfigResponse)
    const newState = copyConfigurationExtendedReducer(initialState, action)
    expect(newState.targetSites[0]).toEqual(expectedTargetSite)
    expect(newState.isLoading).toEqual(false)
    expect(newState.apiCardError).toBeUndefined()
  })

  test('should update state when getTargetSiteInformation is rejected', () => {
    const action = getTargetSiteInformation.rejected('', '', '', mockedErrorsResponse)
    const newState = copyConfigurationExtendedReducer(initialState, action)
    expect(newState.apiCardError).toEqual(mockedErrorsResponse)
    expect(newState.isLoading).toEqual(false)
    expect(newState.showSuccessMessage).toEqual(false)
  })
})
