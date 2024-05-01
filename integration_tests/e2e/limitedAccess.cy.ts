context('Limited access', () => {
  it('message is shown for case view', () => {
    cy.visit('/case/X000003')
    cy.get('body').should('contain.text', 'You are restricted from viewing this case.')
  })
  it('message is shown for child views', () => {
    cy.visit('/case/X000003/some/other/page')
    cy.get('body').should('contain.text', 'You are restricted from viewing this case.')
  })
})
