/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


export const TENANT_ID_CLASS = 'fd-info-label__text'
export const ADMIN_BUTTON_SELECTOR = '.fd-nested-list__icon.sap-icon--action-settings'
export const ADMIN_BUTTON_CLASSES = 'fd-nested-list__icon sap-icon--action-settings'
export const MENU_ELEMENT_CLASS = 'cdc-tools--menu-item'
export const MOCK_ELEMENT_CLASS = 'cdc-tools--mock'

export const TOPBAR_MENU_CONTAINER_PLACEHOLDER_CLASS = 'cdc-tools--topbar-menu-container-placeholder'
export const TOPBAR_MENU_CONTAINER_CLASS = 'cdc-toolbox--topbar-menu-container'
export const TOPBAR_MENU_ITEM_PLACEHOLDER_CLASS = 'cdc-tools--topbar-menu-item-placeholder'
export const TOPBAR_ACTIONS_SELECTOR = '.fd-shellbar__group.fd-shellbar__group--actions'

export const MAIN_LOADING_CLASS = 'cdc-tools-app-loading'
export const MAIN_LOADING_SHOW_CLASS = 'cdc-tools-app-loading-show'
export const MAIN_CONTAINER_CLASS = 'cdc-tools-app'
export const MAIN_CONTAINER_SHOW_CLASS = 'show-cdc-tools'
export const ROUTE_CONTAINER_CLASS = 'cdc-tools-app-container'
export const ROUTE_CONTAINER_SHOW_CLASS = 'show-cdc-tools-app-container'

export const ROUTE_SITE_DEPLOYER = '/cdc-toolbox/site-deployer'
export const ROUTE_EMAIL_TEMPLATES = '/user-interfacing/email-templates'
export const ROUTE_SMS_TEMPLATES = '/user-interfacing/sms-templates'
export const ROUTE_COPY_CONFIG_EXTENDED = '/cdc-toolbox/copy-configuration-extended'

export const INCOMPATIBLE_ROUTE_FRAGMENTS = ['/flow-builder-web-app']
export const MENU_ELEMENTS = [
  { name: 'Site Deployer', appendAfterText: 'Site Settings', route: ROUTE_SITE_DEPLOYER },
  { name: 'Email Templates', route: ROUTE_EMAIL_TEMPLATES },
  { name: 'SMS Templates', route: ROUTE_SMS_TEMPLATES },
  { name: 'Copy Config. Extended', appendAfterText: 'Copy Configuration', route: ROUTE_COPY_CONFIG_EXTENDED },
]
