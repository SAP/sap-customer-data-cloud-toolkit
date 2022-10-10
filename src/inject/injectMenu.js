import {
  querySelectorAllShadows,
  watchElement,
  htmlToElem,
  logStyles,
} from './utils';

// Menu elements
export const menuElements = [
  {
    name: 'Site Deployer',
    appendAfterText: 'Sites',
    html: `\
    <li fd-nested-list-item="" class="fd-nested-list__item cdc-tools--menu-item">\
      <a fd-nested-linklist-="" href="#/{{partnerId}}/{{apiKey}}/cdc-tools/site-deployer" tabindex="0" class="fd-nested-list__link" name="site-deployer">\
        <!--<span fd-nested-list-icon="" class="fd-nested-list__icon sap-icon--product" role="presentation"></span>-->\
        <span fd-nested-list-title="" class="fd-nested-list__title">\
          Site Deployer\
          <span style="margin-left:6px;color:var(--sapContent_Placeholderloading_Background);color:var(--sapList_SelectionBackgroundColor);color:var(--sapButton_Emphasized_Hover_BorderColor);">●</span> \
          <!--<span class="sap-icon--settings" style="margin-left: 6px;"></span>-->\
        </span>\
      </a>\
    </li>`,
  },
  {
    name: 'Copy Configuration Extended',
    appendAfterText: 'Copy Configuration',
    html: `\
    <li fd-nested-list-item="" class="fd-nested-list__item cdc-tools--menu-item">\
      <a fd-nested-list-link="" href="#/{{partnerId}}/{{apiKey}}/cdc-tools/copy-configuration-extended" tabindex="0" class="fd-nested-list__link" name="copy-configuration-extended">\
      <!--<span fd-nested-list-icon="" class="fd-nested-list__icon sap-icon--task" role="presentation"></span>-->\
        <span fd-nested-list-title="" class="fd-nested-list__title">\
          Copy Config. Extended \
          <span style="margin-left:6px;color:var(--sapContent_Placeholderloading_Background);color:var(--sapList_SelectionBackgroundColor);color:var(--sapButton_Emphasized_Hover_BorderColor);">●</span> \
          <!--<span class="sap-icon--settings" style="margin-left: 6px;"></span>-->\
        </span>\
      </a>\
    </li>`,
  },
];

export const initMenuExtension = () => {
  const [, partnerId, apiKey] = window.location.hash.split('/');

  let ulMenu = querySelectorAllShadows(
    '.fd-side-nav__main-navigation .level-1.fd-nested-list',
  );
  if (!ulMenu.length) return;
  ulMenu = ulMenu[0];

  ulMenu.querySelectorAll('li').forEach((li) => {
    const elem = menuElements.filter(
      (el) =>
        el.appendAfterText ===
        li.querySelector('.fd-nested-list__title').innerText,
    );

    if (!elem.length) return true;

    let elemHtml = elem[0].html;
    elemHtml = elemHtml.replaceAll('{{partnerId}}', partnerId);
    elemHtml = elemHtml.replaceAll('{{apiKey}}', apiKey);

    let newElem = htmlToElem(elemHtml);

    // Add on click event to show tools wrap container before HASH changes
    newElem.addEventListener('click', () =>
      document.querySelector('.cdc-tools-app').classList.add('show-cdc-tools'),
    );

    li.after(newElem);
  });
};

export const destroyMenuExtension = () => {
  querySelectorAllShadows('.cdc-tools--menu-item').forEach((elem) =>
    elem.remove(),
  );
};

export const injectMenu = () => {
  watchElement({
    // elemSelector: ".fd-info-label__text", // Tenant ID
    elemSelector: '.fd-nested-list__icon.sap-icon--action-settings', // Admin button
    onCreated: () => {
      initMenuExtension();
      console.log('CDC Toolbox Menu - %cLoaded', logStyles.green);
    },
    onRemoved: () => {
      destroyMenuExtension();
      console.log('CDC Toolbox Menu - %cClosed', logStyles.gray);
    },
  });
};
