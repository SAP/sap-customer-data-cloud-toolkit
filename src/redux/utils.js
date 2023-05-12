/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
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

export const getErrorAsArray = (error) => {
  return Array.isArray(error) ? error : [error]
}
