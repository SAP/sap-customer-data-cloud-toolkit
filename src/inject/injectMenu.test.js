/**
 * @jest-environment jsdom
 */

import fs from 'fs'
import path from 'path'
import { getInnerText, htmlToElem } from './utils'
import { initMenuExtension, destroyMenuExtension, injectMenu } from './injectMenu'
import { MENU_ELEMENT_CLASS, MOCK_ELEMENT_CLASS, ADMIN_BUTTON_SELECTOR, ADMIN_BUTTON_CLASSES } from './constants'

const html = fs.readFileSync(path.resolve(__dirname, '../../public/index.html'), 'utf8')
jest.dontMock('fs')

describe('Inject menu test suite', () => {
  let menuElements = [
    { name: 'Site Deployer', tabName: 'site-deployer', appendAfterText: 'Site Settings' },
    { name: 'Copy Config. Extended', tabName: 'copy-configuration-extended', appendAfterText: 'Copy Configuration' },
  ]

  const adminButtonMock = `\
<a fd-nested-list-link="" href="#/99999999/4_AAAAAAAAAAAAAAAAAAAAAA/system-status"\
  tabindex="0" class="fd-nested-list__link"><span fd-nested-list-icon=""\
    class="${ADMIN_BUTTON_CLASSES}" role="presentation"></span>\
  <span fd-nested-list-title="" class="fd-nested-list__title">Administration</span>\
</a>`

  it('Objects in menuElements should have a property appendAfterText with a value that exists in the text format on the original GIGYA navigation', () => {
    document.documentElement.innerHTML = html.toString()
    const menuButtonsDOM = document.querySelectorAll('li .fd-nested-list__title')

    menuElements.forEach((el) => {
      const buttonsFound = [...menuButtonsDOM].filter((domElement) => getInnerText(domElement).includes(el.appendAfterText))

      expect(getInnerText(buttonsFound[0])).toEqual(expect.stringContaining(el.appendAfterText))
    })
  })

  it('CDC Toolbox menu buttons are injected to the DOM', () => {
    document.documentElement.innerHTML = html.toString()

    initMenuExtension(menuElements)

    const menuButtonsDOM = document.querySelectorAll('li .fd-nested-list__title')

    menuElements.forEach((el) => {
      const buttonsFound = [...menuButtonsDOM].filter((domElement) => getInnerText(domElement).includes(el.name))

      expect(getInnerText(buttonsFound[0])).toEqual(expect.stringContaining(el.name))
    })
  })

  it('CDC Toolbox menu buttons are removed from the DOM', () => {
    document.documentElement.innerHTML = html.toString()
    initMenuExtension(menuElements)
    destroyMenuExtension()
    const injectedButtons = document.querySelectorAll(`.${MENU_ELEMENT_CLASS}`)
    expect(injectedButtons.length).toBe(0)
  })

  jest.useFakeTimers()

  it('CDC Toolbox menu buttons injected when Admin Button exists and removed when it desappears', () => {
    document.documentElement.innerHTML = html.toString()

    let injectedButtons, adminButton, adminButtonParent

    injectedButtons = document.querySelectorAll(`.${MENU_ELEMENT_CLASS}:not(.${MOCK_ELEMENT_CLASS})`)
    expect(injectedButtons.length).toBe(0)

    injectMenu(menuElements)
    injectedButtons = document.querySelectorAll(`.${MENU_ELEMENT_CLASS}:not(.${MOCK_ELEMENT_CLASS})`)
    expect(injectedButtons.length).toBe(menuElements.length)

    // Remove admin button, the injected buttons should be removed
    adminButton = document.querySelector(ADMIN_BUTTON_SELECTOR).parentNode
    adminButtonParent = adminButton.parentNode
    adminButton.remove()
    jest.runOnlyPendingTimers()

    injectedButtons = document.querySelectorAll(`.${MENU_ELEMENT_CLASS}:not(.${MOCK_ELEMENT_CLASS})`)
    expect(injectedButtons.length).toBe(0)

    // Adding again the admin button, the buttons should be injected
    adminButtonParent.appendChild(htmlToElem(adminButtonMock))
    jest.runOnlyPendingTimers()

    injectedButtons = document.querySelectorAll(`.${MENU_ELEMENT_CLASS}:not(.${MOCK_ELEMENT_CLASS})`)
    expect(injectedButtons.length).toBe(menuElements.length)
  })
})
