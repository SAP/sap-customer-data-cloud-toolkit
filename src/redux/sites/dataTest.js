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
      siteDomain: 'test domain',
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
      siteDomain: 'test domain',
      description: 'test description',
      dataCenter: 'test data center',
      childSites: [
        {
          parentSiteTempId: '1234',
          tempId: '5678',
          siteDomain: 'test domain',
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
  newSiteDomain: 'updated domain',
  newDescription: 'updated description',
  newDataCenter: 'updated data center',
}

const childToUpdate = {
  parentSiteTempId: '1234',
  tempId: '5678',
  newSiteDomain: 'updated domain',
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
    rootSiteDomain: 'test',
    siteDomain: 'dev.parent.{{dataCenter}}.{{siteDomain}}',
    description: 'test parent from strucure',
    dataCenter: 'AU',
    childSites: [
      {
        siteDomain: 'dev.{{dataCenter}}.{{siteDomain}}',
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
