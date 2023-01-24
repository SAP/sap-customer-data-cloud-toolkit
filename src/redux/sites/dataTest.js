const initialState = {
  sites: [],
  isLoading: false,
  errors: [],
  showSuccessDialog: false,
  sitesToDeleteManually: [],
}

const stateWithParentWithNoChild = {
  sites: [
    {
      parentSiteTempId: '',
      tempId: '1234',
      baseDomain: 'test domain',
      description: 'test description',
      dataCenter: 'test data center',
      childSites: [],
      isChildSite: false,
    },
  ],
  isLoading: false,
}

const stateWithParentWithChild = {
  sites: [
    {
      parentSiteTempId: '',
      tempId: '1234',
      baseDomain: 'test domain',
      description: 'test description',
      dataCenter: 'test data center',
      childSites: [
        {
          parentSiteTempId: '1234',
          tempId: '5678',
          baseDomain: 'test domain',
          description: 'test description',
          dataCenter: 'test data center',
          isChildSite: true,
        },
      ],
      isChildSite: false,
    },
  ],
  isLoading: false,
}

const stateWithError = {
  sites: [],
  isLoading: false,
  dataCenters: [],
  errors: [{ error: 'I am a dummy error!' }],
  showSuccessDialog: false,
}

const parentToUpdate = {
  tempId: '1234',
  newbaseDomain: 'updated domain',
  newDescription: 'updated description',
  newDataCenter: 'updated data center',
}

const childToUpdate = {
  parentSiteTempId: '1234',
  tempId: '5678',
  newbaseDomain: 'updated domain',
  newDescription: 'updated description',
}

const stateWithSitesToRemoveManually = {
  sites: [],
  isLoading: false,
  credentials: {
    userKey: '',
    secretKey: '',
  },
  errors: [],
  showSuccessDialog: false,
  sitesToDeleteManually: [{ tempId: '123abc' }, { tempId: '456edf' }],
}

const dataToAddParentFromStructure = {
  parentFromStructure: {
    rootbaseDomain: 'test',
    baseDomain: 'dev.parent.{{dataCenter}}.{{baseDomain}}',
    description: 'test parent from strucure',
    dataCenter: 'AU',
    childSites: [
      {
        baseDomain: 'dev.{{dataCenter}}.{{baseDomain}}',
        description: 'test child from strucure',
        dataCenter: 'AU',
      },
    ],
  },
  dataCenters: [
    {
      label: 'AU',
      value: 'au1',
    },
    {
      label: 'EU',
      value: 'eu1',
    },
    {
      label: 'US',
      value: 'us1',
    },
  ],
}

export {
  initialState,
  stateWithParentWithNoChild,
  stateWithParentWithChild,
  stateWithError,
  parentToUpdate,
  childToUpdate,
  stateWithSitesToRemoveManually,
  dataToAddParentFromStructure,
}
