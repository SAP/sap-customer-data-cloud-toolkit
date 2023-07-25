/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import { configureStore } from '@reduxjs/toolkit'

import sitesReducer from './sites/siteSlice'
import dataCentersReducer from './dataCenters/dataCentersSlice'
import siteStructuresReducer from './siteStructures/siteStructuresSlice'
import emailReducer from './emails/emailSlice'
import smsReducer from './sms/smsSlice'
import credentialsReducer from './credentials/credentialsSlice'
import versionReducer from './version/versionSlice'
import copyConfigurationExtendedReducer from './copyConfigurationExtended/copyConfigurationExtendedSlice'
import siteDeployerCopyConfigurationReducer from './siteDeployerCopyConfiguration/siteDeployerCopyConfigurationSlice'
import targetSitesTooltipIconReducer from './targetSitesTooltipIcon/targetSitesTooltipIconSlice'

export default configureStore({
  reducer: {
    sites: sitesReducer,
    dataCenters: dataCentersReducer,
    siteStructures: siteStructuresReducer,
    emails: emailReducer,
    sms: smsReducer,
    credentials: credentialsReducer,
    version: versionReducer,
    copyConfigurationExtended: copyConfigurationExtendedReducer,
    siteDeployerCopyConfiguration: siteDeployerCopyConfigurationReducer,
    targetSitesTooltipIcon: targetSitesTooltipIconReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
