import { configureStore } from '@reduxjs/toolkit'

import sitesReducer from './sites/siteSlice'
import dataCentersReducer from './dataCenters/dataCentersSlice'
import siteStructuresReducer from './siteStructures/siteStructuresSlice'
import emailReducer from './emails/emailSlice'
import smsReducer from './sms/smsSlice'
import credentialsReducer from './credentials/credentialsSlice'
import versionReducer from './version/versionSlice'
import copyConfigurationExtendedReducer from './copyConfigurationExtendend/copyConfigurationExtendendSlice'

export default configureStore({
  reducer: {
    sites: sitesReducer,
    dataCenters: dataCentersReducer,
    siteStructures: siteStructuresReducer,
    emails: emailReducer,
    sms: smsReducer,
    credentials: credentialsReducer,
    version: versionReducer,
    copyConfigurationExtendend: copyConfigurationExtendedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
