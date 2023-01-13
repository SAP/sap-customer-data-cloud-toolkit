import { errorConditions } from './errorConditions'

const initialState = {
  exportFile: undefined,
  isLoading: false,
  errors: [],
  validationErrors: [],
  isImportPopupOpen: false,
  showSuccessDialog: false,
  isImportFileValid: false,
  importedEmailTemplatesCount: 0,
  totalEmailTemplatesToImportCount: 0,
  errorCondition: errorConditions.empty,
}

const initialStateWithExportFile = {
  exportFile: { test: 'test' },
  isLoading: false,
  errors: [],
  validationErrors: [],
  isImportPopupOpen: false,
  showSuccessDialog: false,
  isImportFileValid: false,
  importedEmailTemplatesCount: 0,
  totalEmailTemplatesToImportCount: 0,
  errorCondition: errorConditions.empty,
}

const initialStateWithErrors = {
  exportFile: undefined,
  isLoading: false,
  errors: [{ test: 'test' }],
  validationErrors: [{ test: 'test' }],
  isImportPopupOpen: false,
  showSuccessDialog: false,
  isImportFileValid: false,
  importedEmailTemplatesCount: 0,
  totalEmailTemplatesToImportCount: 0,
  errorCondition: errorConditions.exportError,
}

const testAPIKey = 'aabbccddeeffgghhiijjkk'

const testHash = `/1234567/${testAPIKey}/user-interfacing/email-templates/`

const payloadWithErrors = { payload: [{ errorCode: 40000 }] }

const payloadWithoutErrors = { payload: [{ errorCode: 0 }] }

export { initialState, initialStateWithExportFile, initialStateWithErrors, testAPIKey, testHash, payloadWithErrors, payloadWithoutErrors }
