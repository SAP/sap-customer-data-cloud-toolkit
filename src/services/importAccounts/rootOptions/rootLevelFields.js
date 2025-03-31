/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { createSimpleNode } from '../utils'

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

export const getRootElementsStructure = () => {
  const rootElementsStructure = [
    createSimpleNode('phoneNumber'),
    createSimpleNode('loginIds', null, false, [createSimpleNode('loginIds.username'), createSimpleNode('loginIds.emails'), createSimpleNode('loginIds.unverifiedEmails')]),
    createSimpleNode('isActive'),
    createSimpleNode('isRegistered'),
    createSimpleNode('isVerified'),
    createSimpleNode('verified'),
    createSimpleNode('regSource'),
    createSimpleNode('dataCenter'),
    createSimpleNode('registered'),
    createSimpleNode('context'),
    createSimpleNode('lang'),
  ]
  return rootElementsStructure
}

export const getContext = () => {
  return [createSimpleNode('context')]
}

export const getLiteRootElementsStructure = () => {
  return createMandatoryBranch('email')
}
