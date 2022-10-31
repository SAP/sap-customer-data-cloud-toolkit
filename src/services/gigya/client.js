import axios from 'axios'

const MAX_RETRY_ATTEMPTS = 5
const isError = (response) => {
  return response.code === 'ETIMEDOUT' || response.data.errorCode === 403048
}

const client = {
  post: async function (url, body) {
    console.log(`Sending request to ${url}\n With body=${JSON.stringify(body)}`)

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
      console.log(`${JSON.stringify(response)}`)
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
