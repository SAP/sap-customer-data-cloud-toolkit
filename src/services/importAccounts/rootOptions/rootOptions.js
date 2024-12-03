export const rootOptionsValue = (obj) => {
  const results = []
  for (let key of obj) {
    if (key.value) {
      results.push(key.id)
    }
  }
  return results
}
