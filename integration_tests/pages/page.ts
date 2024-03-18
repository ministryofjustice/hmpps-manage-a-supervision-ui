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

  getCardHeader = (cardName: string): PageElement => cy.get(`[data-qa=${cardName}Card]`)

  getRowData = (cardName: string, rowName: string, type: string): PageElement => {
    return cy.get(`[data-qa=${cardName}Card]`).within(() => cy.get(`[data-qa=${rowName}${type}]`))
  }
}
