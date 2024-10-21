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

    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dt').should('have.length', 5))

    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dd').should('have.length', 5))

    cy.get(`[class=app-summary-card__body]`).within(() =>
      cy.get('dt').eq(0).should('contain.text', 'Imposed (Release) date'),
    )
    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dd').eq(0).should('contain.text', '25 December 2024'))

    cy.get(`[class=app-summary-card__body]`).within(() =>
      cy.get('dt').eq(1).should('contain.text', 'Actual start date'),
    )
    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dd').eq(1).should('contain.text', '26 December 2024'))

    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dt').eq(2).should('contain.text', 'Note added by'))
    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dd').eq(2).should('contain.text', 'CVL Service'))

    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dt').eq(3).should('contain.text', 'Date added'))
    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dd').eq(3).should('contain.text', '22 April 2024'))

    cy.get(`[class=app-summary-card__body]`).within(() => cy.get('dt').eq(4).should('contain.text', 'Note'))
    cy.get(`[class=app-summary-card__body]`).within(() =>
      cy
        .get('dd')
        .eq(4)
        .should(
          'contain.text',
          'Licence Condition created automatically from the Create and Vary a licence system of\\nAllow person(s) as designated by your supervising officer to install an electronic monitoring tag on you and access to install any associated equipment in your property, and for the purpose of ensuring that equipment is functioning correctly. You must not damage or tamper with these devices and ensure that the tag is charged, and report to your supervising officer and the EM provider immediately if the tag or the associated equipment are not working correctly. This will be for the purpose of monitoring your alcohol abstinence licence condition(s) unless otherwise authorised by your supervising officer. Licence Condition created automatically from the Create and Vary a licence system of\\nAllow person(s) as designated by your supervising officer to install an electronic monitoring tag on you and access to install any associated equipment in your property, and for the purpose of ensuring that equipment is functioning correctly. You must not damage or tamper with these devices and ensure that the tag is charged, and report to your supervising officer and the EM provider immediately if the tag or the associated equipment are not working correctly. This will be for the purpose of monitoring your alcohol abstinence licence condition(s) unless otherwise authorised by your supervising officer.Licence Condition created automatically from the Create and Vary a licence system of\\nAllow person(s) as desi123456\n',
        ),
    )
  })
})
