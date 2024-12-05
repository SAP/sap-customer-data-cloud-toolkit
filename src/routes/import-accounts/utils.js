export const extractIds = (data) => {
  const ids = new Set()

  function traverse(node) {
    if (Array.isArray(node)) {
      node.forEach(traverse)
    } else {
      if (node.id && node.branches.length === 0) {
        ids.add(node.id)
      }
      if (node.branches && node.branches.length > 0) {
        node.branches.forEach(traverse)
      }
    }
  }

  data.forEach((item) => {
    if (item) {
      traverse(item)
    }
  })
  return Array.from(ids)
}

export const getAllParentNodes = (branches, targetId) => {
  for (const branch of branches) {
    if (branch.id === targetId) {
      return [branch]
    }
    if (branch.branches.length > 0) {
      const path = getAllParentNodes(branch.branches, targetId)
      if (path.length > 0) {
        return [{ ...branch, branches: path }]
      }
    }
  }
  return []
}
