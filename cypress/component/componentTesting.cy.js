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
          parentSiteTempId: '',
          tempId: '1234',
          baseDomain: 'test domain',
          description: 'test description',
          dataCenter: 'test data center',
          childSites: [],
          isChildSite: false,
        },
      ],
    },
  },
  {
    sites: [
      {
        parentSiteTempId: '',
        tempId: '1234',
        baseDomain: 'a.com',
        description: 'test parent from strucure',
        dataCenter: 'AU',
        childSites: [
          {
            baseDomain: 'dev.a.com',
            description: 'test child from strucure',
            dataCenter: 'AU',
          },
        ],
      },
    ],
  },
]

const parentWithChildren = mockStore(initialState[1])
const parentSite = mockStore(initialState[0])

describe('Component Testing', () => {
  it('should add a parent with a child', () => {
    const component = (
      <ThemeProvider>
        <Provider store={parentWithChildren}>
          <SitesTable />
        </Provider>
      </ThemeProvider>
    )

    cy.mount(component)

    cy.get('ui5-table-row').should('have.length', 2)

    //Parent Domain and Description
    cy.get('ui5-table-row').shadow().get('ui5-select').get('ui5-option[data-value="AU"]').invoke('text').should('eq', 'AU')
    cy.get('ui5-table-row').shadow().get('ui5-input').eq(0).should('have.value', 'a.com')
    cy.get('ui5-table-row').shadow().get('ui5-input').eq(1).should('have.value', 'test parent from strucure')

    //Children Domain and Description
    cy.get('ui5-table-row').shadow().get('ui5-input').eq(2).should('have.value', 'dev.a.com')
    cy.get('ui5-table-row').shadow().get('ui5-input').eq(3).should('have.value', 'test child from strucure')
    cy.get('ui5-table-row').shadow().get('.Text-text-0-2-4').invoke('text').should('eq', 'AU')
    cy.get('ui5-table-row').shadow().get('#actionSheetOpener1234').click().get('ui5-responsive-popover').should('have.length', '2')
  })
  it('should add a parent ', () => {
    getStructures()

    const component = (
      <ThemeProvider>
        <Provider store={parentSite}>
          <SitesTable />
        </Provider>
      </ThemeProvider>
    )

    cy.mount(component)
    // console.log(getSiteById(initialState.sites.sites, initialState.sites.sites[0].tempId))
    // console.log(addChild({ tempId: initialState.sites.sites[0].tempId }))
    //cy.get('ui5-table-row').should('have.length', 2)

    //Parent Domain and Description
    cy.get('ui5-table-row').shadow().get('ui5-input').eq(0).should('have.value', 'test domain')
    cy.get('ui5-table-row').shadow().get('ui5-input').eq(1).should('have.value', 'test description')

    //Children Domain and Description
    // cy.get('ui5-table-row').shadow().get('ui5-input').eq(2).should('have.value', 'dev.a.com')
    // cy.get('ui5-table-row').shadow().get('ui5-input').eq(3).should('have.value', 'test child from strucure')
  })
})

function getStructures() {
  const inputLength = cy.get('ui5-table-row').shadow().get('ui5-input')
  console.log('this is the length', inputLength)
}
