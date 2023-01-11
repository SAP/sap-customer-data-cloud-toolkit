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
    // cy.wait(30000)

    // //Site creation using Site Deployer with the domain dev.us.e2e_testing
    // cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').contains('Site Deployer').click({ force: true })
    cy.wait(20000)

    // utils.getSiteDomain('e2e_testing', 40000)
    // utils.getDataCenters('US', 'EU', 'AU')
    // utils.getSiteStructure(5).should('have.text', testData.dropdownOption)
    // utils.getCreateButton().click()

    // cy.get('ui5-table-cell').eq(7).click()
    // cy.get('[data-component-name ="ActionSheetMobileContent"]').find('[accessible-name="Delete Item 1 of 1"]').click({ force: true })
    // utils.getSaveButton().click()
    // cy.get('#successPopup').shadow().find('[id="ui5-popup-header"]').should('have.text', 'Success')
    // cy.wait(10000)
    // cy.get('#successPopup').find('[class="DialogMessage-closeButtonStyle-0-2-56 ui5-bar-content"]').click({ force: true })
    // cy.wait(20000)

    // //Navigating to the Site that was created
    // // cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').contains('Site Selector').click({ force: true })
    // // cy.wait(20000)
    // cy.get('main-app')
    //   .shadow()
    //   .find('site-selector-web-app')
    //   .shadow()
    //   .find('[class ="fd-section app__header"]')
    //   .find('[class ="fd-input-group"]')
    //   .find('[placeholder="Search"]')
    //   .type('e2e_testing', { force: true })

    // cy.get('main-app')
    //   .shadow()
    //   .find('[class ="app-area"]')
    //   .find('site-selector-web-app')
    //   .shadow()
    //   .find('[class ="fd-table__body"]')
    //   .find('[class ="fd-link base-domain"]')
    //   .eq(0)
    //   .click({ force: true })
    // cy.wait(10000)

    //Email export and import use cases
    // - Export and import the default files
    // - Import the file with changed locales and compare them
    cy.wait(20000)
    cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').contains('Email Templates').click({ force: true })
    cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').eq(9).click()

    // //Email Templates -  First Use Case
    // //Exporting and Importing the original template
    // cy.get('#exportAllEmailTemplatesButton').click({ force: true })
    // cy.wait(20000)
    // cy.get('#importAllEmailTemplatesButton').click({ force: true })
    // cy.get('#confirmButton').click({ force: true })
    // cy.get('#zipFileInput').selectFile(`${testData.cypressDownloadsPath}${testData.emailErrorExampleFile}`, { force: true })
    // cy.get('#emailsImportPopup').find('[id ="importZipButton"]').click()
    // cy.wait(10000)
    // cy.get('#confirmButton').click({ force: true })
    // cy.wait(10000)
    // cy.get('#successPopup').find('[class ="DialogMessage-closeButtonStyle-0-2-56 ui5-bar-content"]').click({ force: true })
    // cy.wait(20000)
    // cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('fd-card-content').find('[class="fd-popover__control"]').eq(0).click({ force: true })
    // cy.get('.cdk-overlay-container').find('fd-option').eq(4).click()
    // cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('languages-list').find('[class="locales-item__name"]').should('have.length', '44')
    // cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').contains('Email Templates').click({ force: true })

    //Email Templates - Second Use Case
    //Importing the test template with added languages
    // cy.wait(20000)
    cy.get('#importAllEmailTemplatesButton').click({ force: true })
    cy.get('#zipFileInput').attachFile(testData.emailErrorExampleFile)
    cy.get('#emailsImportPopup').find('[id ="importZipButton"]').click()
    cy.get('#confirmButton').click({ force: true })
    cy.wait(10000)
    cy.get('#successPopup').find('[class ="DialogMessage-closeButtonStyle-0-2-56 ui5-bar-content"]').click({ force: true })
    cy.wait(20000)
    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('fd-card-content').find('[class="fd-popover__control"]').eq(0).click({ force: true })
    cy.get('.cdk-overlay-container').find('fd-option').eq(4).click()
    // cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('languages-list').find('[class="locales-item__name"]').should('have.length', '45')

    // //Email Templates - Third Use Case
    // //Validating the error by using a bad userKey
    // cy.wait(10000)
    // cy.get('body').find('#openPopoverButton').click({ force: true })
    // cy.get('#userKey').shadow().find('[class = "ui5-input-inner"]').focus().type('A', { force: true })
    // cy.get('#importAllEmailTemplatesButton').click({ force: true })
    // cy.get('#zipFileInput').attachFile(testData.emailErrorExampleFile, { force: true })
    // cy.get('#emailsImportPopup').find('[id ="importZipButton"]').click()
    // cy.get('#confirmButton').click({ force: true })
    // cy.get('#emailTemplatesErrorPopup').find('[id="messageList"]').find('[data-title="Unauthorized user"]').should('have.text', testData.unauthorizedUser)
    // cy.wait(10000)
    // cy.get('#emailTemplatesErrorPopup').find('[design="Footer"]').find('[class="DialogMessage-closeButtonStyle-0-2-56 ui5-bar-content"]').click({ force: true })
    // cy.get('body').find('#openPopoverButton').click({ force: true })
    // cy.get('#userKey').shadow().find('[class = "ui5-input-inner"]').focus().type('{backspace}')

    // //SMS export and import use cases:
    // // - Export and import the default files
    // // - Import the file with changed locales and compare them
    // cy.wait(10000)
    // cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').contains('SMS Templates').click({ force: true })
    // //SMS Templates - First Use Case
    // //Exporting and Importing the original template
    // cy.get('#exportAllSmsTemplatesButton').click({ force: true })
    // cy.wait(10000)
    // cy.get('#importAllSmsTemplatesButton').click({ force: true })
    // cy.get('#zipFileInput').selectFile('../cdc-tools-chrome-extension/cypress/downloads/cdc-tools-chrome-extension.zip', { force: true })
    // cy.get('#importZipButton').click({ force: true })
    // cy.wait(10000)
    // cy.get('#successPopup').find('[class ="DialogMessage-closeButtonStyle-0-2-56 ui5-bar-content"]').click({ force: true })
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

    // cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="langauge-item"]').should('have.length', '43')
    // //SMS Templates - Second Use Case
    // //Importing and validating the template with new changes
    // cy.get('#importAllSmsTemplatesButton').click({ force: true })
    // cy.get('#zipFileInput').attachFile(testData.smsExampleFile)
    // cy.get('#importZipButton').click({ force: true })
    // cy.wait(10000)
    // cy.get('#successPopup').find('[class ="DialogMessage-closeButtonStyle-0-2-56 ui5-bar-content"]').click({ force: true })
    // cy.wait(20000)
    // cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('button').eq(0).click({ force: true })
    // cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="fd-tabs__item"]').eq(1).click({ force: true })
    // cy.get('main-app')
    //   .shadow()
    //   .find('sms-templates-web-app')
    //   .shadow()
    //   .find('[class="languages_list_container"]')
    //   .find('[role="list"]')
    //   .find('[role="listitem"]')
    //   .find('[class="fd-list__title"]')
    //   .click({ force: true })
    // cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="langauge-item"]').should('have.length', '43')

    // //Delete the site created on this test
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
  })
})
