/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

const initialState = {
  sites: [],
  isLoading: false,
  errors: [],
  showSuccessDialog: false,
  sitesToDeleteManually: [],
  progressIndicatorValue: 0,
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
  showSuccessDialog: false,
  sitesToDeleteManually: [],
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
  newBaseDomain: 'updated domain',
  newDescription: 'updated description',
  newDataCenter: 'updated data center',
}

const childToUpdate = {
  parentSiteTempId: '1234',
  tempId: '5678',
  newBaseDomain: 'updated domain',
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
    rootBaseDomain: 'test',
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

const dummyError = { tempId: '1234', errorCode: 400 }

const dummySiteResponse = {
  apiKey: 'abcd',
  errorCode: 0,
  tempId: '1234',
}

const dummyCopyConfigurationResponse = {
  errorCode: 400,
  errorMessage: 'test error message',
  context: { targetApiKey: 'abcd' },
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
  dummyError,
  dummySiteResponse,
  dummyCopyConfigurationResponse,
}
