import { configureStore } from '@reduxjs/toolkit'

import sitesReducer from './sites/siteSlice'
import dataCentersSlice from './data-centers/dataCentersSlice'
import emailReducer from './emails/emailSlice'
import smsReducer from './sms/smsSlice'
import credentialsSlice from './credentials/credentialsSlice'

export default configureStore({
  reducer: { sites: sitesReducer, dataCenters: dataCentersSlice, emails: emailReducer, sms: smsReducer, credentials: credentialsSlice },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
