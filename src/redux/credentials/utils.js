/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { MAIN_LOADING_CLASS, MAIN_LOADING_SHOW_CLASS } from '../../inject/constants'
import { onElementExists } from '../../inject/utils'

export const showCredentialsLoading = () => document.querySelector(`.${MAIN_LOADING_CLASS}`).classList.add(MAIN_LOADING_SHOW_CLASS)
export const hideCredentialsLoading = () => document.querySelector(`.${MAIN_LOADING_CLASS}`).classList.remove(MAIN_LOADING_SHOW_CLASS)

export const getCredentials = () => {
  showCredentialsLoading()

  return new Promise((resolve) => {
    onElementExists('.fd-tabs__item', () => {
      resolve(readCredentialsFromAccountSettings())
      setTimeout(hideCredentialsLoading, 500)
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

export const shouldUpdateCredentials = (credentials) => {
  return !areCredentialsFilled(credentials) && isHTTPSProtocol()
}

export const areCredentialsFilled = (credentials) => {
  return credentials.userKey !== '' && credentials.secretKey !== ''
}

export const readCredentialsFromAccountSettings = () => {
  try {
    navigateToAPICredentialsTab()
    const credentialsInputs = getCredentialsInputs()
    return { userKey: getUserKeyInput(credentialsInputs), secretKey: getSecretKeyInput(credentialsInputs), gigyaConsole: window.location.hostname }
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
