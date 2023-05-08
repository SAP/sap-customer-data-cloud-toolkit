import siteDeployerCopyConfigurationSliceReducer, {
  clearSourceConfigurations,
  addSourceSite,
  setConfigurationStatus,
  removeSourceSite,
  removeSiteConfigurations,
  setSourceConfigurations,
  setSourceSites,
  getSourceSiteConfigurations,
  getSourceSiteInformation,
  setSiteId,
  setEdit,
  setIsCopyConfigurationDialogOpen,
  clearErrors,
  setDataflowVariableValue,
  setDataflowVariableValues,
  setErrors,
} from './siteDeployerCopyConfigurationSlice'

import { initialState, stateWithConfigurations, siteId, testSourceSite, testConfiguration, siteInformation, stateWithErrors, dummyError } from './dataTest'

describe('siteDeployerCopyConfigurationSlice test suite', () => {
  test('should return initial state', () => {
    expect(siteDeployerCopyConfigurationSliceReducer(undefined, { type: undefined })).toEqual(initialState)
  })

  test('sould clear configurations', () => {
    const newState = siteDeployerCopyConfigurationSliceReducer(stateWithConfigurations, clearSourceConfigurations(siteId))
    expect(newState.sitesConfigurations[0].configurations).toEqual([])
  })

  test('should add a Source Site to a new site configuration', () => {
    const newState = siteDeployerCopyConfigurationSliceReducer(
      initialState,
      addSourceSite({
        siteId: siteId,
        targetSite: testSourceSite,
      })
    )
    expect(newState.sitesConfigurations[0].siteId).toEqual(siteId)
    expect(newState.sitesConfigurations[0].configurations.length).toEqual(0)
    expect(newState.sitesConfigurations[0].sourceSites.length).toEqual(1)
    expect(newState.sitesConfigurations[0].sourceSites[0]).toEqual(testSourceSite)
    expect(newState.sourceSiteAdded).toEqual(true)
  })

  test('should replace the Source Site in an existing site configuration', () => {
    expect(stateWithConfigurations.sitesConfigurations[0].sourceSites.length).toEqual(1)
    expect(stateWithConfigurations.sitesConfigurations[0].sourceSites[0]).not.toEqual(testSourceSite)
    const newState = siteDeployerCopyConfigurationSliceReducer(
      stateWithConfigurations,
      addSourceSite({
        siteId: siteId,
        targetSite: testSourceSite,
      })
    )
    expect(newState.sitesConfigurations[0].siteId).toEqual(siteId)
    expect(newState.sitesConfigurations[0].sourceSites.length).toEqual(1)
    expect(newState.sitesConfigurations[0].sourceSites[0]).toEqual(testSourceSite)
  })

  test('should set configurations status', () => {
    expect(stateWithConfigurations.sitesConfigurations[0].configurations[0].value).toEqual(true)
    const newState = siteDeployerCopyConfigurationSliceReducer(
      stateWithConfigurations,
      setConfigurationStatus({
        siteId: siteId,
        checkBoxId: 'schema',
        value: false,
      })
    )
    expect(newState.sitesConfigurations[0].configurations[0].value).toEqual(false)
  })

  test('should remove a source site', () => {
    expect(stateWithConfigurations.sitesConfigurations[0].sourceSites.length).toEqual(1)
    const newState = siteDeployerCopyConfigurationSliceReducer(stateWithConfigurations, removeSourceSite(siteId))
    expect(newState.sitesConfigurations[0].sourceSites).toEqual([])
  })

  test('should remove site configurations', () => {
    const newState = siteDeployerCopyConfigurationSliceReducer(stateWithConfigurations, removeSiteConfigurations(siteId))
    expect(newState.sitesConfigurations).toEqual([])
  })

  test('should set source configurations', () => {
    const newState = siteDeployerCopyConfigurationSliceReducer(
      stateWithConfigurations,
      setSourceConfigurations({
        siteId: siteId,
        configurations: [testConfiguration],
      })
    )
    expect(newState.sitesConfigurations[0].configurations.length).toEqual(1)
    expect(newState.sitesConfigurations[0].configurations[0]).toEqual(testConfiguration)
  })

  test('should set source sites', () => {
    const newState = siteDeployerCopyConfigurationSliceReducer(
      stateWithConfigurations,
      setSourceSites({
        siteId: siteId,
        sourceSites: [testSourceSite],
      })
    )
    expect(newState.sitesConfigurations[0].sourceSites.length).toEqual(1)
    expect(newState.sitesConfigurations[0].sourceSites[0]).toEqual(testSourceSite)
  })

  test('should update state when getSourceSiteConfigurations is pending', () => {
    const action = getSourceSiteConfigurations.pending
    const newState = siteDeployerCopyConfigurationSliceReducer(initialState, action)
    expect(newState.isLoading).toEqual(true)
    expect(newState.sourceSiteAdded).toEqual(false)
  })

  test('should update state when getSourceSiteConfigurations is fulfilled', () => {
    const action = getSourceSiteConfigurations.fulfilled({
      siteId: siteId,
      configurations: [testConfiguration],
    })
    const newState = siteDeployerCopyConfigurationSliceReducer(stateWithConfigurations, action)
    expect(newState.isLoading).toEqual(false)
    expect(newState.sitesConfigurations[0].configurations[0]).toEqual(testConfiguration)
    expect(newState.errors).toEqual([])
    expect(newState.apiCardError).toBe(undefined)
    expect(newState.sourceSiteAdded).toEqual(false)
  })

  test('should update state when getSourceSiteConfigurations is rejected', () => {
    const action = getSourceSiteConfigurations.rejected('', '', '', { siteId: siteId, error: dummyError })
    const newState = siteDeployerCopyConfigurationSliceReducer(stateWithConfigurations, action)
    expect(newState.isLoading).toEqual(false)
    expect(newState.sourceSiteAdded).toEqual(false)
  })

  test('should update state when getSourceSiteInformation is pending', () => {
    const action = getSourceSiteInformation.pending
    const newState = siteDeployerCopyConfigurationSliceReducer(initialState, action)
    expect(newState.isSourceInfoLoading).toEqual(true)
  })

  test('should update state when getSourceSiteInformation is fulfilled', () => {
    const action = getSourceSiteInformation.fulfilled({
      siteId: siteId,
      siteInformation: siteInformation,
    })
    const newState = siteDeployerCopyConfigurationSliceReducer(initialState, action)
    expect(newState.isSourceInfoLoading).toEqual(false)
    expect(newState.sitesConfigurations[0].sourceSites[0]).toEqual(testSourceSite)
    expect(newState.sourceSiteAdded).toEqual(true)
  })

  test('should update state when getSourceSiteInformation is rejected', () => {
    const action = getSourceSiteInformation.rejected
    const newState = siteDeployerCopyConfigurationSliceReducer(initialState, action)
    expect(newState.isSourceInfoLoading).toEqual(false)
  })

  test('should clear errors', () => {
    const newState = siteDeployerCopyConfigurationSliceReducer(stateWithErrors, clearErrors())
    expect(newState.errors.length).toEqual(0)
  })

  test('should set edit', () => {
    const newState = siteDeployerCopyConfigurationSliceReducer(initialState, setEdit(true))
    expect(newState.edit).toEqual(true)
  })

  test('should set siteId', () => {
    const newState = siteDeployerCopyConfigurationSliceReducer(initialState, setSiteId(siteId))
    expect(newState.siteId).toEqual(siteId)
  })

  test('should set isCopyConfigurationDialogOpen', () => {
    const newState = siteDeployerCopyConfigurationSliceReducer(initialState, setIsCopyConfigurationDialogOpen(true))
    expect(newState.isCopyConfigurationDialogOpen).toEqual(true)
  })

  test('should set a dataflow variable value', () => {
    const newDataflowVariableValue = 'newDataflowVariableValue'
    const newState = siteDeployerCopyConfigurationSliceReducer(
      stateWithConfigurations,
      setDataflowVariableValue({ checkBoxId: 'dataflow1', variable: 'var1', value: newDataflowVariableValue })
    )
    expect(newState.sitesConfigurations[0].configurations[1].branches[0].variables[0].value).toEqual(newDataflowVariableValue)
  })

  test('should set dataflow variables', () => {
    const newDataflowVariables = [{ variable: 'new variable', value: 'test' }]
    const newState = siteDeployerCopyConfigurationSliceReducer(
      stateWithConfigurations,
      setDataflowVariableValues({
        checkBoxId: 'dataflow2',
        variables: newDataflowVariables,
      })
    )
    expect(newState.sitesConfigurations[0].configurations[1].branches[1].variables).toEqual(newDataflowVariables)
  })

  test('should set state errors', () => {
    const newState = siteDeployerCopyConfigurationSliceReducer(initialState, setErrors([dummyError]))
    expect(newState.errors[0]).toEqual(dummyError)
  })
})
