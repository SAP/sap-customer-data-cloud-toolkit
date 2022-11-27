/**
 * Used to polyfill window.customElements that is blocked in chrome extension
 * https://stackoverflow.com/questions/55684307/window-customelements-define-is-null-cannot-create-shadow-dom-in-chrome-exten
 * https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements
 */
import '@webcomponents/custom-elements'

import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

import { logStyles } from './inject/utils'
import { initChromeStorage } from './inject/chromeStorage'
import { initNavigation } from './inject/navigation'
import { injectMenu } from './inject/injectMenu'
import { injectTopBarMenuPlaceholder } from './inject/injectTopBarMenuPlaceholder'
import { initAppContainer, destroyAppContainer } from './inject/injectAppContainer'
import { MAIN_CONTAINER_CLASS, MENU_ELEMENTS } from './inject/constants'

import { VERSION } from './constants'

import './inject/main.css'

import store from './redux/store'
import { Provider } from 'react-redux'

import './i18n'

export let isAppInitialized = false

export const initAppReact = ({ route }) => {
  if (isAppInitialized) {
    return
  }
  initAppContainer()

  const container = document.querySelector(`.${MAIN_CONTAINER_CLASS}`)
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App route={route} />
      </Provider>
    </React.StrictMode>
  )
  isAppInitialized = true

  console.log(`SAP CDC Toolbox :: %cv${VERSION}`, logStyles.lightGreenBold)

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals()
}

export const destroyAppReact = () => {
  if (!isAppInitialized) {
    return
  }
  destroyAppContainer()
  isAppInitialized = false
}

initChromeStorage()
injectMenu(MENU_ELEMENTS)
injectTopBarMenuPlaceholder()
initNavigation()
