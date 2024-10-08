import Page from '../pages/page'
import RecentCasesPage from '../pages/recentCases'

context('Recent Cases', () => {
  it('Recent Cases page is rendered', () => {
    cy.visit('/recent-cases')
    const page = Page.verifyOnPage(RecentCasesPage)
  })
})
