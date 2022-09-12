const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(
  path.resolve(__dirname, '../../public/index.html'),
  'utf8',
);
jest.dontMock('fs');

const { getInnerText, htmlToElem } = require('./utils');
const {
  menuElements,
  initMenuExtension,
  destroyMenuExtension,
  injectMenu,
} = require('./injectMenu');

const adminButtonMock = `\
<a fd-nested-list-link="" href="#/99999999/4_AAAAAAAAAAAAAAAAAAAAAA/system-status"\
  tabindex="0" class="fd-nested-list__link"><span fd-nested-list-icon=""\
    class="fd-nested-list__icon sap-icon--action-settings" role="presentation"></span>\
  <span fd-nested-list-title="" class="fd-nested-list__title">Administration</span>\
</a>`;

it('Objects in menuElements should have an incrementing index variable inside html() method, starting with 0', () => {
  menuElements.forEach(({ html }, index) => {
    const button = htmlToElem(html());
    expect(+button.getAttribute('data-cdc-toolbox-index')).toBe(index);
  });
});

it('Objects in menuElements should have a property appendAfterText with a value that exists in the text format on the original GIGYA navigation', () => {
  document.documentElement.innerHTML = html.toString();
  const menuButtonsDOM = document.querySelectorAll('li .fd-nested-list__title');

  menuElements.forEach((el) => {
    const buttonsFound = [...menuButtonsDOM].filter((domElement) =>
      getInnerText(domElement).includes(el.appendAfterText),
    );

    expect(getInnerText(buttonsFound[0])).toEqual(
      expect.stringContaining(el.appendAfterText),
    );
  });
});

it('CDC Toolbox menu buttons are injected to the DOM', () => {
  document.documentElement.innerHTML = html.toString();

  initMenuExtension();

  const menuButtonsDOM = document.querySelectorAll('li .fd-nested-list__title');

  menuElements.forEach((el) => {
    const buttonsFound = [...menuButtonsDOM].filter((domElement) =>
      getInnerText(domElement).includes(el.name),
    );

    expect(getInnerText(buttonsFound[0])).toEqual(
      expect.stringContaining(el.name),
    );
  });
});

it('CDC Toolbox menu buttons are removed from the DOM', () => {
  document.documentElement.innerHTML = html.toString();
  initMenuExtension();
  destroyMenuExtension();
  const injectedButtons = document.querySelectorAll('.cdc-tools--menu-item');
  expect(injectedButtons.length).toBe(0);
});

jest.useFakeTimers();

it('CDC Toolbox menu buttons injected when Admin Button exists and removed when it desappears', () => {
  document.documentElement.innerHTML = html.toString();

  let injectedButtons, adminButton, adminButtonParent;

  injectedButtons = document.querySelectorAll('.cdc-tools--menu-item');
  expect(injectedButtons.length).toBe(0);

  injectMenu();
  injectedButtons = document.querySelectorAll('.cdc-tools--menu-item');
  expect(injectedButtons.length).toBe(menuElements.length);

  // Remove admin button, the injected buttons should be removed
  adminButton = document.querySelector(
    '.fd-nested-list__icon.sap-icon--action-settings',
  ).parentNode;
  adminButtonParent = adminButton.parentNode;
  adminButton.remove();
  jest.runOnlyPendingTimers();

  injectedButtons = document.querySelectorAll('.cdc-tools--menu-item');
  expect(injectedButtons.length).toBe(0);

  // Adding again the admin button, the buttons should be injected
  adminButtonParent.appendChild(htmlToElem(adminButtonMock));
  jest.runOnlyPendingTimers();

  injectedButtons = document.querySelectorAll('.cdc-tools--menu-item');
  expect(injectedButtons.length).toBe(menuElements.length);
});
