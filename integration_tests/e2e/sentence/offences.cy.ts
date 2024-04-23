context('Sentence', () => {
  it('Sentence page is rendered', () => {
    cy.visit('/case/X000001/sentence/offences/3')
    cy.get('h1').contains('Offences')
    cy.get('h2').contains('Additional offences')
  })
})
