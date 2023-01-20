import { onElementExists } from '../../inject/utils'

export const getCredentials = () => {
  return new Promise((resolve) => {
    onElementExists('.fd-tabs__item', () => {
      resolve(readCredentialsFromAccountSettings())
    })
  })
}

export const getAccountURL = () => {
  const ACCOUNT_SETTINGS_URL_PATH = '/account-settings'
  const encodedOrigin = encodeURI(document.location.origin)
  const encodedHash = encodeURI(document.location.hash)
  const tempURL = `${decodeURI(encodedOrigin)}/${decodeURI(encodedHash).split('/').slice(0, 3).join('/')}${ACCOUNT_SETTINGS_URL_PATH}`
  return tempURL
}

export const shouldUpdateCredentials = (credentials, isPopUpOpen) => {
  return !areCredentialsFilled(credentials) && !isPopUpOpen && isHTTPSProtocol()
}

export const areCredentialsFilled = (credentials) => {
  return credentials.userKey !== '' && credentials.secretKey !== ''
}

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

const getUserKeyInput = (credentialsInputs) => {
  return credentialsInputs[0].value
}

const getSecretKeyInput = (credentialsInputs) => {
  return credentialsInputs[1].value
}

const isHTTPSProtocol = () => {
  const HTTPS_PROTOCOL = 'https:'
  return document.location.protocol === HTTPS_PROTOCOL
}
