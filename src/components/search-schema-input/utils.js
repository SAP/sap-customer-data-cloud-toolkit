export const findStringInAvailableTreeNode = (string, targetSchemas) => {
  return targetSchemas.filter((targetSchema) => targetSchema.name.includes(string)).length !== 0
}

const targetSchemaContainsString = (string, availableTargetSite) => {
  return availableTargetSite.id.includes(string) || availableTargetSite.name.includes(string)
}

export const filterTargetSchemas = (string, targetSites) => {
  if (string.length > 2) {
    const filteredTargetSchema = targetSites.filter((targetSchema) => targetSchemaContainsString(string, targetSchema))
    return filteredTargetSchema
  } else {
    return []
  }
}
