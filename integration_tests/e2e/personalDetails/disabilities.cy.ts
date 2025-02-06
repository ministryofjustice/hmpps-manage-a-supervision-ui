import DisabilityPage from '../../pages/personalDetails/disability'
import Page from '../../pages/page'

context('Contact', () => {
  it('Contact page is rendered', () => {
    cy.visit('/case/X000001/personal-details/disabilities')

    const page = Page.verifyOnPage(DisabilityPage)
    page.assertAnchorElementAtIndexWithin(
      'p',
      0,
      0,
      'https://ndelius-dummy-url/NDelius-war/delius/JSP/deeplink.xhtml?component=EqualityMonitoring&CRN=X000001',
    )
  })
})
