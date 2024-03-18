import Page from '../../pages/page'
import ContactPage from '../../pages/personalDetails/contact'

context('Contact', () => {
  it('Contact page is rendered', () => {
    cy.visit('/case/X000001/personal-details/personal-contact/2500232995')
    const page = Page.verifyOnPage(ContactPage)
    page.getRowData('contactRelationshipTypeHeader', 'Value').should('contain.text', 'Emergency Contact')
    page.getRowData('contactNameHeader', 'Value').should('contain.text', 'Brian Smith')
    page.getRowData('contactName', 'Value').should('contain.text', 'Brian Smith')
    page.getRowData('contactRelationshipType', 'Value').should('contain.text', 'Emergency Contact')
    page.getRowData('contactRelationship', 'Value').should('contain.text', 'Father')
    page.getRowData('contactAddress', 'Value').should('contain.text', '36 Fifth Street')
    page.getRowData('contactNotes', 'Value').should('contain.text', 'No notes')
    page.getRowData('lastUpdatedBy', 'Value').should('contain.text', 'Last updated by George NDelius03 on 14 Mar 2023')
  })
})
