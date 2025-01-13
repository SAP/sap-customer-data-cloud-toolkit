class TreeSearch {
  static getCheckedOptionsFromTree(obj) {
    const results = []

    for (let key of obj) {
      TreeSearch.getCheckedOptions(key, results)
    }

    return results
  }
  static getSchemaOptionsFromTree(structure) {
    const result = []
    const traverseSchemaOptions = (node, path = '', parentOperation = '') => {
      let currentPath = path ? `${path}.${node.name}` : node.name

      if (parentOperation === 'array' && path) {
        currentPath = `${path}.0.${node.name}`
      }

      if (node.value === true && node.branches.length === 0) {
        result.push(currentPath)
      }

      if (node.value === true && node.branches && node.branches.length > 0) {
        node.branches.forEach((branch) => {
          const childOperation = branch.switchId ? branch.switchId : ''
          const nextParentOperation = node.switchId ? node.switchId : parentOperation

          if (nextParentOperation === 'array' && childOperation === 'object') {
            traverseSchemaOptions(branch, currentPath, nextParentOperation)
          } else if (nextParentOperation === 'object' && childOperation === 'array') {
            traverseSchemaOptions(branch, `${currentPath}`, nextParentOperation)
          } else if (nextParentOperation === 'array' && childOperation === 'array') {
            traverseSchemaOptions(branch, `${currentPath}`, nextParentOperation)
          } else {
            traverseSchemaOptions(branch, currentPath, nextParentOperation)
          }
        })
      }
    }

    structure.forEach((node) => traverseSchemaOptions(node))
    return result
  }
  static getCheckedOptions(node, results) {
    if (node.branches.length === 0 && node.value === true) {
      results.push(`${node.id}`)
    } else {
      for (let branch of node.branches) {
        TreeSearch.getCheckedOptions(branch, results)
      }
    }
  }
  static getSchema
}
export default TreeSearch
