/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

const MAIN_LOADING_CLASS = 'cdc-tools-app-loading'
const MAIN_LOADING_SHOW_CLASS = 'cdc-tools-app-loading-show'

// Hide credentials loading
onElementExists(`.${MAIN_LOADING_CLASS}`, () => {
  document.querySelector(`.${MAIN_LOADING_CLASS}`).classList.remove(MAIN_LOADING_SHOW_CLASS)
})
