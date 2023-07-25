/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


/**
 * Used to polyfill window.customElements that is blocked in chrome extension
 * https://stackoverflow.com/questions/55684307/window-customelements-define-is-null-cannot-create-shadow-dom-in-chrome-exten
 * https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements
 */
import '@webcomponents/custom-elements'

import { initInject } from './inject/'
import './i18n'
import './index.css'

// The react app is initiated depending on the route in the inject/navigation.js file
initInject()
