'use strict'
const axios = require('axios').default

const client = {
  post: async function (url, body) {
    console.log('Sending request to ' + url + '\n With body=' + JSON.stringify(body))

    const requestOptions = {
      method: 'POST',
      url: url,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams(body),
    }
    return axios(requestOptions)
  },
}

module.exports = client
