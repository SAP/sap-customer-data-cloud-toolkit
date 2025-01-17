class TreeSearch {
  static removeFalseValuesFromTree(node) {
    if (!node.value) {
      return null
    }

    const filteredBranches = node.branches.map(TreeSearch.removeFalseValuesFromTree).filter((branch) => branch !== null)

    return {
      ...node,
      branches: filteredBranches,
    }
  }

  static filterTree(tree) {
    return tree.map(TreeSearch.removeFalseValuesFromTree).filter((node) => node !== null)
  }

  static getCheckedOptionsFromTree(obj, hasProperty) {
    const results = []
    const config = TreeSearch.filterTree(obj)
    for (let key of config) {
      if (hasProperty === true) {
        TreeSearch.getSchemaOptionsFromTree(key, results)
      } else {
        TreeSearch.getCheckedOptions(key, results)
      }
    }
    return results
  }

  static getSchemaOptionsFromTree(structure, result) {
    const traverseSchemaOptions = (node, path = '', parentOperation = '') => {
      let currentPath = path ? `${path}.${node.name}` : node.name

      if (parentOperation === 'array' && path) {
        currentPath = `${path}.0.${node.name}`
      }

      if (node.branches.length === 0) {
        result.push(currentPath)
      }

      if (node.branches && node.branches.length > 0) {
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

    traverseSchemaOptions(structure)
    return result
  }

  static getCheckedOptions(node, results) {
    if (node.branches.length === 0) {
      results.push(`${node.id}`)
    } else {
      for (let branch of node.branches) {
        TreeSearch.getCheckedOptions(branch, results)
      }
    }
  }
}

export default TreeSearch
