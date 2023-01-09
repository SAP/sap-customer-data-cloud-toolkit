/* eslint-disable no-undef */
import * as utils from './utils'
import * as testData from './test-data'

describe('All features full Test Suite', () => {
  it('All features tests', () => {
    utils.resizeObserverLoopErrRe()
    cy.visit('http://console.gigya.com')

    cy.get('[name ="username"]', { timeout: 10000 }).eq(2).type(Cypress.env('userName'))
    cy.get('[name="password"]').eq(3).type(Cypress.env('passWord'))
    cy.get('[class = "gigya-input-submit"]').eq(8).click()
    cy.wait(20000)

    //cy.get('main-app').shadow().find('[class ="fd-nested-list__item cdc-tools--menu-item"]').click({ force: true })

    //Site creation using Site Deployer with the domain dev.us.e2e_testing
    cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').contains('Site Deployer').click({ force: true })
    cy.wait(20000)

    utils.getSiteDomain('e2e_testing', 40000)
    utils.getDataCenters('US', 'EU', 'AU')
    utils.getSiteStructure(5).should('have.text', testData.dropdownOption)
    utils.getCreateButton().click()

    cy.get('ui5-table-cell').eq(7).click()
    cy.get('[data-component-name ="ActionSheetMobileContent"]').find('[accessible-name="Delete Item 1 of 1"]').click({ force: true })
    utils.getSaveButton().click()
    cy.get('#successPopup').shadow().find('[id="ui5-popup-header"]').should('have.text', 'Success')
    cy.get('#successPopup').find('[class="DialogMessage-closeButtonStyle-0-2-56 ui5-bar-content"]').click({ force: true })
    cy.wait(20000)

    //Navigating to the Site that was created
    cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').contains('Site Selector').click({ force: true })
    cy.wait(20000)
    cy.get('main-app')
      .shadow()
      .find('site-selector-web-app')
      .shadow()
      .find('[class ="fd-section app__header"]')
      .find('[class ="fd-input-group"]')
      .find('[placeholder="Search"]')
      .type('e2e_testing', { force: true })

    cy.get('main-app')
      .shadow()
      .find('[class ="app-area"]')
      .find('site-selector-web-app')
      .shadow()
      .find('[class ="fd-table__body"]')
      .find('[class ="fd-link base-domain"]')
      .eq(0)
      .click({ force: true })
    cy.wait(10000)

    //Email export and import use cases
    // - Export and import the default files
    // - Import the file with changed locales and compare them
    // cy.wait(20000)
    // cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').contains('Email Templates').click({ force: true })
    // cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').eq(9).click()

    // cy.get('#exportAllEmailTemplatesButton').click({ force: true })
    // cy.wait(20000)
    // cy.get('#importAllEmailTemplatesButton').click({ force: true })
    // cy.get('#zipFileInput').selectFile('../cdc-tools-chrome-extension/cypress/downloads/cdc-tools-chrome-email-extension.zip', { force: true })
    // cy.get('#emailsImportPopup').find('[id ="importZipButton"]').click()
    // cy.wait(10000)
    // cy.get('#successPopup').find('[class ="DialogMessage-closeButtonStyle-0-2-56 ui5-bar-content"]').click({ force: true })
    // cy.wait(20000)
    // cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('languages-list').should('have.length', '1')
    // cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').contains('Flow Builder').click({ force: true })
    // cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').contains('Email Templates').click({ force: true })

    // cy.wait(20000)
    // cy.get('#importAllEmailTemplatesButton').click({ force: true })
    // cy.get('#zipFileInput').attachFile('cdc-tools-email-import.zip', { force: true })
    // cy.get('#emailsImportPopup').find('[id ="importZipButton"]').click()
    // cy.get('#successPopup').find('[class ="DialogMessage-closeButtonStyle-0-2-56 ui5-bar-content"]').click({ force: true })
    // cy.wait(20000)
    // cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('languages-list').find('[class = "locales-item"]').should('have.text', 'BG')
    // cy.wait(10000)

    // cy.wait(20000)

    //SMS export and import use cases:
    // - Export and import the default files
    // - Import the file with changed locales and compare them

    // cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').contains('SMS Templates').click({ force: true })
    // cy.get('#exportAllSmsTemplatesButton').click({ force: true })
    // cy.wait(10000)
    // cy.get('#importAllSmsTemplatesButton').click({ force: true })
    // cy.get('#zipFileInput').selectFile('../cdc-tools-chrome-extension/cypress/downloads/cdc-tools-chrome-extension.zip', { force: true })
    // cy.get('#importZipButton').click({ force: true })
    // cy.get('#successPopup > ui5-bar > .DialogMessage-closeButtonStyle-0-2-56').click({ force: true })
    // cy.wait(20000)
    // cy.get('main-app')
    //   .shadow()
    //   .find('sms-templates-web-app')
    //   .shadow()
    //   .find('[class="languages_list_container"]')
    //   .find('[role="list"]')
    //   .find('[role="listitem"]')
    //   .find('[class="fd-list__title"]')
    //   .click({ force: true })

    // cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="langauge-item"]').should('have.length', '31')
    // cy.get('#importAllSmsTemplatesButton').click({ force: true })
    // cy.get('#zipFileInput').attachFile(testData.smsExampleFile)
    // cy.get('#importZipButton').click({ force: true })
    // cy.get('#successPopup > ui5-bar > .DialogMessage-closeButtonStyle-0-2-56').click({ force: true })
    // cy.wait(20000)
    // cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('button').eq(0).click()
    // cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="fd-tabs__item"]').eq(1).click()
    // cy.get('main-app')
    //   .shadow()
    //   .find('sms-templates-web-app')
    //   .shadow()
    //   .find('[class="languages_list_container"]')
    //   .find('[role="list"]')
    //   .find('[role="listitem"]')
    //   .find('[class="fd-list__title"]')
    //   .click({ force: true })
    // cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="langauge-item"]').should('have.length', '21')

    //Delete the site created on this test
    // cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').contains('Site Selector').click({ force: true })
    // cy.wait(10000)
    // cy.get('main-app')
    //   .shadow()
    //   .find('site-selector-web-app')
    //   .shadow()
    //   .find('[class ="fd-section app__header"]')
    //   .find('[class ="fd-input-group"]')
    //   .find('[placeholder="Search"]')
    //   .type('e2e_testing', { force: true })
    // cy.wait(10000)
    // cy.get('main-app').shadow().find('[class ="app-area"]').find('site-selector-web-app').shadow().find('[class ="fd-table__body"]').find('[id="fd-popover-56"]').click()
    // cy.get('.fd-list > :nth-child(6)').click()
    // cy.get('.fd-bar__right > :nth-child(2) > .fd-button').click()
    // cy.get('.fd-form__control').click()
    // cy.get('.fd-bar__right > :nth-child(2) > .fd-button').click()

    // cy.get('main-app').shadow().find('site-selector-web-app').shadow().find('fd-popover')
    // cy.get('main-app').shadow().find('site-selector-web-app').shadow().find('fd-popover')
  })
})
