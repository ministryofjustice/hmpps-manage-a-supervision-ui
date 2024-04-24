context('Sentence', () => {
  it('Sentence page is rendered', () => {
    cy.visit('/case/X000001/sentence/offences/3')

    cy.get('h1').contains('Offences')
    cy.get('h2').contains('Additional offences')

    cy.get('section')
      .eq(0)
      .within(() => cy.get('h2').contains('Main offence'))
    cy.get('section')
      .eq(0)
      .within(() => cy.get('dt').eq(0).contains('Offence'))
    cy.get('section')
      .eq(0)
      .within(() => cy.get('dt').eq(1).contains('Category'))
    cy.get('section')
      .eq(0)
      .within(() => cy.get('dt').eq(2).contains('Notes'))
  })
})
