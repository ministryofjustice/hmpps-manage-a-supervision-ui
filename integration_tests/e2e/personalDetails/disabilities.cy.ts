import DisabilitiesPage from '../../pages/personalDetails/disabilities'
import Page from '../../pages/page'

context('Contact', () => {
  it('Contact page is rendered', () => {
    cy.visit('/case/X000001/personal-details/disabilities')
    const page = Page.verifyOnPage(DisabilitiesPage)
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

    page.assertAnchorElementAtIndexWithin(
      'p',
      0,
      0,
      'https://ndelius-dummy-url/NDelius-war/delius/JSP/deeplink.xhtml?component=EqualityMonitoring&CRN=X000001',
    )
  })
})
