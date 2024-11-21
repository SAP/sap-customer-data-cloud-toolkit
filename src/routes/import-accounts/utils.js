export const extractIds = (data) => {
  const ids = new Set()

  function traverse(node) {
    if (node.id) {
      ids.add(node.id)
    }
    if (node.branches && node.branches.length > 0) {
      node.branches.forEach(traverse)
    }
  }

  data.forEach(traverse)
  return Array.from(ids)
}
