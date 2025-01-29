import Page from '../pages/page'
import SearchPage from '../pages/search'

context('Search', () => {
  it('Search page is rendered', () => {
    cy.visit('/search')
    const page = Page.verifyOnPage(SearchPage)
    page.getNavigationLink(1).should('contain.text', 'Home')
    page.getNavigationLink(1).should('not.have.attr', 'aria-current', 'home')
    page.getNavigationLink(2).should('contain.text', 'Cases')
    page.getNavigationLink(2).should('not.have.attr', 'aria-current', 'cases')
    page.getNavigationLink(3).should('contain.text', 'Search')
    page.getNavigationLink(3).should('have.attr', 'aria-current', 'search')
  })
})
