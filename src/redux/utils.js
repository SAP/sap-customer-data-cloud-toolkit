export const getApiKey = (hash) => {
  let apiKey
  if (hash.includes('login?returnUrl=')) {
    apiKey = hash.split('/')[3]
  } else {
    apiKey = hash.split('/')[2]
  }
  return apiKey !== undefined ? apiKey : ''
}
