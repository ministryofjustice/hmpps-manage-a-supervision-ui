import Page from '../pages/page'
import ProfessionalContacts from '../pages/professionalContacts'

context('Professional contacts', () => {
  it('Professional contacts page is rendered', () => {
    cy.visit('/case/X000001/address-book-professional')
    const page = Page.verifyOnPage(ProfessionalContacts)

    cy.get('h2').eq(0).should('contain.text', 'Peter Parker')
    cy.get('dl')
      .eq(0)
      .within(() => cy.get('dd').eq(1))
    page.assertPageElementAtIndexWithin('dl', 0, 'dt', 0, 'Phone number')
    page.assertPageElementAtIndexWithin('dl', 0, 'dd', 0, '07321165373')
    page.assertPageElementAtIndexWithin('dl', 0, 'dt', 1, 'Email')
    page.assertPageElementAtIndexWithin('dl', 0, 'dd', 2, 'peter.parker@moj.gov.uk')
    page.assertPageElementAtIndexWithin('dl', 0, 'dt', 2, 'Provider')
    page.assertPageElementAtIndexWithin('dl', 0, 'dd', 4, 'London')
    page.assertPageElementAtIndexWithin('dl', 0, 'dt', 3, 'Probation Delivery Unit (PDU)')
    page.assertPageElementAtIndexWithin('dl', 0, 'dd', 6, 'N07 Cluster 1')
    page.assertPageElementAtIndexWithin('dl', 0, 'dt', 4, 'Team')
    page.assertPageElementAtIndexWithin('dl', 0, 'dd', 8, 'OMU B')

    cy.get('h2').eq(1).should('contain.text', 'Bruce Wayne')
    page.assertPageElementAtIndexWithin('dl', 1, 'dt', 0, 'Provider')
    page.assertPageElementAtIndexWithin('dl', 1, 'dd', 0, 'Leicester')
    page.assertPageElementAtIndexWithin('dl', 1, 'dt', 1, 'Probation Delivery Unit (PDU)')
    page.assertPageElementAtIndexWithin('dl', 1, 'dd', 2, 'Leicestershire All')
    page.assertPageElementAtIndexWithin('dl', 1, 'dt', 2, 'Team')
    page.assertPageElementAtIndexWithin('dl', 1, 'dd', 4, 'OMU B')
    page.assertPageElementAtIndexWithin('dl', 1, 'dt', 3, 'Allocated until')
    page.assertPageElementAtIndexWithin('dl', 1, 'dd', 6, '30 April 2024')

    cy.get('h2').eq(2).should('contain.text', 'Jon Smith')
    page.assertPageElementAtIndexWithin('dl', 2, 'dt', 0, 'Provider')
    page.assertPageElementAtIndexWithin('dl', 2, 'dd', 0, 'Public Protection Unit')
    page.assertPageElementAtIndexWithin('dl', 2, 'dt', 1, 'Probation Delivery Unit (PDU)')
    page.assertPageElementAtIndexWithin('dl', 2, 'dd', 2, 'Bradford')
    page.assertPageElementAtIndexWithin('dl', 2, 'dt', 2, 'Team')
    page.assertPageElementAtIndexWithin('dl', 2, 'dd', 4, 'CPA West Yorkshire')
    page.assertPageElementAtIndexWithin('dl', 2, 'dt', 3, 'Allocated until')
    page.assertPageElementAtIndexWithin('dl', 2, 'dd', 6, '30 June 2026')
  })
})
