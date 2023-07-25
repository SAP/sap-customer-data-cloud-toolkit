/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


/**
 * @jest-environment jsdom
 */

import fs from 'fs'
import path from 'path'
import { TENANT_ID_CLASS, TOPBAR_MENU_CONTAINER_PLACEHOLDER_CLASS, TOPBAR_MENU_ITEM_PLACEHOLDER_CLASS } from './constants'
import { htmlToElem } from './utils'
import { injectTopBarMenuPlaceholder, initTopBarMenuPlaceholder, destroyTopBarMenuPlaceholder } from './injectTopBarMenuPlaceholder'

const html = fs.readFileSync(path.resolve(__dirname, '../../public/index.html'), 'utf8')
jest.dontMock('fs')
jest.useFakeTimers()

const tenantIdDivMock = `<span class="${TENANT_ID_CLASS}" title="Tenant ID">000000000999999999</span>`

it('Top bar menu placeholder container and buttons are injected to the DOM', () => {
  document.documentElement.innerHTML = html.toString()
  initTopBarMenuPlaceholder()
  const injectedContainer = document.querySelectorAll(`.${TOPBAR_MENU_CONTAINER_PLACEHOLDER_CLASS}`)
  expect(injectedContainer.length).toBe(1)
  const injectedMenuItem = document.querySelectorAll(`.${TOPBAR_MENU_ITEM_PLACEHOLDER_CLASS}`)
  expect(injectedMenuItem.length).toBeGreaterThan(0)
})

it('Top bar menu placeholder container and buttons are removed from the DOM', () => {
  document.documentElement.innerHTML = html.toString()
  initTopBarMenuPlaceholder()
  destroyTopBarMenuPlaceholder()
  const injectedContainer = document.querySelectorAll(`.${TOPBAR_MENU_CONTAINER_PLACEHOLDER_CLASS}`)
  expect(injectedContainer.length).toBe(0)
  const injectedMenuItem = document.querySelectorAll(`.${TOPBAR_MENU_ITEM_PLACEHOLDER_CLASS}`)
  expect(injectedMenuItem.length).toBe(0)
})

// old

it('CDC Toolkit container is injected only when tenant ID is present on the DOM', () => {
  document.documentElement.innerHTML = html.toString()

  let tenantId, tenantIdParent, injectedContainer, injectedMenuItem

  tenantId = document.querySelectorAll(`.${TENANT_ID_CLASS}`)
  expect(tenantId.length).toBe(1)

  // Remove tenant ID
  tenantIdParent = tenantId[0].parentNode
  tenantId[0].remove()

  tenantId = document.querySelectorAll(`.${TENANT_ID_CLASS}`)
  expect(tenantId.length).toBe(0)

  injectTopBarMenuPlaceholder()
  jest.runOnlyPendingTimers()

  injectedContainer = document.querySelectorAll(`.${TOPBAR_MENU_CONTAINER_PLACEHOLDER_CLASS}`)
  expect(injectedContainer.length).toBe(0)
  injectedMenuItem = document.querySelectorAll(`.${TOPBAR_MENU_ITEM_PLACEHOLDER_CLASS}`)
  expect(injectedMenuItem.length).toBe(0)

  // After tenant id div added, the container should be injected
  tenantIdParent.appendChild(htmlToElem(tenantIdDivMock))
  jest.runOnlyPendingTimers()

  injectedContainer = document.querySelectorAll(`.${TOPBAR_MENU_CONTAINER_PLACEHOLDER_CLASS}`)
  expect(injectedContainer.length).toBe(1)
  injectedMenuItem = document.querySelectorAll(`.${TOPBAR_MENU_ITEM_PLACEHOLDER_CLASS}`)
  expect(injectedMenuItem.length).toBeGreaterThan(0)
})
