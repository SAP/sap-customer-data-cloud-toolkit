/* eslint-disable no-undef */
import * as utils from './utils'
import * as dataTest from './dataTest'

describe('All features full Test Suite', () => {
  it('All features tests', () => {
    utils.resizeObserverLoopErrRe()
    cy.visit()

    cy.get('[name ="username"]', { timeout: 10000 }).eq(2).type(Cypress.env('userName'))
    cy.get('[name="password"]').eq(3).type(Cypress.env('passWord'))
    cy.get('[class = "gigya-input-submit"]').eq(8).click()
    cy.wait(30000)

    // Site creation using Site Deployer with the domain dev.us.e2e_testing
    cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').contains(dataTest.siteDeployerIconName).click({ force: true })
    cy.wait(20000)

    utils.getBaseDomain(dataTest.baseDomainName, 40000)
    utils.getSiteStructure(1)
    utils.getDataCenters('US', 'EU', 'AU')
    utils.getCreateButton().click()
    cy.get('ui5-table-row').should('have.length', '6')
    cy.get('ui5-table-row')
      .its('length')
      .then((n) => {
        utils.deleteChildSite(n)
      })

    utils.getSaveButton().click()
    cy.get('#successPopup').shadow().find('[id="ui5-popup-header"]').should('have.text', 'Success')
    cy.wait(10000)
    utils.clickPopUpOkButton('#successPopup')
    cy.wait(30000)

    // Navigating to the Site that was created
    cy.get('main-app')
      .shadow()
      .find('site-selector-web-app')
      .shadow()
      .find('[class ="fd-section app__header"]')
      .find('[class ="fd-input-group"]')
      .find('[placeholder="Search"]')
      .type(dataTest.baseDomainName, { force: true })

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

    // Email export and import use cases
    // - Export and import the default files
    // - Import the file with changed locales and compare them
    cy.wait(20000)
    cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').contains(dataTest.emailTemplatesIconName).click({ force: true })
    cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').eq(9).click()

    // Email Templates -  First Use Case
    // Exporting and Importing the original template
    cy.get('#exportAllEmailTemplatesButton').click({ force: true })
    cy.wait(20000)
    cy.get('#importAllEmailTemplatesButton').click({ force: true })
    cy.get('#confirmButton').click({ force: true })
    cy.get('#zipFileInput').selectFile(`${dataTest.cypressDownloadsPath}${dataTest.emailExampleFile}`, { force: true })
    cy.get('#emailsImportPopup').find('[id ="importZipButton"]').click()
    cy.wait(10000)
    cy.get('#confirmButton').click({ force: true })
    cy.wait(10000)
    cy.get('.show-cdc-tools-app-container').find('#successPopup').find('ui5-bar').find('ui5-button').click({ force: true })
    cy.wait(20000)
    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('fd-card-content').find('[class="fd-popover__control"]').eq(0).click({ force: true })
    cy.get('.cdk-overlay-container').find('fd-option').eq(4).click()
    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('languages-list').find('[class="locales-item__name"]').should('have.length', '44')
    cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').contains(dataTest.emailTemplatesIconName).click({ force: true })

    //Email Templates - Second Use Case
    //Importing the test template with added languages
    cy.wait(20000)
    cy.get('#importAllEmailTemplatesButton').click({ force: true })
    cy.get('#zipFileInput').attachFile(dataTest.emailExampleFile, { force: true })
    cy.get('#emailsImportPopup').find('[id ="importZipButton"]').click()
    cy.get('#confirmButton').click({ force: true })
    cy.wait(10000)
    cy.get('.show-cdc-tools-app-container').find('#successPopup').find('ui5-bar').find('ui5-button').click({ force: true })
    cy.wait(20000)
    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('fd-card-content').find('[class="fd-popover__control"]').eq(0).click({ force: true })
    cy.get('.cdk-overlay-container').find('fd-option').eq(0).click()
    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('languages-list').find('[class="locales-item__name"]').should('have.length', '2')

    // Email Templates - Third Use Case
    // Validating the error by using a bad userKey
    cy.wait(10000)
    cy.get('body').find('#openPopoverButton').click({ force: true })
    cy.get('#userKey').shadow().find('[class = "ui5-input-inner"]').focus().type('A', { force: true })
    cy.get('#importAllEmailTemplatesButton').click({ force: true })
    cy.get('#zipFileInput').attachFile(dataTest.emailExampleFile, { force: true })
    cy.get('#emailsImportPopup').find('[id ="importZipButton"]').click()
    cy.get('#confirmButton').click({ force: true })
    cy.get('#emailTemplatesErrorPopup').find('[id="messageList"]').find('[data-title="Unauthorized user"]').should('have.text', dataTest.unauthorizedUser)
    cy.wait(10000)
    cy.get('#emailTemplatesErrorPopup').find('#closeButton').click({ force: true })
    cy.get('body').find('#openPopoverButton').click({ force: true })
    cy.get('#userKey').shadow().find('[class = "ui5-input-inner"]').focus().type('{backspace}', { force: true })

    //SMS export and import use cases:
    // - Export and import the default files
    // - Import the file with changed locales and compare them
    cy.wait(10000)
    cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').contains(dataTest.smsTemplatesOption).click({ force: true })
    // SMS Templates - First Use Case
    // Exporting and Importing the original template
    cy.get('#exportAllSmsTemplatesButton').click({ force: true })
    cy.wait(10000)
    cy.get('#importAllSmsTemplatesButton').click({ force: true })
    cy.get('#zipFileInput').selectFile(`${dataTest.cypressDownloadsPath}${dataTest.smsExampleFile}`, { force: true })
    cy.get('#importZipButton').click({ force: true })
    cy.wait(10000)
    cy.get('.show-cdc-tools-app-container').find('#successPopup').find('ui5-bar').find('ui5-button').click({ force: true })
    cy.wait(30000)
    cy.get('main-app')
      .shadow()
      .find('sms-templates-web-app')
      .shadow()
      .find('[class="languages_list_container"]')
      .find('[role="list"]')
      .find('[role="listitem"]')
      .find('[class="fd-list__title"]')
      .click({ force: true })

    // SMS Templates - Second Use Case
    // Importing and validating the template with new changes
    cy.get('#importAllSmsTemplatesButton').click({ force: true })
    cy.get('#zipFileInput').attachFile(dataTest.smsExampleFile)
    cy.get('#importZipButton').click({ force: true })
    cy.wait(10000)
    utils.clickPopUpOkButton('#successPopup')
    cy.wait(20000)
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('button').eq(0).click({ force: true })
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="fd-tabs__item"]').eq(1).click({ force: true })
    cy.get('main-app')
      .shadow()
      .find('sms-templates-web-app')
      .shadow()
      .find('[class="languages_list_container"]')
      .find('[role="list"]')
      .find('[role="listitem"]')
      .find('[class="fd-list__title"]')
      .click({ force: true })
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="langauge-item"]').should('have.length', '43')

    // Delete the site created on this test
    cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').contains(dataTest.siteSelectorOption).click({ force: true })
    cy.wait(10000)
    cy.get('main-app')
      .shadow()
      .find('[class ="app-area"]')
      .find('site-selector-web-app')
      .shadow()
      .find('[class ="fd-table__body"]')
      .find('[class="fd-table__cell"]')
      .eq(3)
      .find('sslct-site-actions')
      .find('[class ="fd-popover-custom"]')
      .click()
    cy.get('.delete_menu_item').click({ force: true })
    cy.get('.fd-bar__right').find('fd-dialog-footer-button').eq(1).find('button').click()
    cy.get('.fd-form__control').click()
    cy.get('.fd-bar__right').eq(1).find('button').eq(1).click()
  })
})
