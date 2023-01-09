const initialState = {
  exportFile: undefined,
  isLoading: false,
  errors: [],
  validationErrors: [],
  isImportPopupOpen: false,
  showSuccessDialog: false,
  isImportFileValid: false,
}

const initialStateWithExportFile = {
  exportFile: { test: 'test' },
  isLoading: false,
  errors: [],
  validationErrors: [],
  isImportPopupOpen: false,
  showSuccessDialog: false,
  isImportFileValid: false,
}

const initialStateWithErrors = {
  exportFile: undefined,
  isLoading: false,
  errors: [{ test: 'test' }],
  validationErrors: [{ test: 'test' }],
  isImportPopupOpen: false,
  showSuccessDialog: false,
  isImportFileValid: false,
}

const testAPIKey = 'aabbccddeeffgghhiijjkk'

const testHash = `/1234567/${testAPIKey}/user-interfacing/email-templates/`

const payloadWithErrors = { payload: [{ errorCode: 40000 }] }

const payloadWithoutErrors = { payload: [{ errorCode: 0 }] }

export { initialState, initialStateWithExportFile, initialStateWithErrors, testAPIKey, testHash, payloadWithErrors, payloadWithoutErrors }
