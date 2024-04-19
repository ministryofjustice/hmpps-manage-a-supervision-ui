import Page from '../../pages/page'
import PreviousOrdersPage from '../../pages/sentence/previous-orders'

context('Sentence', () => {
  it('Sentence page is rendered', () => {
    cy.visit('/case/sentence/X000001/previous-orders')
    cy.get('h2').contains('Previous orders')

    cy.get('p')
      .eq(0)
      .within(() => cy.get('a').invoke('attr', 'href').should('equal', '/case/X000001/handoff/delius'))
    cy.get('p')
      .eq(0)
      .within(() => cy.get('a').should('contain.text', 'CJA - Std Determinate Custody (16 Months)'))
    cy.get('table')
      .eq(0)
      .within(() => cy.get('td').eq(0).should('contain.text', 'Merchant Shipping Acts - 15000'))
    cy.get('table')
      .eq(0)
      .within(() => cy.get('td').eq(1).should('contain.text', 'Ended on 9 Apr 2024'))

    cy.get('p')
      .eq(1)
      .within(() => cy.get('a').invoke('attr', 'href').should('equal', '/case/X000001/handoff/delius'))
    cy.get('p')
      .eq(1)
      .within(() => cy.get('a').should('contain.text', 'CJA - Std Determinate Custody (12 Months)'))
    cy.get('table')
      .eq(1)
      .within(() => cy.get('td').eq(0).should('contain.text', 'Army - offences associated with - 15300'))
    cy.get('table')
      .eq(1)
      .within(() => cy.get('td').eq(1).should('contain.text', 'Ended on 8 Apr 2024'))
  })
})
