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
    page.getCardHeader('sentence').should('contain.text', 'Sentence')
    page.getCardHeader('sentence').should('have.length', 2)
    page.getCardHeader('probationHistory').should('contain.text', 'Probation History')
    page.getCardHeader('probationHistory').should('have.length', 1)

    page.getRowDataIndex('offence', 'mainOffence', 'Value', 0).should('contain.text', 'Murder (3 count)')
    page.getRowDataIndex('offence', 'mainOffence', 'Value', 1).should('contain.text', 'Another Murder (1 count)')

    page.getRowDataIndex('offence', 'dateOfOffence', 'Value', 0).should('contain.text', '20 March 2024')
    page.getRowDataIndex('offence', 'dateOfOffence', 'Value', 1).should('contain.text', '20 January 2024')

    page.getRowDataIndex('offence', 'offenceNotes', 'Value', 0).should('contain.text', 'overview')

    page.getRowDataIndex('conviction', 'sentencingCourt', 'Value', 0).should('contain.text', 'Hull Court')
    page.getRowDataIndex('conviction', 'responsibleCourt', 'Value', 0).should('contain.text', 'Birmingham Court')
    page.getRowDataIndex('conviction', 'convictionDate', 'Value', 0).should('contain.text', 'Hull Court')

    page.getRowDataIndex('sentence', 'orderDescription', 'Value', 0).should('contain.text', 'Default Sentence Type')
    page.getRowDataIndex('sentence', 'orderStartDate', 'Value', 0).should('contain.text', '19 March 2024')
    page.getRowDataIndex('sentence', 'orderEndDate', 'Value', 0).should('contain.text', '19 March 2025')

    page
      .getRowDataIndex('sentence', 'courtDocuments', 'Value', 0)
      .within(() => cy.get('ul > li').its('length').should('equal', 3))

    page
      .getRowDataIndex('sentence', 'courtDocuments', 'Value', 0)
      .within(() => cy.get('ul > li:first').get('a').invoke('attr', 'href').should('equal', '/document/115'))
    page
      .getRowDataIndex('sentence', 'courtDocuments', 'Value', 0)
      .within(() => cy.get('ul > li:first').should('contain.text', 'Pre-sentence report'))
    page
      .getRowDataIndex('sentence', 'courtDocuments', 'Value', 0)
      .within(() => cy.get('ul > li:first').should('contain.text', 'Last updated 3 Apr 2024'))

    page
      .getRowDataIndex('sentence', 'courtDocuments', 'Value', 0)
      .within(() => cy.get('ul > li').get('a').eq(1).invoke('attr', 'href').should('equal', '/document/116'))
    page
      .getRowDataIndex('sentence', 'courtDocuments', 'Value', 0)
      .within(() => cy.get('ul > li').eq(1).should('contain.text', 'CPS Pack'))
    page
      .getRowDataIndex('sentence', 'courtDocuments', 'Value', 0)
      .within(() => cy.get('ul > li').eq(1).should('contain.text', 'Last updated 1 Apr 2024'))

    page
      .getRowDataIndex('sentence', 'courtDocuments', 'Value', 0)
      .within(() => cy.get('ul > li').get('a').eq(2).invoke('attr', 'href').should('equal', '/document/111'))
    page
      .getRowDataIndex('sentence', 'courtDocuments', 'Value', 0)
      .within(() => cy.get('ul > li').eq(2).should('contain.text', 'Previous convictions'))
    page
      .getRowDataIndex('sentence', 'courtDocuments', 'Value', 0)
      .within(() => cy.get('ul > li').eq(2).should('contain.text', 'Unavailable'))

    page
      .getCardHeader('probationHistory')
      .within(() => cy.get('.govuk-summary-list__key').eq(0).should('contain.text', 'Previous orders'))
  })
})
