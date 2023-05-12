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

const client = {
  NETWORK_DELAY_IN_MS: 100,
  post: async function (url, body) {
    //console.log(`Mocked Sending request to ${url}\n With body=${JSON.stringify(body)}`)

    const requestOptions = {
      method: 'POST',
      url: url,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams(body),
    }
    return new Promise((pending) => setTimeout(() => pending(axios(requestOptions)), client.NETWORK_DELAY_IN_MS))
  },
}

export default client
