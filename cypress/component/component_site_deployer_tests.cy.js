/* eslint-disable no-undef */

import { SitesTable } from '../../src/components/sites-table/sites-table.component'
import { ThemeProvider } from '@ui5/webcomponents-react'

import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

const mockStore = configureStore([])
const initialState = [
  {
    sites: {
      sites: [
        {
          baseDomain: 'p1.com',
          description: 'parent 1 description',
          dataCenter: 'us1',
          isChildSite: false,
          tempId: '123',
          parentSiteId: '',
          childSites: [
            {
              baseDomain: 'p1.c1.com',
              description: 'parent 1 child 1 description',
              dataCenter: 'us1',
              isChildSite: true,
              tempId: 'parent1SiteId',
              parentSiteId: 'parent1SiteId',
            },
          ],
        },
      ],
      partnerID: 'partnerId',
      userKey: 'userKey',
      secret: 'secret',
      errors: [],
      showSuccessDialog: false,
      dataCenters: [
        {
          label: 'US',
          value: 'us1',
        },
      ],
    },
  },
  {
    sites: {
      sites: [
        {
          baseDomain: 'p1.com',
          description: 'parent 1 description',
          dataCenter: 'us1',
          isChildSite: false,
          tempId: '123',
          parentSiteId: '',
          childSites: [],
        },
      ],
      partnerID: 'partnerId',
      userKey: 'userKey',
      secret: 'secret',
      errors: [],
      showSuccessDialog: false,
      dataCenters: [
        {
          label: 'US',
          value: 'us1',
        },
      ],
    },
  },
]

const parentWithChildren = mockStore(initialState[0])
const parentWithoutChildren = mockStore(initialState[1])

describe('Component Testing', () => {
  it('should add a parent with a child', () => {
    mountSiteTable(parentWithChildren)
    cy.get('ui5-table-row').should('have.length', 2)

    //Parent Domain and Description
    cy.get('ui5-table-row').shadow().get('#dataCenterSelect').invoke('text').should('eq', 'US')

    getRowInput(0).should('have.value', 'p1.com')
    getRowInput(1).should('have.value', 'parent 1 description')

    //Children Domain and Description
    getRowInput(2).should('have.value', 'p1.c1.com')
    getRowInput(3).should('have.value', 'parent 1 child 1 description')
    cy.get('ui5-table-row').shadow().get('.Text-text-0-2-4').invoke('text').should('eq', 'US')
    cy.get('ui5-table-row').shadow().get('#actionSheetOpener123').click().get('ui5-responsive-popover').should('have.length', '2')
  })

  it('should add a parent ', () => {
    mountSiteTable(parentWithoutChildren)

    //Parent Domain and Description

    getRowInput(0).should('have.value', 'p1.com')
    getRowInput(1).should('have.value', 'parent 1 description')

    cy.get('ui5-table-row').should('have.length', 1)
  })
  it('should create a parent site manually ', () => {
    const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
    cy.on('uncaught:exception', (err) => {
      if (resizeObserverLoopErrRe.test(err.message)) {
        return false
      }
    })
    mountSiteTable(parentWithoutChildren)
    cy.get('#addParentButton').click()

    //Parent Domain and Description
  })

  function mountSiteTable(Body) {
    const component = (
      <ThemeProvider>
        <Provider store={Body}>
          <SitesTable />
        </Provider>
      </ThemeProvider>
    )
    return cy.mount(component)
  }
  function getRowInput(option) {
    return cy.get('ui5-table-row').shadow().get('ui5-input').eq(option)
  }
})
