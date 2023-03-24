/* eslint-disable no-undef */
import * as utils from './utils'
import * as dataTest from './dataTest'

describe('All features full Test Suite', () => {
  it('All features tests', () => {
    utils.resizeObserverLoopErrRe()

    loginToGigya(dataTest.gigyaURL)

    // Site creation using Site Deployer with the domain dev.us.e2e_testing
    getSelectedOption(dataTest.siteDeployerIconName)

    testSiteDeployer(dataTest.baseDomainName)
    // // // Navigating to the Site that was created
    navigateToChosenSite(dataTest.baseDomainName)
    // Email export and import use cases
    getSelectedOption(dataTest.emailTemplatesIconName)
    testImportExportEmailTemplatesFirstUseCase()
    testImportExportEmailTemplatesSecondCase()
    testImportExportEmailTemplatesThirdCase()
    // //SMS export and import use cases:
    // // - Export and import the default files
    // // - Import the file with changed locales and compare them

    getSelectedOption(dataTest.smsTemplatesOption)
    testImportExportSmsFirstUseCaseTemplates()
    testImportExportSmsSecondUseCaseTemplates()
    //Copy Web Sdk Testing use Case
    //  - Copy Schema
    //  - Copy Screen Sets
    //  - Copy Policies
    //  - Copy Social Identities
    //  - Copy Email Templates
    //  - Copy Sms Templates
    //  - Copy Dataflows
    //  - Copy Web Sdk
    navigateToChosenSite(dataTest.templateSiteName)
    copyConfigTesting()
    // // // // Navigating to the Site that was altered
    // // // //Change to the desired site and check the changes
    navigateToChosenSite(dataTest.baseDomainName)
    // // // //Change to web sdk and check the changes
    getSelectedOption('Web SDK Configuration')
    cy.get('main-app').shadow().find('web-sdk-configuration-app').shadow().find('web-sdk-configuration-container').find('fd-layout-panel').eq(0).contains(dataTest.webSdkCopyTest)
    // Check email template changes
    getSelectedOption(dataTest.emailTemplatesIconName)
    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('languages-list').find('[class="locales-item__name"]').should('have.length', '5')

     // // // //Check sms template changes
    getSelectedOption(dataTest.smsTemplatesIconName)
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="fd-tabs__item"]').eq(0).should('be.visible')
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="fd-tabs__item"]').eq(0).should('have.text', 'TFA')
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="languages_list_container"]')
        .eq(1).find('[role="list"]')
        .debug()
        .should('have.text', ' Canada / United States (1 languages)  Spain (1 languages)  Portugal (1 languages)  Brazil (1 languages) ')

    // // // // Delete the site created on this test
    getSelectedOption(dataTest.siteSelectorOption)
    deleteSiteCreated()
  })
  function testSiteDeployer(siteDomain) {
    utils.getBaseDomain(siteDomain, 30000)
    utils.getSiteStructure(1, 30000)
    utils.getDataCenters('US', 'EU', 'AU')
    utils.getCreateButton().click()
    cy.get('ui5-table-row').should('have.length', '6')
    cy.get('ui5-table-row')
      .its('length')
      .then((n) => {
        utils.deleteChildSite(n)
      })

    utils.getSaveButton().click()

    cy.get('#successPopup').shadow().find('[id="ui5-popup-header"]').should('have.text', dataTest.successMessageHeader)
    utils.clickPopUpOkButton('#successPopup')
    cy.wait(10000)
  }
  function copyConfigTesting() {
    //Copy Web SDK to desired site
    getSelectedOption(dataTest.copyConfigExtendendMenuOption)

    cy.get('#currentSiteName').should('have.text', dataTest.templateSiteName)
    cy.get('#targetApiKeyInput').shadow().find('[class="ui5-input-inner"]').type('e2e')
    cy.get('ui5-static-area-item').shadow().find('ui5-list').find('ui5-li-suggestion-item').eq(0).click()
    cy.get('#webSdk').click()
    cy.get('#emailTemplates').click()
    cy.get('#smsTemplates').click()
    cy.get('#saveButton').click()
    cy.get('#copyConfigSuccessPopup').shadow().find('[id="ui5-popup-header"]').should('have.text', dataTest.successMessageHeader)

    cy.get('#copyConfigSuccessPopup').find('ui5-bar').find('[id="closeButton"]').click()
    cy.wait(10000)
  }

  function testImportExportEmailTemplatesFirstUseCase() {
    // Email Templates -  First Use Case
    // Exporting and Importing the original template

    cy.get('#exportAllEmailTemplatesButton').click({ force: true })

    cy.get('#importAllEmailTemplatesButton').click({ force: true })
    cy.get('#confirmButton').click({ force: true })
    cy.get('#zipFileInput').selectFile(`${dataTest.cypressDownloadsPath}${dataTest.emailExampleFile}`, { force: true })
    cy.get('#emailsImportPopup').find('[id ="importZipButton"]').click()
    cy.get('#confirmButton').click({ force: true })

    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('fd-card-content').find('[class="fd-popover__control"]').eq(0).click({ force: true })
    cy.get('.cdk-overlay-container').find('fd-option').eq(4).click()
    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('languages-list').find('[class="locales-item__name"]').should('have.length', '44')
    getSelectedOption(dataTest.emailTemplatesIconName)
    utils.clickPopUpOkButton('#successPopup')
    cy.wait(10000)
  }
  function testImportExportEmailTemplatesSecondCase() {
    //Email Templates - Second Use Case
    //Importing the test template with added languages

    cy.get('#importAllEmailTemplatesButton').click({ force: true })
    cy.get('#zipFileInput').attachFile(dataTest.emailExampleFile, { force: true })
    cy.get('#emailsImportPopup').find('[id ="importZipButton"]').click()
    cy.get('#confirmButton').click({ force: true })
    utils.clickPopUpOkButton('#successPopup')
    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('fd-card-content').find('[class="fd-popover__control"]').eq(0).click({ force: true })
    cy.get('.cdk-overlay-container').find('fd-option').eq(0).click()
    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('languages-list').should('be.visible')
    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('languages-list').find('[class="locales-item__name"]').should('have.length', '2')
    cy.wait(10000)
  }
  function testImportExportEmailTemplatesThirdCase() {
    // Email Templates - Third Use Case
    // Validating the error by using a bad userKey

    cy.get('body').find('#openPopoverButton').click({ force: true })
    cy.get('#userKey').shadow().find('[class = "ui5-input-inner"]').focus().type('A', { force: true })
    cy.get('#importAllEmailTemplatesButton').click({ force: true })
    cy.get('#zipFileInput').attachFile(dataTest.emailExampleFile, { force: true })
    cy.get('#emailsImportPopup').find('[id ="importZipButton"]').click()
    cy.get('#confirmButton').click({ force: true })
    cy.get('#emailTemplatesErrorPopup').find('[id="messageList"]').find('[data-title="Unauthorized user"]').should('have.text', dataTest.unauthorizedUser)

    cy.get('#emailTemplatesErrorPopup').should('be.visible')
    cy.get('#emailTemplatesErrorPopup').find('#closeButton').click({ force: true })
    cy.get('body').find('#openPopoverButton').click({ force: true })
    cy.get('#userKey').shadow().find('[class = "ui5-input-inner"]').focus().type('{backspace}', { force: true })
    cy.wait(1000)
    cy.get('body').find('#openPopoverButton').click({ force: true })
    cy.get('#emailTemplatesErrorPopup').find('#closeButton').click({ force: true })
    cy.wait(10000)
  }

  function testImportExportSmsFirstUseCaseTemplates() {
    // SMS Templates - First Use Case
    // Exporting and Importing the original template

    cy.get('#exportAllSmsTemplatesButton').click({ force: true })
    cy.get('#importAllSmsTemplatesButton').click({ force: true })
    cy.get('#zipFileInput').selectFile(`${dataTest.cypressDownloadsPath}${dataTest.smsExampleFile}`, { force: true })
    cy.get('#importZipButton').click({ force: true })
    cy.get('#smsTemplatesErrorPopup').should('be.visible')
    cy.get('#smsTemplatesErrorPopup').find('#closeButton').click({ force: true })
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="fd-tabs__item"]').eq(1).should('be.visible')
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="fd-tabs__item"]').eq(1).should('have.text', 'OTP')
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="fd-tabs__item"]').eq(1).find('a').click({ force: true })
    cy.get('main-app')
      .shadow()
      .find('sms-templates-web-app')
      .shadow()
      .find('[class="languages_list_container"]')
      .find('[role="list"]')
      .find('[role="listitem"]')
      .find('[class="fd-list__title"]')
      .click({ force: true })
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="langauge-item"]').should('have.length', '40')
    cy.wait(10000)
  }
  function testImportExportSmsSecondUseCaseTemplates() {
    // SMS Templates - Second Use Case
    // Importing and validating the template with new changes

    cy.get('#importAllSmsTemplatesButton').click({ force: true })
    cy.get('#zipFileInput').attachFile(dataTest.smsExampleFile)
    cy.get('#importZipButton').click({ force: true })
    cy.get('#smsTemplatesErrorPopup').should('be.visible')
    cy.get('#smsTemplatesErrorPopup').find('#closeButton').click({ force: true })
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('button').eq(0).click({ force: true })
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="fd-tabs__item"]').eq(1).should('be.visible')
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="fd-tabs__item"]').eq(1).should('have.text', 'OTP')
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="fd-tabs__item"]').eq(1).find('a').click({ force: true })
    cy.get('main-app')
      .shadow()
      .find('sms-templates-web-app')
      .shadow()
      .find('[class="languages_list_container"]')
      .find('[role="list"]')
      .find('[role="listitem"]')
      .find('[class="fd-list__title"]')
      .click({ force: true })
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="langauge-item"]').should('have.length', '40')
    cy.wait(10000)
  }

  function navigateToChosenSite(siteName) {
    getSelectedOption(dataTest.siteSelectorOption)
    cy.get('main-app')
      .shadow()
      .find('site-selector-web-app')
      .shadow()
      .find('[class ="fd-section app__header"]')
      .find('[class ="fd-input-group"]')
      .find('[placeholder="Search"]')
      .click()
      .clear({ force: true })
      .type(siteName)

    cy.get('main-app')
      .shadow()
      .find('[class ="app-area"]')
      .find('site-selector-web-app')
      .shadow()
      .find('[class ="fd-table__body"]')
      .find('[class ="fd-link base-domain"]')
      .eq(0)
      .click()
    cy.wait(10000)
  }
  function deleteSiteCreated() {
    getSelectedOption(dataTest.siteSelectorOption)
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
      .find('button')
      .click({ force: true })
    cy.get('.delete_menu_item').click()
    cy.get('.fd-bar__right').find('fd-dialog-footer-button').eq(1).find('button').click()
    cy.get('.fd-form__control').click()
    cy.get('.fd-bar__right').eq(1).find('button').eq(1).click()
  }

  function getSelectedOption(optionName) {
    cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').contains(optionName).click({ force: true })
  }
  function loginToGigya(URL) {
    cy.visit('https://' + URL)

    cy.get('[name ="username"]', { timeout: 10000 }).eq(2).type(Cypress.env('userName'))
    cy.get('[name="password"]').eq(3).type(Cypress.env('passWord'))
    cy.get('[class = "gigya-input-submit"]').eq(8).click()
  }
})
