/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

/* eslint-disable no-undef */
import * as dataTest from './dataTest'
import * as utils from './utils'

describe('All features full Test Suite', () => {
  it('All features tests', () => {
    utils.resizeObserverLoopErrRe()

    loginToGigya(dataTest.gigyaURL)
    cy.get('#automated-usage-tracking-tool-dialog-confirm-button').click()
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

    // SMS export and import use cases:
    // - Export and import the default files
    // - Import the file with changed locales and compare them
    getSelectedOption(dataTest.smsTemplatesOption)
    testImportExportSmsFirstUseCaseTemplates()
    testImportExportSmsSecondUseCaseTemplates()

    // Copy configurations to test site
    navigateToChosenSite(dataTest.templateSiteName)
    const targetSites = [dataTest.targetSiteDomainName, dataTest.target2SiteDomainName]
    copyConfigTesting(targetSites)

    // Navigating to the Site that was altered
    // Change to the desired site and check the changes
    targetSites.forEach(validateChanges)
    // Delete the site created on this test
    getSelectedOption(dataTest.siteSelectorOption)
    deleteSiteCreated()
    navigateToChosenSite(dataTest.templateSiteName)

    // Site deployer Copy Config
    getSelectedOption(dataTest.siteDeployerIconName)
    createSiteAndCopyConfig(dataTest.baseDomainName, dataTest.childOfBaseDomainName)
    validateChanges(dataTest.baseDomainName, false)
    validateChanges(dataTest.childOfBaseDomainName, true)
    navigateToChosenSite(dataTest.baseDomainName)
    deleteSiteCreated()

    cy.run('versionControl.cy.js')
  })

  function createSiteAndCopyConfig(pareSiteDomain, childSiteDomain) {
    // Add parent site
    cy.get('#addParentButton').click()
    cy.get('#baseDomainInput').shadow().find('[class = "ui5-input-inner"]').type(pareSiteDomain).should('have.value', pareSiteDomain)
    cy.get('#descriptionInput').shadow().find('[class = "ui5-input-inner"]').type(pareSiteDomain).should('have.value', pareSiteDomain)
    cy.get('#dataCenterSelect').click()
    cy.get('ui5-static-area-item').shadow().find('.ui5-select-popover').eq(1).find('ui5-li').eq(2).click()
    // add copy config to parent
    addCopyConfigFrom(dataTest.templateSiteName)
    // add child
    cy.get('[data-cy="parentRowActionSheetOpener"]').click()
    cy.get('[data-cy="createChildSiteAction"]').click()
    cy.get('#childBaseDomainInput').shadow().find('[class = "ui5-input-inner"]').type(childSiteDomain).should('have.value', childSiteDomain)
    cy.get('#childDescriptionInput').shadow().find('[class = "ui5-input-inner"]').type(childSiteDomain).should('have.value', childSiteDomain)
    // add copy config to child
    addCopyConfigFrom(dataTest.templateSiteName)
    utils.getSaveButton().click()
    cy.waitUntil(() => cy.get('#successPopup').then((win) => cy.get(win).should('be.visible')))
    cy.get('#successPopup').shadow().find('[id="ui5-popup-header"]').should('have.text', dataTest.successMessageHeader)
    cy.get('#successPopup').find('ui5-bar').find('[id="closeButton"]').click()
  }

  function addCopyConfigFrom(templateSiteName) {
    cy.get('[data-cy="addSiteConfigButton"]').click()
    cy.get('input').first().focus()
    cy.get('[data-cy="apiKeyInput"]').eq(0).shadow().find('[class="ui5-input-inner"]').type('4_6Tv6z8O6NmUO_BZoHcXIRw')
    cy.get('[data-cy="apiKeyInput"]').eq(0).shadow().find('[class="ui5-input-inner"]').should('have.value', '4_6Tv6z8O6NmUO_BZoHcXIRw')
    cy.get('[data-cy="addTargetSiteButton"]').shadow().find('button')
    cy.get('ui5-static-area-item').shadow().find('ui5-list').find('ui5-li-suggestion-item').eq(0).should('contain.text', templateSiteName)
    cy.get('ui5-static-area-item').shadow().find('ui5-list').find('ui5-li-suggestion-item').eq(0).click()
    cy.get('ui5-list').find('ui5-li-custom').should('have.length', 1)
    cy.get('[data-cy ="selectAllCheckbox"]').click()
    cy.get('[data-cy ="confirmButton"]').click()
  }

  function testSiteDeployer(siteDomain) {
    utils.getBaseDomain(siteDomain, 30000)
    utils.getSiteStructure(1, 30000)
    utils.getDataCenters('US', 'EU', 'AU')
    utils.getCreateButton().click()
    cy.get('ui5-table-row').should('have.length', '6')
    utils.deleteChildSite(0)
    utils.deleteChildSite(0)
    utils.getSaveButton().click()
    cy.waitUntil(() => cy.get('[data-cy ="siteDeployersuccessPopup"]').then((win) => cy.get(win).should('be.visible')))
    cy.get('[data-cy ="siteDeployersuccessPopup"]').shadow().find('[id="ui5-popup-header"]').should('have.text', dataTest.successMessageHeader)
    utils.clickPopUpOkButton('siteDeployersuccessPopup')
  }
  function copyConfigTesting(targetSites) {
    getSelectedOption(dataTest.copyConfigExtendendMenuOption)
    cy.get('[data-cy ="currentSiteName"]')
    cy.get('[data-cy ="currentSiteName"]').should('have.text', dataTest.templateSiteName)
    targetSites.forEach(addSiteToTargetList)
    cy.get('ui5-list').find('ui5-li-custom').should('have.length', targetSites.length)
    cy.get('[data-cy ="selectAllCheckbox"]').click()
    cy.get('[data-cy ="copyConfigExtendedSaveButton"]').click()
    cy.waitUntil(() => cy.get('[data-cy ="copyConfigSuccessPopup"]').then((win) => cy.get(win).should('be.visible')))
    cy.get('[data-cy ="copyConfigSuccessPopup"]').shadow().find('[id="ui5-popup-header"]').should('have.text', dataTest.successMessageHeader)
    cy.get('[data-cy ="copyConfigSuccessPopup"]').find('ui5-bar').find('[id="closeButton"]').click()
  }

  function addSiteToTargetList(target) {
    cy.get('[data-cy ="currentSiteName"]').click()
    cy.waitUntil(() =>
      cy
        .get('[data-cy ="copyConfigurationExtendedSearchSitesInputCard"]')
        .find('[id="apiKeyInput"]')
        .shadow()
        .find('[class="ui5-input-inner"]')
        .then((win) => cy.get(win).should('not.have.attr', 'disabled').get(win).type(target)),
    )
    cy.get('[data-cy ="copyConfigurationExtendedSearchSitesInputCard"]').find('[id="apiKeyInput"]').shadow().find('[class="ui5-input-inner"]').should('have.value', target)
    cy.get('ui5-static-area-item').shadow().find('ui5-list').find('ui5-li-suggestion-item').eq(0).should('contain.text', target)
    cy.get('ui5-static-area-item').shadow().find('ui5-list').find('ui5-li-suggestion-item').eq(0).click()
  }

  function testImportExportEmailTemplatesFirstUseCase() {
    // Email Templates -  First Use Case
    // Exporting and Importing the original template

    cy.waitUntil(() => cy.get('[data-cy ="exportAllEmailTemplatesButton"]').then((win) => cy.get(win).should('be.visible')))
    cy.get('[data-cy ="exportAllEmailTemplatesButton"]').realClick()
    cy.get('[data-cy ="importAllEmailTemplatesButton"]').realClick()
    cy.waitUntil(() => cy.get('[data-cy ="importPopup"]').then((win) => cy.get(win).should('be.visible')))
    cy.get('[data-cy ="zipFileInput"]').selectFile(`${dataTest.cypressDownloadsPath}${dataTest.emailExampleFile}`, { force: true })
    cy.get('[data-cy ="importPopup"]').find('[data-cy ="importZipButton"]').click()
    cy.get('[data-cy ="dialogMessageConfirmConfirmButton"]').realClick()
    cy.waitUntil(() => cy.get('#emailTemplatesValidationErrorPopup').then((win) => cy.get(win).should('be.visible').find('[id="confirmButton"]').click()))
    cy.waitUntil(() =>
      cy
        .get('[data-cy ="emailSuccessPopup"]')

        .then((win) => cy.get(win).should('be.visible').find('ui5-bar > ui5-button').click()),
    )
    cy.waitUntil(() =>
      cy
        .get('main-app')
        .shadow()
        .find('email-templates-web-app')
        .shadow()
        .find('fd-card-header')
        .find('[class="fd-card__title-area"]')
        .find('h2')
        .then((win) => cy.get(win).should('have.text', 'Templates')),
    )
    cy.waitUntil(() =>
      cy
        .get('main-app')
        .shadow()
        .find('email-templates-web-app')
        .shadow()
        .find('fd-card-content')
        .find('fd-select')

        .then((win) => cy.get(win).should('be.visible').get(win).click()),
    )
    cy.get('.cdk-overlay-container').find('fd-option').eq(4).click()
    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('languages-list').find('[class="locales-item__name"]').should('have.length', '44')
    cy.waitUntil(() => cy.get('[data-cy ="exportAllEmailTemplatesButton"]').then((win) => cy.get(win).should('be.visible')))
  }
  function testImportExportEmailTemplatesSecondCase() {
    //Email Templates - Second Use Case
    //Importing the test template with added languages
    cy.get('[data-cy ="importAllEmailTemplatesButton"]').realClick()
    cy.waitUntil(() => cy.get('[data-cy ="importPopup"]').then((win) => cy.get(win).should('be.visible')))
    cy.get('[data-cy ="zipFileInput"]').attachFile(dataTest.emailExampleFile, { force: true })
    cy.get('[data-cy ="importPopup"]').find('[data-cy ="importZipButton"]').click()
    cy.get('[data-cy ="dialogMessageConfirmConfirmButton"]').realClick()
    cy.get('#emailTemplatesValidationErrorPopup').find('#confirmButton').realClick()
    cy.waitUntil(() =>
      cy
        .get('[data-cy ="emailSuccessPopup"]')

        .then((win) => cy.get(win).should('be.visible').find('ui5-bar > ui5-button').click()),
    )
    cy.waitUntil(() =>
      cy
        .get('main-app')
        .shadow()
        .find('email-templates-web-app')
        .shadow()
        .find('fd-card-header')
        .find('[class="fd-card__title-area"]')
        .find('h2')
        .then((win) => cy.get(win).should('have.text', 'Templates')),
    )
    cy.waitUntil(() =>
      cy
        .get('main-app')
        .shadow()
        .find('email-templates-web-app')
        .shadow()
        .find('fd-card-content')
        .find('fd-select')

        .then((win) => cy.get(win).should('be.visible').get(win).click()),
    )
    cy.get('.cdk-overlay-container').find('fd-option').eq(4).click()
    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('languages-list').should('be.visible')
    cy.get('main-app').shadow().find('email-templates-web-app').shadow().find('languages-list').find('[class="locales-item__name"]').should('have.length', '44')
  }
  function testImportExportEmailTemplatesThirdCase() {
    // Email Templates - Third Use Case
    // Validating the error by using a bad userKey

    cy.get('[data-cy ="openPopoverButton"]').realClick()
    cy.get('#userKey').shadow().find('[class = "ui5-input-inner"]').focus().type('A', { force: true })
    cy.get('[data-cy ="importAllEmailTemplatesButton"]').realClick()
    cy.get('[data-cy ="zipFileInput"]').attachFile(dataTest.emailExampleFile, { force: true })
    cy.get('[data-cy ="importZipButton"]').click()
    cy.get('[data-cy ="dialogMessageConfirmConfirmButton"]').realClick()
    cy.get('[data-cy ="emailTemplatesErrorPopup"]').find('[id="messageList"]').find('[data-title="Unauthorized user"]').should('have.text', dataTest.unauthorizedUser)

    cy.get('[data-cy ="emailTemplatesErrorPopup"]').should('be.visible')
    cy.get('[data-cy ="emailTemplatesErrorPopup"]').find('#closeButton').realClick()
    cy.get('[data-cy ="openPopoverButton"]').realClick()
    cy.waitUntil(() => cy.get('#credentialsResponsivePopover').then((win) => cy.get(win).should('be.visible')))

    cy.get('#userKey').shadow().find('[class = "ui5-input-inner"]').focus().type('{backspace}', { force: true })
    cy.get('[data-cy ="emailTemplatesErrorPopup"]').find('#closeButton').realClick()
    cy.get('[data-cy ="openPopoverButton"]').realClick()
  }

  function testImportExportSmsFirstUseCaseTemplates() {
    // SMS Templates - First Use Case
    // Exporting and Importing the original template
    cy.waitUntil(() => cy.get('[data-cy ="exportAllSmsTemplatesButton"]').then((win) => cy.get(win).should('be.visible')))

    cy.get('[data-cy ="exportAllSmsTemplatesButton"]').click({ force: true })
    cy.get('[data-cy ="importAllSmsTemplatesButton"]').click({ force: true })
    cy.get('[data-cy ="zipFileInput"]').selectFile(`${dataTest.cypressDownloadsPath}${dataTest.smsExampleFile}`, { force: true })
    cy.get('[data-cy ="importZipButton"]').click({ force: true })
    cy.get('[data-cy ="smsSuccessPopup"]').should('be.visible')
    cy.get('[data-cy ="smsSuccessPopup"]').find('#closeButton').click({ force: true })
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="fd-tabs__item"]').eq(1).should('be.visible')
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="fd-tabs__item"]').eq(1).should('have.text', 'OTP')
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="fd-tabs__item"]').eq(1).find('a').click({ force: true })
    cy.get('main-app')
      .shadow()
      .find('sms-templates-web-app')
      .shadow()
      .find('[class="languages_list_container"]')
      .find('[role="list"]')
      .find('[role="listitem button"]')
      .find('[class="fd-list__title"]')
      .click({ force: true })
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="langauge-item"]').should('have.length', '40')
  }

  function testImportExportSmsSecondUseCaseTemplates() {
    // SMS Templates - Second Use Case
    // Importing and validating the template with new changes
    getSelectedOption(dataTest.smsTemplatesOption)
    cy.get('[data-cy ="importAllSmsTemplatesButton"]').click({ force: true })
    cy.waitUntil(() => cy.get('[data-cy ="importPopup"]').then((win) => cy.get(win).should('be.visible')))

    cy.get('[data-cy ="zipFileInput"]').attachFile(dataTest.smsExampleFile)
    cy.get('[data-cy ="importZipButton"]').click({ force: true })
    cy.get('[data-cy ="smsSuccessPopup"]').should('be.visible')
    cy.get('[data-cy ="smsSuccessPopup"]').find('#closeButton').click({ force: true })
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
      .find('[role="listitem button"]')
      .find('[class="fd-list__title"]')
      .click({ force: true })
    cy.get('main-app').shadow().find('sms-templates-web-app').shadow().find('[class="langauge-item"]').should('have.length', '40')
  }

  function navigateToChosenSite(siteName, childSite) {
    let index = childSite === true ? 1 : 0
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
        .then((input) => cy.get(input).should('be.visible').should('not.be.disabled').clear().focus().type(siteName)),
    )
    cy.get('main-app').shadow().find('[class ="app-area"]').find('site-selector-web-app').shadow().find('[class ="fd-table__body"]').find('td').find('a').eq(index).click()
    cy.wait(5000)
  }

  function deleteSiteCreated() {
    getSelectedOption(dataTest.siteSelectorOption)
    //delete child
    cy.get('main-app').shadow().find('[class ="app-area"]').find('site-selector-web-app').shadow().find('sslct-site-actions').eq(1).find('fd-popover-control > button').click()

    cy.get('.fd-popover__popper').find('ul > li').get('.delete_menu_item').click({ force: true })
    cy.get('.fd-bar__right').find('fd-dialog-footer-button').eq(1).find('button').click({ force: true })
    cy.get('.fd-form__control').click()
    cy.get('.fd-bar__right > :nth-child(2) > .fd-button').click({ force: true })

    //delete parent
    cy.get('main-app').shadow().find('[class ="app-area"]').find('site-selector-web-app').shadow().find('sslct-site-list').find('tbody').should('have.length', 1)
    cy.get('main-app').shadow().find('[class ="app-area"]').find('site-selector-web-app').shadow().find('sslct-site-actions').eq(0).find('fd-popover-control > button').click()

    cy.waitUntil(() =>
      cy
        .get(' .cdk-overlay-pane')
        .find('[class = "fd-popover__popper"]')
        .then((input) => cy.get(input).find('ul > li').get('.delete_menu_item').click({ force: true })),
    )

    cy.get('.fd-bar__right').find('fd-dialog-footer-button').eq(1).find('button').click()
    cy.get('.fd-form__control').click()
    cy.get('.fd-bar__right > :nth-child(2) > .fd-button').click()
  }

  function getSelectedOption(optionName) {
    cy.get('main-app').shadow().find('[class ="list-item fd-nested-list__item"]').contains(optionName).click()
    cy.wait(5000)
  }
  function loginToGigya(URL) {
    cy.visit('https://' + URL)

    cy.get('[name ="username"]', { timeout: 10000 }).eq(2).type(Cypress.env('userName'))
    cy.get('[name="password"]').eq(3).type(Cypress.env('passWord'))
    cy.get('[class = "gigya-input-submit"]').eq(8).click()
  }

  function validateChanges(domainName, childSite) {
    navigateToChosenSite(domainName, childSite)
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
    // Check if webhooks where copied successfully
    checkWebhooks()
    // Check if the dataflows where copied successfully
    checkDataflows()
  }

  function checkWebhooks() {
    getSelectedOption(dataTest.webhooksOption)
    cy.get('main-app').shadow().find('web-hooks-web-app').shadow().find('app-web-hooks-dashboard').find('app-web-hooks-table').contains(dataTest.templateSiteName)
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
  function checkDataflows() {
    getSelectedOption(dataTest.dataflowOption)
    cy.get('main-app')
      .shadow()
      .find('iframe')
      .then((frame) => {
        const doc = frame.contents().find('body')
        cy.wrap(doc).find('etl-app').find('etl-dataflowtable').find('table').contains(dataTest.testDataflow)
      })
  }
})
