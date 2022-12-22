import { configureStore } from '@reduxjs/toolkit'

import sitesReducer from './sites/siteSlice'
import dataCentersSlice from './data-centers/dataCentersSlice'
import emailReducer from './emails/emailSlice'
import credentialsSlice from './credentials/credentialsSlice'

export default configureStore({
  reducer: { sites: sitesReducer, dataCenters: dataCentersSlice, emails: emailReducer, credentials: credentialsSlice },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
