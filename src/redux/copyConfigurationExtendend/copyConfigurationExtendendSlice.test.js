import copyConfigurationExtendendReducer, {
  addTargetApiKey,
  removeTargetApiKey,
  setConfigurationStatus,
  clearConfigurations,
  clearErrors,
  getConfigurations,
  setConfigurations,
  clearTargetApiKeys,
} from './copyConfigurationExtendendSlice'

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
} from './dataTest'

describe('copyConfigurationExtendendSlice test suite', () => {
  test('should return initial state', () => {
    expect(copyConfigurationExtendendReducer(undefined, { type: undefined })).toEqual(initialState)
  })

  test('should add a target api key', () => {
    const newState = copyConfigurationExtendendReducer(initialState, addTargetApiKey(dummyTargetApiKey))
    expect(newState.targetApiKeys[0].targetApiKey).toEqual(dummyTargetApiKey)
  })

  test('should remove a target api key', () => {
    const newState = copyConfigurationExtendendReducer(initialStateWithTargetApiKey, removeTargetApiKey(dummyTargetApiKey))
    expect(newState.targetApiKeys.length).toEqual(0)
  })

  test('should set a configuration status to true', () => {
    expect(initialStateWithConfigurations.configurations[1].value).toEqual(false)
    const newState = copyConfigurationExtendendReducer(initialStateWithConfigurations, setConfigurationStatus({ checkBoxId: 'smsTemplatesId', value: true }))
    expect(newState.configurations[1].value).toEqual(true)
  })

  test('should clear configurations, i.e., set all values to false', () => {
    expect(initialStateWithConfigurations.configurations[0].value).toEqual(true)
    expect(initialStateWithConfigurations.configurations[0].branches[0].value).toEqual(true)
    expect(initialStateWithConfigurations.configurations[0].branches[0].value).toEqual(true)
    const newState = copyConfigurationExtendendReducer(initialStateWithConfigurations, clearConfigurations())
    expect(newState.configurations[0].value).toEqual(false)
    expect(newState.configurations[0].branches[0].value).toEqual(false)
    expect(newState.configurations[0].branches[0].value).toEqual(false)
  })

  test('should clear errors', () => {
    expect(initialStateWithErrors.errors.length).toEqual(1)
    expect(initialStateWithErrors.configurations[0].error).toBeDefined()
    expect(initialStateWithErrors.targetApiKeys[0].error).toBeDefined()
    const newState = copyConfigurationExtendendReducer(initialStateWithErrors, clearErrors())
    expect(newState.errors.length).toEqual(0)
    expect(newState.configurations[0].error).toBe(undefined)
    expect(newState.targetApiKeys[0].error).toBe(undefined)
  })

  test('should clear clearTargetApiKeys', () => {
    expect(initialStateWithTargetApiKey.targetApiKeys.length).toEqual(1)
    const newState = copyConfigurationExtendendReducer(initialStateWithTargetApiKey, clearTargetApiKeys())
    expect(newState.targetApiKeys.length).toEqual(0)
  })

  test('should update state when getConfigurations is pending', () => {
    const action = getConfigurations.pending
    const newState = copyConfigurationExtendendReducer(initialState, action)
    expect(newState.isLoading).toEqual(true)
    expect(newState.errors.length).toEqual(0)
    expect(newState.configurations.length).toEqual(0)
  })

  test('should update state when getConfigurations is fulfilled', () => {
    const action = getConfigurations.fulfilled(configurationsMockedResponse)
    const newState = copyConfigurationExtendendReducer(initialState, action)
    expect(newState.configurations).toEqual(configurationsMockedResponse)
    expect(newState.isLoading).toEqual(false)
  })

  test('should update state when getConfigurations is rejected', () => {
    const action = getConfigurations.rejected('', '', '', mockedErrorsResponse)
    const newState = copyConfigurationExtendendReducer(initialState, action)
    expect(newState.errors).toEqual(mockedErrorsResponse)
    expect(newState.isLoading).toEqual(false)
  })

  test('should update state when setConfigurations is pending', () => {
    const action = setConfigurations.pending
    const newState = copyConfigurationExtendendReducer(initialState, action)
    expect(newState.isLoading).toEqual(true)
    expect(newState.errors.length).toEqual(0)
    expect(newState.configurations.length).toEqual(0)
  })

  test('should update state when setConfigurations is fulfilled with success', () => {
    const action = setConfigurations.fulfilled([setConfigSuccessResponse])
    const newState = copyConfigurationExtendendReducer(initialState, action)
    expect(newState.isLoading).toEqual(false)
    expect(newState.showSuccessMessage).toEqual(true)
  })

  test('should update state when setConfigurations is fulfilled with errors', () => {
    const action = setConfigurations.fulfilled(mockedErrorsResponse)
    const newState = copyConfigurationExtendendReducer(initialStateWithTargetApiKeyAndConfigurations, action)
    expect(newState.isLoading).toEqual(false)
    expect(newState.showSuccessMessage).toEqual(false)
    expect(newState.configurations[0].error).toBeDefined()
    expect(newState.targetApiKeys[0].error).toBeDefined()
  })

  test('should update state when setConfigurations is rejected', () => {
    const action = setConfigurations.rejected('', '', '', mockedErrorsResponse)
    const newState = copyConfigurationExtendendReducer(initialState, action)
    expect(newState.errors).toEqual(mockedErrorsResponse)
    expect(newState.isLoading).toEqual(false)
    expect(newState.showSuccessMessage).toEqual(false)
  })
})
