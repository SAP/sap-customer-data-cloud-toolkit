/* eslint-disable no-undef */
import SiteManager from '../../src/services/site/siteManager'
import * as utils from './utils'
import * as data from '../../src/services/site/data_test'
import * as testData from './test-data'
import manualRemovalTestData from './manual-removal-test-data.json'

const payload = {
  sites: [
    {
      baseDomain: 'e2e_cypress_test.com',
      description: 'E2E Cypress Test',
      dataCenter: 'us1',
      isChildSite: false,
      tempId: '123',
      parentSiteId: '',
      childSites: [],
    },
  ],
  partnerID: 79597568,
  userKey: 'AFww+F466MSR',
  secret: 'dr8XCkty9Mu7yaPH94BfEgxP8lZXRTRP',
  errors: [],
  showSuccessDialog: false,
  dataCenters: [
    {
      label: 'US',
      value: 'us1',
    },
  ],
}

describe('Site Deployer Test Suite', () => {
  it('should display Export All and Import All buttons', () => {
    // cy.visit('https://console.gigya.com/#/79597568/4_N9OlHeDGq9sC0GBaMrp3jg/cdc-toolbox/site-deployer')
    // //
    cy.visit('http://console.gigya.com/#/79597568/4_LTBQ6haM4wcIWpbTnuR2rQ/user-interfacing/email-templates/')
    cy.get('[name ="username"]', { timeout: 10000 }).eq(2).type('g.lopes@sap.com')
    cy.get('[name="password"]').eq(3).type('Kyubi9caudas!123')
    cy.get('[class = "gigya-input-submit"]').eq(8).click()
    // utils.getSiteDomain('e2e_testing', 40000)
    // utils.getDataCenters('US', 'EU', 'AU')
    // utils.getSiteStructure(5).should('have.text', testData.dropdownOption)
    // utils.getCreateButton().click()
    // utils.writeCredentials()
    // cy.get('ui5-table-cell').eq(7).click()
    // cy.get('[data-component-name ="ActionSheetMobileContent"]').find('[accessible-name="Delete Item 1 of 1"]').click({ force: true })
    // utils.getSaveButton().click()
    // cy.get('#successPopup').shadow().find('[id="ui5-popup-header"]').should('have.text', 'Success')
    // cy.get('ui5-bar').eq(4).shadow().get('ui5-button ').eq(5).click()
    // cy.visit('https://console.gigya.com/#/79597568/4_N9OlHeDGq9sC0GBaMrp3jg/sites/site-selector')
    // cy.wait(20000)
    // cy.get('main-app')
    //   .shadow()
    //   .find('[class ="app-area"]')
    //   .find('[ng-version ="14.2.5"]')
    //   .shadow()
    //   .find('[class ="fd-section app__header"]')
    //   .find('[class ="fd-input-group"]')
    //   .find('[placeholder="Search"]')
    //   .type('e2e_testing')

    // cy.get('main-app')
    //   .shadow()
    //   .find('[class ="app-area"]')
    //   .find('[ng-version ="14.2.5"]')
    //   .shadow()
    //   .find('[class ="fd-table__body"]')
    //   .find('[class ="fd-link base-domain"]')
    //   .eq(0)
    //   .click()
    // cy.wait(20000)
    // cy.get('main-app').shadow().find('[class ="fd-nested-list__item"]').eq(9).click()
    cy.wait(20000)
    // cy.get('main-app').shadow().find('[ng-version="14.2.4"]').shadow().find('[class ="ui5-bar-content"]').click()
    // cy.contains('Double Opt-In Confirmation').click()

    // cy.get('#cdctools-siteDomain', { timeout: 40000 }).should('be.visible')
    // // cy.get('[type ="search"]', { timeout: 30000 })
    // cy.get('label', { timeout: 50000 })
  })
})
