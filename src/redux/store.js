import { configureStore } from '@reduxjs/toolkit'
import sitesReducer from './siteSlice'

export default configureStore({
	reducer: {
		sites: sitesReducer,
	},
})
