/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


// Watch for changes to the user's options & apply them
export let chromeStorageState = {
  userKey: '',
  secretKey: '',
  partnerId: '',
  apiKey: '',
}

export const initChromeStorage = () => {
  if (!window.chrome || !window.chrome.storage || !window.chrome.storage.local) {
    console.log('Error: Unable to user window.chrome.storage.')
    return
  }

  window.chrome.storage.local.get(['userKey', 'secretKey'], ({ userKey, secretKey }) => (chromeStorageState = { userKey, secretKey }))

  window.chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      if (changes.userKey) {
        chromeStorageState.userKey = changes.userKey.newValue
      }
      if (changes.secretKey) {
        chromeStorageState.secretKey = changes.secretKey.newValue
      }
    }
  })
}
