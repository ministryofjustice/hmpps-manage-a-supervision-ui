export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T>(constructor: new () => T): T {
    return new constructor()
  }

  constructor(private readonly title: string) {
    this.checkOnPage()
  }

  checkOnPage(): void {
    cy.get('h1').contains(this.title)
  }

  signOut = (): PageElement => cy.get('[data-qa=signOut]')

  manageDetails = (): PageElement => cy.get('[data-qa=manageDetails]')

  headerCrn = (): PageElement => cy.get('[data-qa=crn]')

  headerName = (): PageElement => cy.get('[data-qa=name]')

  pageHeading = (): PageElement => cy.get('[data-qa=pageHeading]')

  getTab = (tabName: string): PageElement => cy.get(`[data-qa=${tabName}Tab]`)

  getCardHeader = (cardName: string): PageElement =>
    cy.get(`[class=app-summary-card__header]`).get(`[data-qa=${cardName}Card]`)

  getCardElement = (cardName: string, element: string, index: number): PageElement =>
    this.getCardHeader(cardName).within(() => cy.get(element).eq(index))

  getRowData = (cardName: string, rowName: string, type: string): PageElement => {
    return cy.get(`[data-qa=${cardName}Card]`).within(() => cy.get(`[data-qa=${rowName}${type}]`))
  }

  getRowDataIndex = (cardName: string, rowName: string, type: string, index: number): PageElement => {
    return cy
      .get(`[data-qa=${cardName}Card]`)
      .eq(index)
      .within(() => cy.get(`[data-qa=${rowName}${type}]`))
  }

  assertPageElementAtIndexWithin = (
    element: string,
    index: number,
    withinElement: string,
    withinIndex: number,
    value: string,
  ) => {
    cy.get(element)
      .eq(index)
      .within(() => cy.get(withinElement).eq(withinIndex).contains(value))
  }

  assertAnchorElementAtIndex = (element: string, index: number, value: string) => {
    cy.get(element)
      .eq(index)
      .within(() => cy.get('a').invoke('attr', 'href').should('equal', value))
  }

  assertAnchorElementAtIndexWithin = (element: string, index: number, anchorIndex: number, value: string) => {
    cy.get(element)
      .eq(index)
      .within(() => cy.get('a').eq(anchorIndex).invoke('attr', 'href').should('equal', value))
  }

  createAliasAtIndexWithin = (
    element: string,
    index: number,
    withinElement: string,
    withinIndex: number,
    aliasName: string,
  ) => {
    cy.get(element)
      .eq(index)
      .within(() => cy.get(withinElement).eq(withinIndex).as(aliasName))
  }

  backLink = (): PageElement => cy.get('.govuk-back-link')

  submitBtn = (): PageElement => cy.get('.govuk-button')

  getRadio = (index: number): PageElement => {
    return cy.get(`.govuk-radios__item:nth-child(${index}) input`)
  }

  getRadioLabel = (index: number): PageElement => {
    return cy.get(`.govuk-radios__item:nth-child(${index}) label`)
  }

  getErrorSummaryBox = (): PageElement => {
    return cy.get('.govuk-error-summary')
  }

  getAllErrorSummaryLinks = (): PageElement => {
    return cy.get('.govuk-error-summary__list a')
  }

  getErrorSummaryLink = (index: number): PageElement => {
    return cy.get(`.govuk-error-summary__list a:nth-child(${index})`)
  }

  getErrorMessage = (uuid: string, name: string) => {
    return cy.get(`#appointments-X778160-19a88188-6013-43a7-bb4d-6e338516818f-type-error`)
  }

  getElement = (selector: string) => {
    return cy.get(selector)
  }
}
