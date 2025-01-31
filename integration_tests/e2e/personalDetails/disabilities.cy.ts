context('Contact', () => {
  it('Contact page is rendered', () => {
    cy.visit('/case/X000001/personal-details/disabilities')

    cy.get('p')
      .eq(0)
      .within(() =>
        cy
          .get('a')
          .invoke('attr', 'href')
          .should(
            'equal',
            'https://ndelius-dummy-url/NDelius-war/delius/JSP/deeplink.xhtml?component=EqualityMonitoring&CRN=X000001',
          ),
      )
  })
})
