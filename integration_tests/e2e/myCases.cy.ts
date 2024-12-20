import Page from '../pages/page'
import YourCasesPage from '../pages/myCases'

context('My cases', () => {
  it('My cases page is rendered ', () => {
    cy.visit('/case')
    const page = Page.verifyOnPage(YourCasesPage)
    page.getRowData('myCases', 'nameOrCrn', 'Value1').should('contain.text', 'X778160')
    page.getRowData('myCases', 'dob', 'Value1').should('contain.text', '25 Sep 1975')

    page.getRowData('myCases', 'nameOrCrn', 'Value4').should('contain.text', 'Restricted access')
    page.getRowData('myCases', 'nameOrCrn', 'Value4').should('contain.text', 'X808126')
    page.getRowData('myCases', 'dob', 'Value4').should('contain.text', 'Restricted')
    page.getPagination().should('contain.text', 'Showing 1 to 10 of 33 cases.')
  })
})
