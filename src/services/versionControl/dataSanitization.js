/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { removePropertyFromObjectCascading } from '../copyConfig/objectHelper'

export const removeIgnoredFields = (obj, fieldsToRemove) => {
  const newObj = { ...obj }
  fieldsToRemove.forEach((field) => {
    removePropertyFromObjectCascading(newObj, field)
  })
  return newObj
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
