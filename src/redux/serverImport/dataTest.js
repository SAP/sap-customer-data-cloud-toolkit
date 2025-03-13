import { serverStructure } from '../../services/importAccounts/serverImport/serverStructure/serverStructure'

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
