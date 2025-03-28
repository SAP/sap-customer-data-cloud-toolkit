/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

const UID_TOOLTIP = 'When importing a new account the UID column must be empty'

function createMandatoryBranch(branchId) {
  const branch = {
    id: branchId,
    name: branchId,
    value: true,
    branches: [],
    mandatory: true,
  }

  if (branchId === 'uid') {
    branch.tooltip = UID_TOOLTIP
  }

  return [branch]
}
export function getUID() {
  return createMandatoryBranch('uid')
}
function createNode(id, name, value = false, branches = []) {
  return {
    id,
    name,
    value,
    branches,
  }
}

export const getRootElementsStructure = () => {
  const rootElementsStructure = [
    createNode('phoneNumber', 'phoneNumber'),
    createNode('loginIds', 'loginIds', false, [
      createNode('loginIds.username', 'username'),
      createNode('loginIds.emails', 'emails'),
      createNode('loginIds.unverifiedEmails', 'unverifiedEmails'),
    ]),
    createNode('isActive', 'isActive'),
    createNode('isRegistered', 'isRegistered'),
    createNode('isVerified', 'isVerified'),
    createNode('verified', 'verified'),
    createNode('regSource', 'regSource'),
    createNode('dataCenter', 'dataCenter'),
    createNode('registered', 'registered'),
    createNode('context', 'context'),
    createNode('lang', 'lang'),
  ]
  return rootElementsStructure
}

export const getContext = () => {
  return [createNode('context', 'context')]
}

export const getLiteRootElementsStructure = () => {
  return createMandatoryBranch('email')
}
