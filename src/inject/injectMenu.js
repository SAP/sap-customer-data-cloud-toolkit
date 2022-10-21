import { querySelectorAllShadows, watchElement, htmlToElem, getInnerText } from './utils'
import { MAIN_CONTAINER_CLASS, MAIN_CONTAINER_SHOW_CLASS } from './injectAppContainer'

export const ADMIN_BUTTON_SELECTOR = '.fd-nested-list__icon.sap-icon--action-settings'
export const ADMIN_BUTTON_CLASSES = 'fd-nested-list__icon sap-icon--action-settings'
export const MENU_ELEMENT_CLASS = 'cdc-tools--menu-item'
export const COMMON_URL_PART = 'cdc-tools'

export const menuElementHtml = `\
<li fd-nested-list-item="" class="fd-nested-list__item ${MENU_ELEMENT_CLASS}">\
  <a fd-nested-linklist-="" href="#/{{partnerId}}/{{apiKey}}/${COMMON_URL_PART}/{{tabName}}" tabindex="0" 
class="fd-nested-list__link" name="{{tabName}}">\
    <!--<span fd-nested-list-icon="" class="fd-nested-list__icon sap-icon--product" role="presentation"></span>-->\
    <span fd-nested-list-title="" class="fd-nested-list__title">\
      {{name}}\
      <span style="margin-left:6px;color:var(--sapContent_Placeholderloading_Background);color:var(--sapList_SelectionBackgroundColor);
  color:var(--sapButton_Emphasized_Hover_BorderColor);">●</span> \
      <!--<span class="sap-icon--settings" style="margin-left: 6px;"></span>-->\
    </span>\
  </a>\
</li>`

export const initMenuExtension = (menuElements = []) => {
  const [, partnerId, apiKey] = window.location.hash.split('/')

  let ulMenu = querySelectorAllShadows('.fd-side-nav__main-navigation .level-1.fd-nested-list')
  if (!ulMenu.length) {
    return
  }
  ulMenu = ulMenu[0]

  ulMenu.querySelectorAll('li').forEach((li) => {
    const elem = menuElements.filter((el) => el.appendAfterText === getInnerText(li.querySelector('.fd-nested-list__title')))

    if (elem.length) {
      const { tabName, name } = elem[0]
      let elemHtml = menuElementHtml
      elemHtml = elemHtml.replaceAll('{{partnerId}}', partnerId)
      elemHtml = elemHtml.replaceAll('{{apiKey}}', apiKey)
      elemHtml = elemHtml.replaceAll('{{tabName}}', tabName)
      elemHtml = elemHtml.replaceAll('{{name}}', name)

      const newElem = htmlToElem(elemHtml)

      // Add on click event to show tools wrap container before HASH changes
      newElem.addEventListener('click', () => document.querySelector(`.${MAIN_CONTAINER_CLASS}`).classList.add(MAIN_CONTAINER_SHOW_CLASS))

      li.after(newElem)
    }
  })
}

export const destroyMenuExtension = () => {
  querySelectorAllShadows(`.${MENU_ELEMENT_CLASS}`).forEach((elem) => elem.remove())
}

export const injectMenu = (menuElements = []) => {
  watchElement({
    elemSelector: ADMIN_BUTTON_SELECTOR,
    onCreated: () => {
      initMenuExtension(menuElements)
    },
    onRemoved: () => {
      destroyMenuExtension()
    },
  })
}
