import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { onElementExists } from '../../inject/utils'

export const readCredentialsFromAccountSettings = () => {
  try {
    navigateToAPICredentialsTab()
    const credetialsInputs = getCredentialsInputs()
    return { userKey: getUserKeyInput(credetialsInputs), secretKey: getSecretKeyInput(credetialsInputs) }
  } catch (error) {
    return error
  } finally {
    if (isHTTPSProtocol()) {
      window.history.back()
    }
  }
}

const navigateToAPICredentialsTab = () => {
  document
    .getElementsByTagName('main-app')[0]
    .shadowRoot.querySelector('app-root')
    .querySelector('fd-busy-indicator')
    .querySelectorAll('account-settings-web-app')[0]
    .shadowRoot.querySelector('account-settings-container')
    .getElementsByClassName('fd-tabs fd-tabs--m')[0]
    .getElementsByClassName('fd-tabs__item')[1]
    .querySelector('a')
    .click()
}

const getUserKeyInput = (credentialsInputs) => {
  return credentialsInputs[0].value
}

const getSecretKeyInput = (credentialsInputs) => {
  return credentialsInputs[1].value
}

const getCredentialsInputs = () => {
  return document
    .getElementsByTagName('main-app')[0]
    .shadowRoot.querySelector('app-root')
    .querySelector('fd-busy-indicator')
    .querySelectorAll('account-settings-web-app')[0]
    .shadowRoot.querySelector('account-settings-container')
    .getElementsByClassName('fd-tabs-custom')[0]
    .getElementsByClassName('fd-tabs__content')[0]
    .getElementsByClassName('account-settings')[0]
    .querySelector('account-information')
    .querySelector('form')
    .querySelectorAll('input')
}

export const getAccountURL = () => {
  const encodedOrigin = encodeURI(document.location.origin)
  const encodedHash = encodeURI(document.location.hash)
  const tempURL = `${decodeURI(encodedOrigin)}/${decodeURI(encodedHash).split('/').slice(0, 3).join('/')}/account-settings`
  return tempURL
}

export const credentialsSlice = createSlice({
  name: 'credentials',
  initialState: {
    credentials: {
      userKey: '',
      secretKey: '',
    },
    isPopUpOpen: false,
  },
  reducers: {
    setUserKey: (state, action) => {
      state.credentials.userKey = action.payload
    },
    setSecretKey: (state, action) => {
      state.credentials.secretKey = action.payload
    },
    setIsPopUpOpen: (state, action) => {
      state.isPopUpOpen = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateCredentialsAsync.fulfilled, (state, action) => {
      if (action.payload) {
        state.credentials = action.payload
      }
    })
  },
})

export const updateCredentialsAsync = createAsyncThunk('credentials', async (dummy, { getState }) => {
  const credentialsState = getState().credentials
  if (!areCredentialsFilled(credentialsState.credentials) && !credentialsState.isPopUpOpen && isHTTPSProtocol()) {
    window.location.href = getAccountURL()
    try {
      return await getCredentials()
    } catch (error) {
      window.history.back()
    }
  }
})

const getCredentials = () => {
  return new Promise((resolve) => {
    onElementExists('.fd-tabs__item', () => {
      resolve(readCredentialsFromAccountSettings())
    })
  })
}

export const areCredentialsFilled = (credentials) => {
  return credentials.userKey !== '' && credentials.secretKey !== ''
}

const isHTTPSProtocol = () => {
  const HTTPS_PROTOCOL = 'https:'
  return document.location.protocol === HTTPS_PROTOCOL
}

export const { setUserKey, setSecretKey, setIsPopUpOpen, updateCredentials } = credentialsSlice.actions

export const selectCredentials = (state) => state.credentials.credentials

export default credentialsSlice.reducer
