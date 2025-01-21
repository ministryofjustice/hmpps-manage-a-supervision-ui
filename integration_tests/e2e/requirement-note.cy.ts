import Page from '../pages/page'
import SentencePage from '../pages/sentence'

context('Sentence', () => {
  it('Requirement note page is rendered', () => {
    cy.visit('/case/X000001/sentence/requirement/1/note/0')
    const page = Page.verifyOnPage(SentencePage)
    page.headerCrn().should('contain.text', 'X000001')
    page.headerName().should('contain.text', 'Caroline Wolff')
    cy.get('[data-qa=pageHeading]').eq(0).should('contain.text', 'Sentence')

    cy.get(`[class=app-summary-card__header]`).within(() =>
      cy.get('h2').should('contain.text', '3 of 12 RAR days completed'),
    )

    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dt').should('have.length', 6))

    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dd').should('have.length', 6))

    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dt').eq(0).should('contain.text', 'Length of RAR'))
    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dd').eq(0).should('contain.text', '12 days'))

    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dt').eq(1).should('contain.text', 'Completed RAR'))
    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dd').eq(1).should('contain.text', '3 days'))

    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dt').eq(2).should('contain.text', 'Start date'))
    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dd').eq(2).should('contain.text', '12 April 2024'))

    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dt').eq(3).should('contain.text', 'Note added by'))
    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dd').eq(3).should('contain.text', 'Jon Jones'))

    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dt').eq(4).should('contain.text', 'Date added'))
    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dd').eq(4).should('contain.text', '21 August 2024'))

    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dt').eq(5).should('contain.text', 'Note'))
    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dd').eq(5).should('contain.text', '123456'))
  })
})
