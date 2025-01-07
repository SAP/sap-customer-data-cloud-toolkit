/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
export function getOptionsFromSchemaTree(structure) {
  console.log('structure--->', structure)
  const result = []
  const traverse = (node, path = '', parentOperation = '') => {
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
          traverse(branch, currentPath, nextParentOperation)
        } else if (nextParentOperation === 'object' && childOperation === 'array') {
          traverse(branch, `${currentPath}`, nextParentOperation)
        } else if (nextParentOperation === 'array' && childOperation === 'array') {
          traverse(branch, `${currentPath}`, nextParentOperation)
        } else {
          traverse(branch, currentPath, nextParentOperation)
        }
      })
    }
  }

  structure.forEach((node) => traverse(node))
  console.log('result--->', result)
  return result
}
