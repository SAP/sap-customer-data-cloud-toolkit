/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

function createMandatoryBranch(branchId) {
  return [
    {
      id: branchId,
      name: branchId,
      value: true,
      branches: [],
      mandatory: true,
    },
  ]
}
export function getUID() {
  return createMandatoryBranch('uid')
}
export const getRootElementsStructure = () => {
  const rootElementsStructure = [
    {
      id: 'phoneNumber',
      name: 'phoneNumber',
      value: false,
      branches: [],
    },
    {
      id: 'loginIds',
      name: 'loginIds',
      value: false,
      branches: [
        {
          id: 'loginIds.username',
          name: 'username',
          value: false,
          branches: [],
        },
        {
          id: 'loginIds.emails',
          name: 'emails',
          value: false,
          branches: [],
        },
        {
          id: 'loginIds.unverifiedEmails',
          name: 'unverifiedEmails',
          value: false,
          branches: [],
        },
      ],
    },
    {
      id: 'isActive',
      name: 'isActive',
      value: false,
      branches: [],
    },
    {
      id: 'isRegistered',
      name: 'isRegistered',
      value: false,
      branches: [],
    },
    {
      id: 'isVerified',
      name: 'isVerified',
      value: false,
      branches: [],
    },
    {
      id: 'verified',
      name: 'verified',
      value: false,
      branches: [],
    },
    {
      id: 'regSource',
      name: 'regSource',
      value: false,
      branches: [],
    },
    {
      id: 'dataCenter',
      name: 'dataCenter',
      value: false,
      branches: [],
    },
    {
      id: 'registered',
      name: 'registered',
      value: false,
      branches: [],
    },
    {
      id: 'context',
      name: 'context',
      value: false,
      branches: [],
    },

    {
      id: 'lang',
      name: 'lang',
      value: false,
      branches: [],
    },
  ]
  return rootElementsStructure
}
export const getContext = () => {
  return [
    {
      id: 'context',
      name: 'context',
      value: false,
      branches: [],
    },
  ]
}
export const getLiteRootElementsStructure = () => {
  return createMandatoryBranch('email')
}
