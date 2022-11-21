/**
 * @jest-environment jsdom
 */

import { processHashChange, ROUTE_CONTAINER_SHOW_CLASS, IS_SELECTED_CLASS } from './navigation'
import { chromeStorageState } from './chromeStorage'
import { MAIN_CONTAINER_CLASS, MAIN_CONTAINER_SHOW_CLASS, ROUTE_SITE_DEPLOYER, MENU_ELEMENT_CLASS, ROUTE_CONTAINER_CLASS } from './constants'

const expectedPartnerId = 'partnerId'
const expectedApiKey = 'apiKey'

describe('Navigation test suite', () => {
  // const expectedPartnerId = 'partnerId'
  // const expectedApiKey = 'apiKey'

  beforeEach(() => {
    chromeStorageState.partnerId = ''
    chromeStorageState.apiKey = ''
    createDocument()
  })

  test('Process Hash Change Show container', () => {
    executeTest(`#/${expectedPartnerId}/${expectedApiKey}${ROUTE_SITE_DEPLOYER}`, true)

    expect(chromeStorageState.partnerId).toEqual(expectedPartnerId)
    expect(chromeStorageState.apiKey).toEqual(expectedApiKey)
  })

  test('Process Hash Change Hide container', () => {
    executeTest(`#/${expectedPartnerId}/${expectedApiKey}/mock-different-feature`, false)
  })
})

function executeTest(hash, showClassApplied) {
  initialVerification()

  processHashChange(hash)

  verifyAppliedClasses(showClassApplied)
}

function initialVerification() {
  expect(chromeStorageState.partnerId).toEqual('')
  expect(chromeStorageState.apiKey).toEqual('')

  verifyAppliedClasses(true)
}

function verifyAppliedClasses(showClassApplied) {
  // expect(document.getElementsByClassName(MAIN_CONTAINER_CLASS)[0].classList.contains(MAIN_CONTAINER_SHOW_CLASS)).toBe(showClassApplied)
  expect(document.getElementsByClassName(ROUTE_CONTAINER_CLASS)[0].classList.contains(ROUTE_CONTAINER_SHOW_CLASS)).toBe(showClassApplied)
  const li = document.getElementsByClassName(`${MENU_ELEMENT_CLASS} fd-nested-list__item`)[0]
  expect(li.getElementsByTagName('a')[0].classList.contains(IS_SELECTED_CLASS)).toBe(showClassApplied)
}

function createDocument() {
  const demoEnviroment = createElementWithClasses('div', ['demo-environment'], document.body, 'demoEnviroment')
  const demoEnviromentList = createList(demoEnviroment, 'demoEnviromentList')
  const demoEnviromentListAnchor = createElementWithClasses(
    'a',
    ['fd-nested-list__link', IS_SELECTED_CLASS],
    demoEnviromentList.getElementsByTagName('li')[0],
    'demoEnviromentListAnchor'
  )
  demoEnviromentListAnchor.setAttribute('href', `#/${expectedPartnerId}/${expectedApiKey}${ROUTE_SITE_DEPLOYER}`)
  const divCdcToolsApp = createElementWithClasses('div', [MAIN_CONTAINER_CLASS, MAIN_CONTAINER_SHOW_CLASS], document.body, 'divCdcToolsApp')
  const divApp = createElementWithClasses('div', ['App'], divCdcToolsApp, 'divApp')
  const divCdcToolsAppContainer = createElementWithClasses('div', [ROUTE_CONTAINER_CLASS, ROUTE_CONTAINER_SHOW_CLASS], divApp, 'divCdcToolsAppContainer')
  divCdcToolsAppContainer.setAttribute('route', ROUTE_SITE_DEPLOYER)
  return document
}
function createList(parentNode, id) {
  var ul = document.createElement('ul')
  var li = document.createElement('li')
  li.classList.add(MENU_ELEMENT_CLASS)
  li.classList.add('fd-nested-list__item')
  ul.appendChild(li)
  ul.setAttribute('id', id)
  parentNode.appendChild(ul)
  return ul
}
function createElementWithClasses(tag, classNames, parentNode, id) {
  var element = document.createElement(tag)
  for (const name of classNames) {
    element.classList.add(name)
  }
  element.setAttribute('id', id)
  parentNode.appendChild(element)
  return element
}
