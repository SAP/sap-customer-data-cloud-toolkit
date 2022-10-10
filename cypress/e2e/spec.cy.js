/* eslint-disable no-undef */
describe('My First Test', () => {
	it('Does not!', () => {
		expect(true).to.equal(true)
	})

	// it('Does not do much!', () => {
	// 	expect(true).to.equal(false)
	// })

	it('Writes on Site Domain"', () => {
		cy.visit('http://localhost:3000')

		cy.contains('Site Deployer').click()
		cy.url().should('include', '/cdc-tools/site-deployer')
		//Write on Site Domain
		cy.get('#cdctools-siteDomain')
			.shadow()
			.find('.ui5-input-content')
			.type('a_b_c_site_deployer')
		// //Select a Site Structure
		// cy.get('#cdctools-siteStructure')

		//cy.get('#cdctools-siteDomain').shadow().get('*[class^="ui5-input-inner"]')
		// cy.get('[data-cy="submit"]')
		// cy.get('[data-cy="submit2"]')
	})

	it('Selects a Data Center"', () => {
		cy.get('#cdctools-dataCenter')
			.shadow()
			.children()
			.find('.ui5-multi-combobox-token')
			.eq(0)
			.click()
		cy.get('#cdctools-dataCenter')
			.shadow()
			.children()
			.find('.ui5-multi-combobox-token')
			.eq(1)
			.click()

		//	cy.get('#cdctools-siteStructure').shadow().children().click(2)
	})

	it('Selects a Site Structure"', () => {
		//cy.get('#cdctools-siteStructure').click()

		//cy.get('ui5-li#ui5wc_20-li')
		cy.get('#cdctools-siteStructure').then((dropdown) => {
			cy.wrap(dropdown).click()

			cy.get('.ui5wc_24')
				.shadow()
				.find('.ui5-select-popover')
				.find('#ui5wc_20-li')
				.click()
		})
		//cy.contains('.ui5-li-title').click()
		// .each(function (elem, index, list) {
		// 	cy.log('ELEMENT', elem)
		// 	cy.log('index', index)
		// 	cy.wrap(index[1]).click()
		// })

		// cy.get('#cdctools-siteStructure').shadow().children().click(2)
	})
	it('Select the create site button"', () => {
		cy.get('ui5-button[icon = "add"]')
			.shadow()
			.find('.ui5-button-root')
			.find('#ui5wc_12-content')

			.click()
	})

	it('Saves the Site"', () => {
		cy.get('#save-main').click()
	})
})
