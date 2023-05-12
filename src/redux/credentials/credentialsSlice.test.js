/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

/**
 * @jest-environment jsdom
 */

import credentialsReducer, { setUserKey, setSecretKey, setIsPopUpOpen, updateCredentialsAsync } from './credentialsSlice'
import { getAccountURL, readCredentialsFromAccountSettings, areCredentialsFilled, shouldUpdateCredentials } from './utils'

const initialState = {
  credentials: {
    secretKey: '',
    userKey: '',
  },
  isPopUpOpen: false,
}

const testUserKey = 'dummyUserKey'
const testSecretKey = 'dummySecretKey'

const expectedCredentials = {
  secretKey: testSecretKey,
  userKey: testUserKey,
}

const emptyCredentials = {
  secretKey: '',
  userKey: '',
}

describe('Credentials Slice test suite', () => {
  beforeAll(() => {
    createDocument()
  })

  test('should return initial state', () => {
    expect(credentialsReducer(undefined, { type: undefined })).toEqual(initialState)
  })

  test('should update credentials user key', () => {
    const newState = credentialsReducer(initialState, setUserKey(testUserKey))
    expect(newState.credentials.userKey).toEqual(testUserKey)
  })

  test('should update credentials secret key', () => {
    const newState = credentialsReducer(initialState, setSecretKey(testSecretKey))
    expect(newState.credentials.secretKey).toEqual(testSecretKey)
  })

  test('should update isPopUpOpen', () => {
    const newState = credentialsReducer(initialState, setIsPopUpOpen(true))
    expect(newState.isPopUpOpen).toEqual(true)
  })

  test('should get account URL', () => {
    expect(getAccountURL()).toContain('account-settings')
  })

  test('should get credentials', () => {
    expect(readCredentialsFromAccountSettings()).toEqual(expectedCredentials)
  })

  test('should return true if credentials are filled', () => {
    expect(areCredentialsFilled(expectedCredentials)).toEqual(true)
  })

  test('should return false if credentials are empty', () => {
    expect(areCredentialsFilled(emptyCredentials)).toEqual(false)
  })

  test('shouldUpdateCredentials should return false', () => {
    expect(shouldUpdateCredentials(emptyCredentials, false)).toEqual(false)
  })

  test('should update credentials when updateCredentialsAsync is fulfilled', () => {
    const action = updateCredentialsAsync.fulfilled(expectedCredentials)
    const newState = credentialsReducer(initialState, action)
    expect(newState.credentials).toEqual(expectedCredentials)
  })
})

const createDocument = () => {
  const mainApp = document.createElement('main-app')

  const appRoot = document.createElement('app-root')

  const fdBusyIndicator = document.createElement('fd-busy-indicator')

  const accountSettingsWebApp = document.createElement('account-settings-web-app')

  const accountSettingsContainer = document.createElement('account-settings-container')

  const fdTabs = document.createElement('div')
  fdTabs.classList.add('fd-tabs', 'fd-tabs--m')

  const fdTabsItemDummy = document.createElement('div')
  fdTabsItemDummy.classList.add('fd-tabs__item')

  const fdTabsItem = document.createElement('div')
  fdTabsItem.classList.add('fd-tabs__item')

  const anchor = document.createElement('a')

  const inputUserKey = document.createElement('input')
  inputUserKey.setAttribute('value', testUserKey)

  const inputSecretKey = document.createElement('input')
  inputSecretKey.setAttribute('value', testSecretKey)

  const form = document.createElement('form')

  const accountInformation = document.createElement('account-information')

  const accountSettings = document.createElement('div')
  accountSettings.classList.add('account-settings')

  const fdTabsContent = document.createElement('div')
  fdTabsContent.classList.add('fd-tabs__content')

  const fdTabsCustom = document.createElement('div')
  fdTabsCustom.classList.add('fd-tabs-custom')

  form.appendChild(inputUserKey)
  form.appendChild(inputSecretKey)
  accountInformation.appendChild(form)
  accountSettings.appendChild(accountInformation)
  fdTabsContent.appendChild(accountSettings)
  fdTabsCustom.appendChild(fdTabsContent)
  accountSettingsContainer.appendChild(fdTabsCustom)

  fdTabsItem.appendChild(anchor)
  fdTabs.appendChild(fdTabsItemDummy)
  fdTabs.appendChild(fdTabsItem)
  accountSettingsContainer.appendChild(fdTabs)
  accountSettingsWebApp.attachShadow({ mode: 'open' })
  accountSettingsWebApp.shadowRoot.appendChild(accountSettingsContainer)
  fdBusyIndicator.appendChild(accountSettingsWebApp)
  appRoot.appendChild(fdBusyIndicator)
  mainApp.attachShadow({ mode: 'open' })
  mainApp.shadowRoot.appendChild(appRoot)

  document.body.appendChild(mainApp)
}
