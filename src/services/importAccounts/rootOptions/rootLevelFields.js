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
    createSimpleNode('phoneNumber', 'phoneNumber'),
    createSimpleNode('loginIds', 'loginIds', false, [
      createSimpleNode('loginIds.username', 'username'),
      createSimpleNode('loginIds.emails', 'emails'),
      createSimpleNode('loginIds.unverifiedEmails', 'unverifiedEmails'),
    ]),
    createSimpleNode('isActive', 'isActive'),
    createSimpleNode('isRegistered', 'isRegistered'),
    createSimpleNode('isVerified', 'isVerified'),
    createSimpleNode('verified', 'verified'),
    createSimpleNode('regSource', 'regSource'),
    createSimpleNode('dataCenter', 'dataCenter'),
    createSimpleNode('registered', 'registered'),
    createSimpleNode('context', 'context'),
    createSimpleNode('lang', 'lang'),
  ]
  return rootElementsStructure
}

export const getContext = () => {
  return [createSimpleNode('context', 'context')]
}

export const getLiteRootElementsStructure = () => {
  return createMandatoryBranch('email')
}
