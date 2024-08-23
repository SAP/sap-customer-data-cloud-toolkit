/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

export const getApiKey = (hash) => {
  let apiKey
  if (hash.includes('login?returnUrl=')) {
    apiKey = hash.split('/')[3]
  } else {
    apiKey = hash.split('/')[2]
  }
  return apiKey !== undefined ? apiKey : ''
}
export const getScreenSet = (hash) => {
  if (hash.href.includes('screenSetId')) {
    const match = hash.href.split('?')[1]
    const params = new URLSearchParams(match)
    const screenSetId = params.get('screenSetId')
    return screenSetId
  } else {
    console.log('SCREEN SET NOT FOUND')
  }
}
export const getErrorAsArray = (error) => {
  return Array.isArray(error) ? error : [error]
}
