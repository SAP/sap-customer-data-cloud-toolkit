export const getApiKey = (hash) => {
  const [, , apiKey] = hash.split('/')
  return apiKey !== undefined ? apiKey : ''
}
