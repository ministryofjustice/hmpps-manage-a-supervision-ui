import Page from '../pages/page'
import SentencePage from '../pages/sentence'

context('Sentence', () => {
  it('Sentence page is rendered', () => {
    cy.visit('/case/X000001/sentence')
    const page = Page.verifyOnPage(SentencePage)
    page.headerCrn().should('contain.text', 'X000001')
    page.headerName().should('contain.text', 'Eula Schmeler')
    page.pageHeading().should('contain.text', 'Sentence: 3')
    page.pageHeading().should('contain.text', 'Sentence: 1')
    page.getTab('overview').should('contain.text', 'Overview')
    page.getTab('personalDetails').should('contain.text', 'Personal details')
    page.getTab('risk').should('contain.text', 'Risk')
    page.getTab('sentence').should('contain.text', 'Sentence')
    page.getTab('activityLog').should('contain.text', 'Activity log')
    page.getTab('compliance').should('contain.text', 'Compliance')
    page.getCardHeader('offence').should('contain.text', 'Offence')
    page.getCardHeader('offence').should('have.length', 2)
    page.getCardHeader('conviction').should('contain.text', 'Conviction')
    page.getCardHeader('conviction').should('have.length', 2)
  })
})
