import { configureStore } from '@reduxjs/toolkit'

import sitesReducer from './sites/siteSlice'
import emailReducer from './emails/emailSlice'

export default configureStore({
  reducer: { sites: sitesReducer, emails: emailReducer },
})
