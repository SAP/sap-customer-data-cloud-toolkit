import { serverStructure } from './utils.js'

export const initialState = {
  currentSiteApiKey: '',
  currentSiteInformation: {},
  currentSitePartner: undefined,
  errors: [],
  isLoading: false,
  serverConfigurations: [],
  showSuccessMessage: false,
  showErrorMessage: false,
  serverProvider: '',
}

export const initialStateWithServerConfigurations = {
  currentSiteApiKey: '',
  currentSiteInformation: {},
  currentSitePartner: '',
  errors: [],
  isLoading: false,
  serverConfigurations: serverStructure,
  showSuccessMessage: false,
  showErrorMessage: false,
  serverProvider: 'azure',
}
