const initialState = {
  exportFile: undefined,
  isLoading: false,
  errors: [],
  isImportPopupOpen: false,
}

const initialStateWithExportFile = {
  exportFile: { test: 'test' },
  isLoading: false,
  errors: [],
  isImportPopupOpen: false,
}

const initialStateWithErrors = {
  exportFile: undefined,
  isLoading: false,
  errors: [{ test: 'test' }],
  isImportPopupOpen: false,
}

const testAPIKey = 'aabbccddeeffgghhiijjkk'

const testHash = `/1234567/${testAPIKey}/user-interfacing/email-templates/`

export { initialState, initialStateWithExportFile, initialStateWithErrors, testAPIKey, testHash }
