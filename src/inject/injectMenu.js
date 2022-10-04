import {
  querySelectorAllShadows,
  watchElement,
  htmlToElem,
  // logStyles,
  getInnerText,
} from './utils'

// Menu elements
export const menuElements = [
  {
    appendAfterText: 'Site Settings',
    name: 'Site Deployer',
    tabName: 'site-deployer',
    html: () => {
      const index = 0
      return `\
    <li fd-nested-list-item="" class="fd-nested-list__item cdc-tools--menu-item" data-cdc-toolbox-index="${index}">\
      <a fd-nested-linklist-="" href="#/{{partnerId}}/{{apiKey}}/cdc-tools/${menuElements[index].tabName}" tabindex="0" 
	  class="fd-nested-list__link" name="${menuElements[index].tabName}">\
        <!--<span fd-nested-list-icon="" class="fd-nested-list__icon sap-icon--product" role="presentation"></span>-->\
        <span fd-nested-list-title="" class="fd-nested-list__title">\
          ${menuElements[index].name}\
          <span style="margin-left:6px;color:var(--sapContent_Placeholderloading_Background);color:var(--sapList_SelectionBackgroundColor);
		  color:var(--sapButton_Emphasized_Hover_BorderColor);">●</span> \
          <!--<span class="sap-icon--settings" style="margin-left: 6px;"></span>-->\
        </span>\
      </a>\
    </li>`
    },
  },
  // {
  //   appendAfterText: 'Copy Configuration',
  //   name: 'Copy Config. Extended',
  //   tabName: 'copy-configuration-extended',
  //   html: () => {
  //     const index = 1;
  //     return `\
  //   <li fd-nested-list-item="" class="fd-nested-list__item cdc-tools--menu-item" data-cdc-toolbox-index="${index}">\
  //     <a fd-nested-list-link="" href="#/{{partnerId}}/{{apiKey}}/cdc-tools/${menuElements[index].tabName}" tabindex="0"
  //     class="fd-nested-list__link" name="${menuElements[index].tabName}">\
  //     <!--<span fd-nested-list-icon="" class="fd-nested-list__icon sap-icon--task" role="presentation"></span>-->\
  //       <span fd-nested-list-title="" class="fd-nested-list__title">\
  //         ${menuElements[index].name}\
  //         <span style="margin-left:6px;color:var(--sapContent_Placeholderloading_Background);color:var(--sapList_SelectionBackgroundColor);
  //         color:var(--sapButton_Emphasized_Hover_BorderColor);">●</span> \
  //         <!--<span class="sap-icon--settings" style="margin-left: 6px;"></span>-->\
  //       </span>\
  //     </a>\
  //   </li>`;
  //   },
  // },
]

export const initMenuExtension = () => {
  const [, partnerId, apiKey] = window.location.hash.split('/')

  let ulMenu = querySelectorAllShadows('.fd-side-nav__main-navigation .level-1.fd-nested-list')
  if (!ulMenu.length) {
    return
  }
  ulMenu = ulMenu[0]

  ulMenu.querySelectorAll('li').forEach((li) => {
    const elem = menuElements.filter((el) => el.appendAfterText === getInnerText(li.querySelector('.fd-nested-list__title')))

    if (elem.length) {
      let elemHtml = elem[0].html()
      elemHtml = elemHtml.replaceAll('{{partnerId}}', partnerId)
      elemHtml = elemHtml.replaceAll('{{apiKey}}', apiKey)

      const newElem = htmlToElem(elemHtml)

      // Add on click event to show tools wrap container before HASH changes
      newElem.addEventListener('click', () => document.querySelector('.cdc-tools-app').classList.add('show-cdc-tools'))

      li.after(newElem)
    }
  })
}

export const destroyMenuExtension = () => {
  querySelectorAllShadows('.cdc-tools--menu-item').forEach((elem) => elem.remove())
}

export const injectMenu = () => {
  watchElement({
    elemSelector: '.fd-nested-list__icon.sap-icon--action-settings', // Admin button
    onCreated: () => {
      initMenuExtension()
    },
    onRemoved: () => {
      destroyMenuExtension()
    },
  })
}
