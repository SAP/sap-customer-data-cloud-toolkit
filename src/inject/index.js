/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { initChromeStorage } from './chromeStorage'
import { injectMenu } from './injectMenu'
import { initNavigation } from './navigation'

import { MENU_ELEMENTS } from './constants'

export const initInject = () => {
  initChromeStorage()
  injectMenu(MENU_ELEMENTS)
  initNavigation()
}
