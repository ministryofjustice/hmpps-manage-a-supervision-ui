import Page from '../pages/page'
import RecentCasesPage from '../pages/recentCases'

context('Recent Cases', () => {
  it('Recent Cases page is rendered', () => {
    cy.visit('/recent-cases', {
      onBeforeLoad(win) {
        const recentCases = []
        const recentCase = {
          name: 'Wolff,Caroline',
          crn: 'X000001',
          dob: '9 January 2002',
          age: 22,
          tierScore: 'B2',
          numberOfSentences: '2',
          sentence: '12 month Community order',
        }

        recentCases.push(recentCase)
        win.localStorage.setItem('recentCases', JSON.stringify(recentCases))
      },
    })

    const page = Page.verifyOnPage(RecentCasesPage)

    cy.get('h1').contains('Recently viewed cases')

    cy.get('thead')
      .eq(0)
      .within(() => cy.get('th').eq(0).should('contain.text', 'Name / CRN'))
    cy.get('thead')
      .eq(0)
      .within(() => cy.get('th').eq(1).should('contain.text', 'DOB/ Age'))
    cy.get('thead')
      .eq(0)
      .within(() => cy.get('th').eq(2).should('contain.text', 'Tier'))
    cy.get('thead')
      .eq(0)
      .within(() => cy.get('th').eq(3).should('contain.text', 'Sentence'))

    page.createAliasAtIndexWithin('tbody', 0, 'td', 0, 'row1col1')
    cy.get('@row1col1').within(() => cy.get('a').invoke('attr', 'href').should('equal', './case/X000001'))
    cy.get('@row1col1').within(() => cy.contains('a', 'Wolff,Caroline'))
    cy.get('@row1col1').within(() => cy.contains('span', 'X000001'))

    page.createAliasAtIndexWithin('tbody', 0, 'td', 1, 'row1col2')
    cy.get('@row1col2').within(() => cy.contains('9 January 2002'))
    cy.get('@row1col2').within(() => cy.contains('span', 22))

    cy.get('tbody')
      .eq(0)
      .within(() => cy.get('td').eq(2).should('contain.text', 'B2'))
    cy.get('tbody')
      .eq(0)
      .within(() => cy.get('td').eq(3).should('contain.text', '12 month Community order'))
  })
})
