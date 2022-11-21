/**
 * Used to polyfill window.customElements that is blocked in chrome extension
 * https://stackoverflow.com/questions/55684307/window-customelements-define-is-null-cannot-create-shadow-dom-in-chrome-exten
 * https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements
 */
import '@webcomponents/custom-elements'

import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

import { logStyles } from './inject/utils'
import { initChromeStorage } from './inject/chromeStorage'
import { initNavigation } from './inject/navigation'
import { injectMenu } from './inject/injectMenu'
import { injectTopBarMenuPlaceholder } from './inject/injectTopBarMenuPlaceholder'
import { injectAppContainer } from './inject/injectAppContainer'
import { MAIN_CONTAINER_CLASS, ROUTE_SITE_DEPLOYER, ROUTE_EMAIL_TEMPLATES } from './inject/constants'

import './inject/main.css'

import store from './redux/store'
import { Provider } from 'react-redux'

const menuElements = [
  { name: 'Site Deployer', appendAfterText: 'Site Settings', route: ROUTE_SITE_DEPLOYER },
  { name: 'Email Templates', route: ROUTE_EMAIL_TEMPLATES },
  // { name: 'Copy Config. Extended', appendAfterText: 'Copy Configuration', route: ROUTE_COPY_CONFIG_EXTENDED },
]
initChromeStorage()
initNavigation()
injectMenu(menuElements)
injectTopBarMenuPlaceholder()
injectAppContainer(() => {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.querySelector(`.${MAIN_CONTAINER_CLASS}`)
  )

  console.log('SAP CDC Toolbox :: %cv1.0.0', logStyles.lightGreenBold)

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals()
})
