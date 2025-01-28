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
    page
      .getRowData('interventions', 'referralInterventionTitle3', 'Value')
      .should('contain.text', 'Other Services - North West')
    page
      .getRowData('interventions', 'referralInterventionTitle1', 'Value')
      .should('contain.text', 'Accommodation Services - North East')
    page.getRowData('interventions', 'referralReferenceNumber3', 'Value').should('contain.text', 'AB2495DC')
    page.getRowData('interventions', 'referralReferenceNumber1', 'Value').should('contain.text', 'AC2495AC')
  })
})
