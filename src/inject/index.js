/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import { initChromeStorage } from './chromeStorage'
import { initNavigation } from './navigation'
import { injectMenu } from './injectMenu'
import { injectTopBarMenuPlaceholder } from './injectTopBarMenuPlaceholder'

import { MENU_ELEMENTS } from './constants'

import './main.css'

export const initInject = () => {
  initChromeStorage()
  injectMenu(MENU_ELEMENTS)
  injectTopBarMenuPlaceholder()
  initNavigation()
}
