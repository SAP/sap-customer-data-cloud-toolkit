export function exportPreferencesData(items) {
  const optionKeys = findMatches(items)
  if (optionKeys === undefined) {
    return
  }

  return optionKeys
}
const findMatches = (obj) => {
  const results = []

  const traverse = (node) => {
    if (node.branches.length === 0 && node.value === true) {
      results.push(`${node.id}`)
    } else {
      for (let branch of node.branches) {
        traverse(branch)
      }
    }
  }

  for (let key of obj) {
    traverse(key)
  }

  return results
}
