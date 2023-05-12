/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

export const siteId = 'dcdd5bcc-0c9d-40f3-897b-cbb07138d0f7'

export const sitesConfigurations = [
  {
    siteId: siteId,
    sourceSites: [
      {
        apiKey: '4_tskE-LFxBm0-MJyvw0VoAA',
        baseDomain: 'danielc2',
        dataCenter: 'us1',
        partnerId: 79597568,
        partnerName: 'SAP Customer Data Cloud',
      },
    ],
    configurations: [
      {
        id: 'schema',
        name: 'schema',
        value: true,
        branches: [
          {
            id: 'dataSchema',
            name: 'dataSchema',
            value: true,
          },
          {
            id: 'profileSchema',
            name: 'profileSchema',
            value: true,
          },
        ],
      },
      {
        id: 'dataflows',
        name: 'schema',
        value: true,
        branches: [
          { id: 'dataflow1', name: 'dataflow1', value: true, variables: [{ variable: 'var1', value: 'test1' }] },
          { id: 'dataflow2', name: 'dataflow2', value: true, variables: [{ variable: 'var2', value: '' }] },
        ],
      },
    ],
  },
]

export const testString = 'test'

export const initialState = {
  sitesConfigurations: [],
  isLoading: false,
  isSourceInfoLoading: false,
  errors: [],
  apiCardError: undefined,
  siteId: '',
  edit: false,
  isCopyConfigurationDialogOpen: false,
  sourceSiteAdded: false,
}

export const stateWithConfigurations = {
  sitesConfigurations: sitesConfigurations,
  isLoading: false,
  isSourceInfoLoading: false,
  errors: [],
  apiCardError: undefined,
  siteId: siteId,
}

export const dummyError = { message: 'I am a dummy error' }

export const stateWithErrors = {
  sitesConfigurations: sitesConfigurations,
  isLoading: false,
  isSourceInfoLoading: false,
  errors: [dummyError],
  apiCardError: undefined,
}

export const testSourceSite = {
  apiKey: testString,
  baseDomain: testString,
  dataCenter: 'us1',
  partnerId: 12345667,
  partnerName: 'SAP Customer Data Cloud',
}

export const testConfiguration = {
  id: 'schema',
  name: 'schema',
  value: false,
  branches: [
    {
      id: 'dataSchema',
      name: 'dataSchema',
      value: false,
    },
    {
      id: 'profileSchema',
      name: 'profileSchema',
      value: false,
    },
  ],
}

export const siteInformation = {
  baseDomain: testSourceSite.baseDomain,
  context: { targetApiKey: testSourceSite.apiKey },
  dataCenter: testSourceSite.dataCenter,
  partnerName: testSourceSite.partnerName,
  partnerId: testSourceSite.partnerId,
}
