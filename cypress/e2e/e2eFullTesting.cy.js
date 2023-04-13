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
    // Navigating to the Site that was created
    navigateToChosenSite(dataTest.baseDomainName)

    // Email export and import use cases
    getSelectedOption(dataTest.emailTemplatesIconName)
    testImportExportEmailTemplatesFirstUseCase()
    testImportExportEmailTemplatesSecondCase()
    testImportExportEmailTemplatesThirdCase()

    //SMS export and import use cases:
    // - Export and import the default files
    // - Import the file with changed locales and compare them
    getSelectedOption(dataTest.smsTemplatesOption)
    testImportExportSmsFirstUseCaseTemplates()
    testImportExportSmsSecondUseCaseTemplates()

    //Copy configurations to test site
    navigateToChosenSite(dataTest.templateSiteName)
    const targetSites = [dataTest.targetSiteDomainName, dataTest.target2SiteDomainName]
    copyConfigTesting(targetSites)

    // Navigating to the Site that was altered
    //Change to the desired site and check the changes
    navigateToChosenSite(dataTest.baseDomainName)
    targetSites.forEach(validateChanges)

    // Delete the site created on this test
    getSelectedOption(dataTest.siteSelectorOption)
    deleteSiteCreated()
    navigateToChosenSite(dataTest.templateSiteName)

    //Site deployer Copy Config
    getSelectedOption(dataTest.siteDeployerIconName)
    createSiteAndCopyConfig(dataTest.baseDomainName)
    navigateToChosenSite(dataTest.baseDomainName)
    validateChanges()
    deleteSiteCreated()
  })

  function createSiteAndCopyConfig(siteDomain) {
    utils.getBaseDomain(siteDomain, 30000)
    utils.getSiteStructure(1, 30000)
    utils.getDataCenters('US', 'EU', 'AU')
    utils.getCreateButton().click()
    cy.get('ui5-table-row').should('have.length', '6')
    cy.get('ui5-table-row')
      .its('length')
      .then((n) => {
        cy.log(n)
        utils.deleteChildSite(n)
      })

    cy.get('ui5-table-row').find('#addSiteConfigButton').eq(0).click()

    cy.get('#siteCopyConfigurationDialog').find('div > ui5-input').shadow().find('div > input').focus().type(dataTest.templateSiteName)
    cy.get('#siteCopyConfigurationDialog').find('div > ui5-input').shadow().find('div > input').focus().type('{enter}')
    cy.get('#selectAllCheckbox').click()
    cy.get('#confirmButton').click()

    utils.getSaveButton().click()

    cy.waitUntil(() => cy.get('#successPopup').then((win) => cy.get(win).should('be.visible')))

    cy.get('#successPopup').shadow().find('[id="ui5-popup-header"]').should('have.text', dataTest.successMessageHeader)
    utils.clickPopUpOkButton('#successPopup')
  }
  function testSiteDeployer(siteDomain) {
    utils.getBaseDomain(siteDomain, 30000)
    utils.getSiteStructure(1, 30000)
    utils.getDataCenters('US', 'EU', 'AU')
    utils.getCreateButton().click()
    cy.get('ui5-table-row').should('have.length', '6')
    cy.get('ui5-table-row')
      .its('length')
      .then((n) => {
        cy.log(n)
        utils.deleteChildSite(n)
      })

    utils.getSaveButton().click()

    cy.waitUntil(() => cy.get('#successPopup').then((win) => cy.get(win).should('be.visible')))

    cy.get('#successPopup').shadow().find('[id="ui5-popup-header"]').should('have.text', dataTest.successMessageHeader)
    utils.clickPopUpOkButton('#successPopup')
  }
  function copyConfigTesting(targetSites) {
    getSelectedOption(dataTest.copyConfigExtendendMenuOption)

    cy.get('#currentSiteName').should('have.text', dataTest.templateSiteName)
    targetSites.forEach(addSiteToTargetList)
    cy.get('ui5-list').find('ui5-li-custom').should('have.length', targetSites.length)
    cy.get('#selectAllCheckbox').click()

    cy.get('#copyConfigExtendedSaveButton').click()
    cy.waitUntil(() => cy.get('#copyConfigSuccessPopup').then((win) => cy.get(win).should('be.visible')))

    cy.get('#copyConfigSuccessPopup').shadow().find('[id="ui5-popup-header"]').should('have.text', dataTest.successMessageHeader)

    cy.get('#copyConfigSuccessPopup').find('ui5-bar').find('[id="closeButton"]').click()
  }
  function addSiteToTargetList(target) {
    cy.get('#currentSiteName').click()
    cy.waitUntil(() =>
      cy
        .get('#copyConfigurationExtendedSearchSitesInputCard')
        .find('[id="apiKeyInput"]')
        .shadow()
        .find('[class="ui5-input-inner"]')
        .then((win) => cy.get(win).should('not.have.attr', 'disabled').get(win).type(target))
    )

    cy.get('#copyConfigurationExtendedSearchSitesInputCard').find('[id="apiKeyInput"]').shadow().find('[class="ui5-input-inner"]').should('have.value', target)
    cy.get('ui5-static-area-item').shadow().find('ui5-list').find('ui5-li-suggestion-item').eq(0).should('contain.text', target)
    cy.get('ui5-static-area-item').shadow().find('ui5-list').find('ui5-li-suggestion-item').eq(0).click()
  }

  function testImportExportEmailTemplatesFirstUseCase() {
    // Email Templates -  First Use Case
    // Exporting and Importing the original template

    cy.waitUntil(() => cy.get('#exportAllEmailTemplatesButton').then((win) => cy.get(win).should('be.visible')))
    cy.get('#exportAllEmailTemplatesButton').click({ force: true })

    cy.get('#importAllEmailTemplatesButton').click({ force: true })
    cy.waitUntil(() => cy.get('#emailsImportPopup').then((win) => cy.get(win).should('be.visible')))

    cy.get('#zipFileInput').selectFile(`${dataTest.cypressDownloadsPath}${dataTest.emailExampleFile}`, { force: true })
    cy.get('#emailsImportPopup').find('[id ="importZipButton"]').click()
    cy.get('#confirmButton').click({ force: true })
    cy.waitUntil(() => cy.get('#emailTemplatesValidationErrorPopup').then((win) => cy.get(win).should('be.visible').find('[id="confirmButton"]').click()))
    cy.waitUntil(() =>
      cy
        .get('.App')

        .find('[id="successPopup"]')
        .eq(1)
        .then((win) => cy.get(win).should('be.visible').find('ui5-bar > ui5-button').click())
    )

    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('fd-card-content').find('[class="fd-popover__control"]').eq(0).click({ force: true })
    cy.get('.cdk-overlay-container').find('fd-option').eq(4).click()
    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('languages-list').find('[class="locales-item__name"]').should('have.length', '44')
    cy.waitUntil(() => cy.get('#exportAllEmailTemplatesButton').then((win) => cy.get(win).should('be.visible')))
  }
  function testImportExportEmailTemplatesSecondCase() {
    //Email Templates - Second Use Case
    //Importing the test template with added languages

    cy.get('#importAllEmailTemplatesButton').click({ force: true })
    cy.waitUntil(() => cy.get('#emailsImportPopup').then((win) => cy.get(win).should('be.visible')))

    cy.get('#zipFileInput').attachFile(dataTest.emailExampleFile, { force: true })
    cy.get('#emailsImportPopup').find('[id ="importZipButton"]').click()
    cy.get('#confirmButton').click({ force: true })

    cy.get('#emailTemplatesValidationErrorPopup').find('#confirmButton').click({ force: true })
    cy.waitUntil(() =>
      cy
        .get('.App')
        .find('[id="successPopup"]')
        .eq(1)
        .then((win) => cy.get(win).should('be.visible').find('ui5-bar > ui5-button').click())
    )

    cy.waitUntil(() =>
      cy
        .get('main-app')
        .shadow()
        .find('email-templates-web-app')
        .then((win) => cy.get(win).should('be.visible'))
    )

    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('fd-card-content').find('[class="fd-popover__control"]').eq(0).click({ force: true })
    cy.waitUntil(() =>
      cy
        .get('.cdk-overlay-container')
        .find('fd-option')
        .then((win) => cy.get(win).should('be.visible'))
    )
    cy.get('.cdk-overlay-container').find('fd-option').eq(0).click()
    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('languages-list').should('be.visible')
    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('languages-list').find('[class="locales-item__name"]').should('have.length', '2')
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
    cy.waitUntil(() => cy.get('#credentialsResponsivePopover').then((win) => cy.get(win).should('be.visible')))

    cy.get('#userKey').shadow().find('[class = "ui5-input-inner"]').focus().type('{backspace}', { force: true })
    cy.get('#emailTemplatesErrorPopup').find('#closeButton').click({ force: true })
    cy.get('body').find('#openPopoverButton').click({ force: true })
  }

  function testImportExportSmsFirstUseCaseTemplates() {
    // SMS Templates - First Use Case
    // Exporting and Importing the original template
    cy.waitUntil(() => cy.get('#exportAllSmsTemplatesButton').then((win) => cy.get(win).should('be.visible')))

    cy.get('#exportAllSmsTemplatesButton').click({ force: true })
    cy.get('#importAllSmsTemplatesButton').click({ force: true })
    cy.get('#zipFileInput').selectFile(`${dataTest.cypressDownloadsPath}${dataTest.smsExampleFile}`, { force: true })
    cy.get('#importZipButton').click({ force: true })
    cy.get('.show-cdc-tools-app-container > #successPopup').should('be.visible')
    cy.get('.show-cdc-tools-app-container > #successPopup').find('#closeButton').click({ force: true })
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
  }

  function testImportExportSmsSecondUseCaseTemplates() {
    // SMS Templates - Second Use Case
    // Importing and validating the template with new changes
    getSelectedOption(dataTest.smsTemplatesOption)
    cy.get('#importAllSmsTemplatesButton').click({ force: true })
    cy.waitUntil(() => cy.get('#smsImportPopup').then((win) => cy.get(win).should('be.visible')))
    cy.get('#zipFileInput').attachFile(dataTest.smsExampleFile)
    cy.get('#importZipButton').click({ force: true })
    cy.get('.show-cdc-tools-app-container > #successPopup').should('be.visible')
    cy.get('.show-cdc-tools-app-container > #successPopup').find('#closeButton').click({ force: true })
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
  }

  function navigateToChosenSite(siteName) {
    getSelectedOption(dataTest.siteSelectorOption)

    cy.waitUntil(() =>
      cy
        .get('main-app')
        .shadow()
        .find('site-selector-web-app')
        .shadow()
        .find('[class ="fd-section app__header"]')
        .find('[class ="fd-input-group"]')
        .find('[placeholder="Search"]')
        .then((input) => cy.get(input).should('not.be.disabled').clear().focus().type(siteName))
    )
    cy.get('main-app').shadow().find('[class ="app-area"]').find('site-selector-web-app').shadow().find('[class ="fd-table__body"]').find('td').find('a').eq(0).click()
    cy.wait(5000)
  }

  function deleteSiteCreated() {
    getSelectedOption(dataTest.siteSelectorOption)
    //delete child
    cy.get('main-app')
      .shadow()
      .find('[class ="app-area"]')
      .find('site-selector-web-app')
      .shadow()
      .find('sslct-site-actions')
      .eq(1)
      .find('fd-popover-control')
      .find('button')
      .realClick()

    cy.get('.fd-popover__popper').find('ul > li').get('.delete_menu_item').realClick()
    cy.get('.fd-bar__right').find('fd-dialog-footer-button').eq(1).find('button').realClick()
    cy.get('.fd-form__control').realClick()
    cy.get('.fd-bar__right').eq(1).find('button').eq(1).realClick()

    //delete parent
    cy.get('main-app')
      .shadow()
      .find('[class ="app-area"]')
      .find('site-selector-web-app')
      .shadow()
      .find('sslct-site-actions')
      .eq(0)
      .find('fd-popover-control')
      .find('button')
      .realClick()

    cy.get('.fd-popover__popper').find('ul > li').get('.delete_menu_item').realClick()
    cy.get('.fd-bar__right').find('fd-dialog-footer-button').eq(1).find('button').realClick()
    cy.get('.fd-form__control').realClick()
    cy.get('.fd-bar__right').eq(1).realClick('button').eq(1).realClick()
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

  function validateChanges() {
    //Copy Web Sdk Testing use Case
    //  - Copy Schema
    //  - Copy Screen Sets
    //  - Copy Policies
    //  - Copy Social Identities
    //  - Copy Email Templates
    //  - Copy Sms Templates
    //  - Copy Dataflows
    //  - Copy Web Sdk

    //Check Schema Options
    checkSAccountsSchema()
    // Check email template changes
    checkEmailTemplates()
    // Check sms template changes
    checkSmsTemplates()
    // Change to web sdk and check the changes
    checkWebSdk()
    // Check if identity Providers where copied successfully
    checkSocial()
    // checkScreenSets()
  }

  function checkWebSdk() {
    getSelectedOption(dataTest.webSDKConfiguration)
    cy.get('main-app').shadow().find('web-sdk-configuration-app').shadow().find('web-sdk-configuration-container').find('fd-layout-panel').eq(0).contains(dataTest.webSdkCopyTest)
  }

  function checkEmailTemplates() {
    getSelectedOption(dataTest.emailTemplatesIconName)
    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('languages-list').find('[class="locales-item__name"]').should('have.length', '6')
  }

  function checkSmsTemplates() {
    getSelectedOption(dataTest.smsTemplatesIconName)
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="fd-tabs__item"]').eq(0).should('be.visible')
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="fd-tabs__item"]').eq(0).should('have.text', 'TFA')
    cy.get('main-app')
      .shadow()
      .find('sms-templates-web-app')
      .shadow()
      .find('[class="languages_list_container"]')
      .eq(1)
      .find('[role="list"]')
      .should('have.text', dataTest.templateSiteNameSmsTemplatesContent)
  }

  function checkSAccountsSchema() {
    getSelectedOption(dataTest.accountsSchemaOption)
    cy.get('main-app')
      .shadow()
      .find('schema-editor-web-app')
      .shadow()
      .find('fd-layout-panel-body')
      .find('[class="fd-tree__row"]')
      .eq(1)
      .should('have.text', dataTest.schemadataTestFieldOne)
    cy.get('main-app')
      .shadow()
      .find('schema-editor-web-app')
      .shadow()
      .find('fd-layout-panel-body')
      .find('[class="fd-tree__row"]')
      .eq(2)
      .should('have.text', dataTest.schemadataTestFieldTwo)
  }

  function checkSocial() {
    getSelectedOption(dataTest.identityConnectOption)
    cy.get('main-app').shadow().find('connect-app').shadow().find('nav').find('[class="fd-tabs__item identity-providers-tab"]').click()
    cy.get('main-app').shadow().find('connect-app').shadow().find('[class="fd-row"]').should('have.length', 3)
  }

  function checkScreenSets() {
    getSelectedOption('UI Builder')
  }
})
