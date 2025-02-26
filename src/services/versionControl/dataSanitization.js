/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

export const removeIgnoredFields = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => removeIgnoredFields(item))
  } else if (obj && typeof obj === 'object') {
    const newObj = {}
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && key !== 'callId' && key !== 'time' && key !== 'lastModified') {
        newObj[key] = removeIgnoredFields(obj[key])
      }
    }
    return newObj
  }
  return obj
}

export const cleanEmailResponse = (response) => {
  if (response.doubleOptIn) {
    delete response.doubleOptIn.nextURL
    delete response.doubleOptIn.nextExpiredURL
  }
  if (response.emailVerification) {
    delete response.emailVerification.nextURL
  }
  if (response.callId) {
    delete response.callId
  }
  if (response.context) {
    delete response.context
  }
  if (response.errorCode) {
    delete response.errorCode
  }
  delete response.statusCode
  delete response.statusReason
  delete response.time
  delete response.apiVersion
}

export const cleanResponse = (response) => {
  delete response.rba
  if (response.security) {
    delete response.security.accountLockout
    delete response.security.captcha
    delete response.security.ipLockout
  }
  if (response.passwordReset) {
    delete response.passwordReset.resetURL
  }
  if (response.preferencesCenter) {
    delete response.preferencesCenter.redirectURL
  }
}

export const deepEqual = (obj1, obj2) => {
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return obj1 === obj2
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  keys1.sort()
  keys2.sort()

  for (let i = 0; i < keys1.length; i++) {
    if (keys1[i] !== keys2[i]) {
      return false
    }
    if (!deepEqual(obj1[keys1[i]], obj2[keys2[i]])) {
      return false
    }
  }

  return true
}