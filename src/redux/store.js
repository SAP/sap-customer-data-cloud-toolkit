import { configureStore } from '@reduxjs/toolkit'

import sitesReducer from './sites/siteSlice'
import emailReducer from './emails/emailSlice'
import credentialsSlice from './credentials/credentialsSlice'

export default configureStore({
  reducer: { sites: sitesReducer, emails: emailReducer, credentials: credentialsSlice },
})
