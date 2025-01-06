export function hasNestedObject(field) {
  for (let key in field) {
    if (typeof field[key] === 'object' && field[key] !== null) {
      return true
    }
  }
  return false
}

export function isFieldDetailObject(fieldDetail, skipFields = true) {
  if (fieldDetail && typeof fieldDetail === 'object') {
    const stopFields = ['required', 'type', 'allowNull', 'writeAccess', 'tags']
    return skipFields ? !stopFields.some((field) => field in fieldDetail) : true
  }
  return false
}
