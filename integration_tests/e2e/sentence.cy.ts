import Page from '../pages/page'
import SentencePage from '../pages/sentence'

context('Sentence', () => {
  it('Sentence page is rendered', () => {
    cy.visit('/case/X000001/sentence')
    const page = Page.verifyOnPage(SentencePage)
    page.headerCrn().should('contain.text', 'X000001')
    page.headerName().should('contain.text', 'Caroline Wolff')
    cy.get('[data-qa=pageHeading]').eq(0).should('contain.text', 'Sentence')

    page.getTab('overview').should('contain.text', 'Overview')
    page.getTab('personalDetails').should('contain.text', 'Personal details')
    page.getTab('risk').should('contain.text', 'Risk')
    page.getTab('sentence').should('contain.text', 'Sentence')
    page.getTab('activityLog').should('contain.text', 'Activity log')
    page.getTab('compliance').should('contain.text', 'Compliance')

    cy.get('[class="moj-side-navigation__item moj-side-navigation__item--active"]').within(() =>
      cy.get('a').invoke('attr', 'href').should('equal', '/case/X000001/sentence?number=3'),
    )

    cy.get('[class="moj-side-navigation__item"]')
      .eq(0)
      .within(() => cy.get('a').invoke('attr', 'href').should('equal', '/case/X000001/sentence?number=1'))

    cy.get('[class="moj-side-navigation__item"]')
      .eq(1)
      .within(() => cy.get('a').invoke('attr', 'href').should('equal', '/case/X000001/sentence/probation-history'))

    page.getCardHeader('offence').should('contain.text', 'Offence')
    page.getCardHeader('conviction').should('contain.text', 'Conviction')
    page.getCardHeader('sentence').should('contain.text', 'Sentence')

    page.getRowData('offence', 'mainOffence', 'Value').should('contain.text', 'Murder (3 count)')
    page.getRowData('offence', 'dateOfOffence', 'Value').should('contain.text', '20 March 2024')
    page.getRowData('offence', 'offenceNotes', 'Value').should('contain.text', 'overview')
    page.getRowData('offence', 'additionalOffences', 'Value').should('contain.text', 'Burglary (2 count)')
    page.getRowData('offence', 'additionalOffences', 'Value').should('contain.text', 'Assault (1 count)')
    page.getRowData('sentence', 'orderDescription', 'Value').should('contain.text', 'Default Sentence Type')
    page.getRowData('sentence', 'orderStartDate', 'Value').should('contain.text', '19 March 2024')
    page.getRowData('sentence', 'orderEndDate', 'Value').should('contain.text', '19 March 2025')

    page
      .getRowData('sentence', 'courtDocuments', 'Value')
      .within(() => cy.get('ul > li').its('length').should('equal', 3))

    page
      .getRowData('sentence', 'courtDocuments', 'Value')
      .within(() =>
        cy
          .get('ul > li:first')
          .within(() =>
            cy
              .get('a')
              .invoke('attr', 'href')
              .should('equal', 'personal-details/documents/4d74f43c-5b42-4317-852e-56c7d29b610b/download'),
          ),
      )
    page
      .getRowData('sentence', 'courtDocuments', 'Value')
      .within(() => cy.get('ul > li:first').should('contain.text', 'Pre-sentence report'))
    page
      .getRowDataIndex('sentence', 'courtDocuments', 'Value', 0)
      .within(() => cy.get('ul > li:first').should('contain.text', 'Last updated 3 Apr 2024'))

    page.getRowData('sentence', 'courtDocuments', 'Value').within(() =>
      cy
        .get('ul > li')
        .eq(1)
        .within(() =>
          cy
            .get('a')
            .invoke('attr', 'href')
            .should('equal', 'personal-details/documents/6037becb-0d0c-44e1-8727-193f22df0494/download'),
        ),
    )
    page
      .getRowData('sentence', 'courtDocuments', 'Value')
      .within(() => cy.get('ul > li').eq(1).should('contain.text', 'CPS Pack'))
    page
      .getRowData('sentence', 'courtDocuments', 'Value')
      .within(() => cy.get('ul > li').eq(1).should('contain.text', 'Last updated 1 Apr 2024'))

    page.getRowData('sentence', 'courtDocuments', 'Value').within(() =>
      cy
        .get('ul > li')
        .eq(2)
        .within(() =>
          cy
            .get('a')
            .invoke('attr', 'href')
            .should('equal', 'personal-details/documents/d072ed9a-999f-4333-a116-a871a845aeb3/download'),
        ),
    )
    page
      .getRowData('sentence', 'courtDocuments', 'Value')
      .within(() => cy.get('ul > li').eq(2).should('contain.text', 'Previous convictions'))
    page
      .getRowData('sentence', 'courtDocuments', 'Value')
      .within(() => cy.get('ul > li').eq(2).should('contain.text', 'Unavailable'))
  })

  it('Sentence page is rendered via query parameter', () => {
    cy.visit('/case/X000001/sentence?number=1')
    const page = Page.verifyOnPage(SentencePage)

    cy.get('[class="moj-side-navigation__item moj-side-navigation__item--active"]').within(() =>
      cy.get('a').invoke('attr', 'href').should('equal', '/case/X000001/sentence?number=1'),
    )

    cy.get('[class="moj-side-navigation__item"]')
      .eq(0)
      .within(() => cy.get('a').invoke('attr', 'href').should('equal', '/case/X000001/sentence?number=3'))

    cy.get('[class="moj-side-navigation__item"]')
      .eq(1)
      .within(() => cy.get('a').invoke('attr', 'href').should('equal', '/case/X000001/sentence/probation-history'))

    page
      .getCardHeader('offence')
      .within(() => cy.get('.govuk-summary-list__value').eq(2).should('contain.text', 'No notes'))

    page
      .getCardHeader('offence')
      .within(() => cy.get('.govuk-summary-list__value').eq(3).should('contain.text', 'No additional offences'))

    page
      .getCardHeader('conviction')
      .within(() => cy.get('.govuk-summary-list__value').eq(0).should('contain.text', 'No court details'))

    page
      .getCardHeader('conviction')
      .within(() => cy.get('.govuk-summary-list__value').eq(1).should('contain.text', 'No court details'))

    page
      .getCardHeader('conviction')
      .within(() => cy.get('.govuk-summary-list__value').eq(2).should('contain.text', 'No conviction date'))
  })

  it('Sentence page is rendered with probation history information', () => {
    cy.visit('/case/X000001/sentence/probation-history')
    const page = Page.verifyOnPage(SentencePage)

    cy.get('[class="moj-side-navigation__item moj-side-navigation__item--active"]').within(() =>
      cy.get('a').invoke('attr', 'href').should('equal', '/case/X000001/sentence/probation-history'),
    )

    cy.get('[class="moj-side-navigation__item"]')
      .eq(0)
      .within(() => cy.get('a').invoke('attr', 'href').should('equal', '/case/X000001/sentence?number=3'))

    cy.get('[class="moj-side-navigation__item"]')
      .eq(1)
      .within(() => cy.get('a').invoke('attr', 'href').should('equal', '/case/X000001/sentence?number=1'))

    page.getCardElement('probationHistory', '.govuk-summary-list__key', 0).should('contain.text', 'Previous orders')

    page.getCardElement('probationHistory', '.govuk-summary-list__key', 1).should('contain.text', 'Previous breaches')

    page
      .getCardElement('probationHistory', '.govuk-summary-list__key', 2)
      .should('contain.text', 'Previous professional contacts')

    page
      .getCardElement('probationHistory', '.govuk-summary-list__value', 1)
      .should('contain.text', '2 previous breaches')

    page
      .getCardHeader('probationHistory')
      .within(() => cy.get('a').invoke('attr', 'href').should('equal', '/case/X000001/sentence/previous-orders'))
    page
      .getCardHeader('probationHistory')
      .within(() => cy.get('a').eq(1).invoke('attr', 'href').should('equal', '/case/X000001/address-book-professional'))
  })
})
