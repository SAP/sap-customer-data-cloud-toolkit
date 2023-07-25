/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


const MAIN_LOADING_CLASS = 'cdc-tools-app-loading'
const MAIN_LOADING_SHOW_CLASS = 'cdc-tools-app-loading-show'

// Hide credentials loading
onElementExists(`.${MAIN_LOADING_CLASS}`, () => {
  document.querySelector(`.${MAIN_LOADING_CLASS}`).classList.remove(MAIN_LOADING_SHOW_CLASS)
})
