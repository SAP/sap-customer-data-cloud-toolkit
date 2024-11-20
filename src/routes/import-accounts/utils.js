export const extractTreeNodeIds = (configurations) => {
  const ids = []

  const traverse = (nodes) => {
    nodes.forEach((node) => {
      ids.push(node.id)
      if (node.branches && node.branches.length > 0) {
        traverse(node.branches)
      }
    })
  }

  traverse(configurations)
  console.log('IDS--->', ids)
  return ids
}
export const getAllNames = (nodes) => {
  let names = []

  const traverse = (nodeArray) => {
    nodeArray.forEach((node) => {
      names.push(node.name)
      if (node.children && node.children.length > 0) {
        traverse(node.children)
      }
    })
  }

  traverse(nodes)
  return names
}
export const extractIds = (data) => {
  let ids = []

  const traverse = (nodes) => {
    nodes.forEach((node) => {
      ids.push(node.id)
      if (node.branches && node.branches.length > 0) {
        traverse(node.branches)
      }
    })
  }

  traverse(data)
  return ids
}
