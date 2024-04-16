import Page from '../../pages/page'
import PreviousOrdersPage from '../../pages/sentence/previous-orders'

context('Sentence', () => {
  it('Sentence page is rendered', () => {
    cy.visit('/case/sentence/X000001/previous-orders')
    cy.get('h2').contains('Previous orders')
    cy.get('p')
      .eq(0)
      .within(() => cy.get('a').invoke('attr', 'href'))
  })
})
