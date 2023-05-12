/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
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
