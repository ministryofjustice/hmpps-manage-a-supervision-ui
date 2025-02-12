import Page from '../pages/page'
import InterventionsPage from '../pages/interventions'

context('Interventions', () => {
  it('Interventions page is rendered', () => {
    cy.visit('/case/X000001/interventions')
    const page = Page.verifyOnPage(InterventionsPage)
    page.headerCrn().should('contain.text', 'X000001')
    page.headerName().should('contain.text', 'Eula Schmeler')
    page.pageHeading().should('contain.text', 'Interventions')

    page.assertRiskTags()
    page.getRowData('interventions', 'referralReferenceNumber3', 'Value').should('contain.text', 'AB2495DC')
    page
      .getRowData('interventions', 'referralInterventionTitle3', 'Value')
      .should('contain.text', 'Other Services - North West')
    cy.get('[data-qa="referral3Link"]')
      .should('contain.text', 'View')
      .should('have.attr', 'aria-label', `View referral AB2495DC for Other Services - North West`)
      .should('have.attr', 'target', '_blank')
      .should(
        'have.attr',
        'href',
        'https://hmpps-interventions-ui-dev.apps.live-1.cloud-platform.service.justice.gov.uk/probation-practitioner/referrals/5698c84b-4c0d-442f-84b6-27cd35eefca5/progress',
      )
    page
      .getRowData('interventions', 'referralInterventionTitle1', 'Value')
      .should('contain.text', 'Accommodation Services - North East')
    page.getRowData('interventions', 'referralReferenceNumber1', 'Value').should('contain.text', 'AC2495AC')
  })
})
