export const findStringInAvailableTreeNode = (string, targetSchemas) => {
  return targetSchemas.filter((targetSchema) => targetSchema.name.includes(string)).length !== 0
}

export const filterTargetSchemas = (string, targetSites) => {
  if (string.length > 2) {
    const filteredTargetSchema = targetSites.filter((targetSchema) => targetSchema === string)
    return filteredTargetSchema
  } else {
    return []
  }
}
