import Page from '../pages/page'
import YourCasesPage from '../pages/yourCases'

context('Your cases', () => {
  it('Your cases page is rendered ', () => {
    cy.visit('/case')
    const page = Page.verifyOnPage(YourCasesPage)
    page.getRowData('yourCases', 'case1', 'Value').should('contain.text', 'James Morrison')
    page.getPagination().should('contain.text', 'Showing 1 to 10 of 29,090 cases.')
  })
})
