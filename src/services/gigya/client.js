/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import axios from 'axios'

const MAX_RETRY_ATTEMPTS = 20
const isError = (response) => {
  return (
    response.data.errorCode === 403048 || (response.code !== undefined && (response.code === 'ETIMEDOUT' || response.code === 'ERR_BAD_RESPONSE' || response.code === 'ENOTFOUND'))
  )
}

const client = {
  post: async function (url, body) {
    //console.log(`Sending request to ${url}\n With body=${JSON.stringify(body)}`)
    const requestOptions = {
      method: 'POST',
      url: url,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams(body),
    }

    let response
    let retryCounter = 0
    do {
      response = await axios(requestOptions)
      //console.log(`${JSON.stringify(response)}`)
      if (isError(response)) {
        retryCounter++
        client.wait(1000)
      }
    } while (isError(response) && retryCounter < MAX_RETRY_ATTEMPTS)

    return response
  },
  wait: (ms) => new Promise((res) => setTimeout(res, ms)),
}

export default client
