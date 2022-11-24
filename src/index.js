/**
 * Used to polyfill window.customElements that is blocked in chrome extension
 * https://stackoverflow.com/questions/55684307/window-customelements-define-is-null-cannot-create-shadow-dom-in-chrome-exten
 * https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements
 */
import '@webcomponents/custom-elements'

import React from 'react'
// import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

import { logStyles } from './inject/utils'
import { initChromeStorage } from './inject/chromeStorage'
import { initNavigation } from './inject/navigation'
import { injectMenu } from './inject/injectMenu'
import { injectTopBarMenuPlaceholder } from './inject/injectTopBarMenuPlaceholder'
// import { injectAppContainer } from './inject/injectAppContainer'
import { MAIN_CONTAINER_CLASS, ROUTE_SITE_DEPLOYER, ROUTE_EMAIL_TEMPLATES } from './inject/constants'

import { VERSION } from './constants'

import './inject/main.css'

import store from './redux/store'
import { Provider } from 'react-redux'

import './i18n'

// Problem to solve:
// - Do not create a new Shadow root because in flow builder it already exists after flow builder
// Uncaught DOMException: Failed to execute 'attachShadow' on 'Element': Shadow root cannot be created on a host which already hosts a shadow tree.

const initReact = ({ route }) => {
  const container = document.querySelector(`.${MAIN_CONTAINER_CLASS}`)
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App route={route} />
      </Provider>
    </React.StrictMode>
  )

  // ReactDOM.render(
  //   <React.StrictMode>
  //     <Provider store={store}>
  //       <App />
  //     </Provider>
  //   </React.StrictMode>,
  //   document.querySelector(`.${MAIN_CONTAINER_CLASS}`)
  // )

  // setTimeout(() => document.querySelector(`.${MAIN_CONTAINER_CLASS}`).remove(), 5000)

  console.log(`SAP CDC Toolbox :: %cv${VERSION}`, logStyles.lightGreenBold)

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals()
}

const menuElements = [
  { name: 'Site Deployer', appendAfterText: 'Site Settings', route: ROUTE_SITE_DEPLOYER },
  { name: 'Email Templates', route: ROUTE_EMAIL_TEMPLATES },
  // { name: 'Copy Config. Extended', appendAfterText: 'Copy Configuration', route: ROUTE_COPY_CONFIG_EXTENDED },
]
initChromeStorage()
initNavigation()
injectMenu(menuElements)
injectTopBarMenuPlaceholder()
// injectAppContainer(() => {
//   initReact()
// })

export { initReact, menuElements }
