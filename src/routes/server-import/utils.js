export const isInputFilled = (configurations) => {
  for (let i = 0; i < configurations.length; i++) {
    if (configurations[i].value === undefined || configurations[i].value === '') {
      return false
    }
  }
  return true
}
