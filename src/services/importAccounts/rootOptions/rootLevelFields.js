export function getUID() {
  return [
    {
      id: 'uid',
      name: 'uid',
      value: true,
      branches: [],
      mandatory: true,
    },
  ]
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
          id: 'loginIds.email',
          name: 'email',
          value: false,
          branches: [],
        },
        {
          id: 'loginIds.unverifiedEmail',
          name: 'unverifiedEmail',
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
  const rootElementsStructure = [
    {
      id: 'email',
      name: 'email',
      value: true,
      branches: [],
      mandatory: true,
    },
  ]
  return rootElementsStructure
}

export const standartRootFields = () => {}
