/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import React from 'react'
import { createRoot } from 'react-dom/client'

import store from './redux/store'
import { Provider } from 'react-redux'

import App from './App'
import reportWebVitals from './reportWebVitals'
import { logStyles } from './utils/logStyles'
import { VERSION } from './constants'

export const initAppReact = (container) => {
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  )
  console.log(`SAP Customer Data Cloud toolkit :: %cv${VERSION}`, logStyles.lightGreenBold)

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals()
}
