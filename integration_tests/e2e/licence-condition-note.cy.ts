import Page from '../pages/page'
import SentencePage from '../pages/sentence'

context('Sentence', () => {
  it('Licence condition note page is rendered', () => {
    cy.visit('/case/X000001/sentence/licence-condition/7007/note/0')

    const page = Page.verifyOnPage(SentencePage)
    page.headerCrn().should('contain.text', 'X000001')
    page.headerName().should('contain.text', 'Caroline Wolff')
    cy.get('[data-qa=pageHeading]').eq(0).should('contain.text', 'Sentence')

    cy.get(`[class=app-summary-card__header]`).within(() =>
      cy.get('h2').should('contain.text', 'Alcohol Monitoring (Electronic Monitoring)'),
    )

    cy.get(`[class=app-summary-card__body]`).within(() =>
      cy.get('dt').eq(0).should('contain.text', 'Imposed (Release) date'),
    )

    cy.get(`[class=app-summary-card__body]`).within(() =>
      cy.get('dt').eq(1).should('contain.text', 'Actual start date'),
    )
  })
})
