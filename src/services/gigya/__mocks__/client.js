import axios from 'axios'

const client = {
  NETWORK_DELAY_IN_MS: 100,
  post: async function (url, body) {
    console.log(`Mocked Sending request to ${url}\n With body=${JSON.stringify(body)}`)

    const requestOptions = {
      method: 'POST',
      url: url,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams(body),
    }
    return new Promise((pending) => setTimeout(() => pending(axios(requestOptions)), client.NETWORK_DELAY_IN_MS))
    //return axios(requestOptions)
  },
}

export default client
