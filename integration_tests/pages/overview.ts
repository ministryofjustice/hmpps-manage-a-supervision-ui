import Page, { PageElement } from './page'

export default class OverviewPage extends Page {
  constructor() {
    super('Overview')
  }

  headerCrn = (): PageElement => cy.get('[data-qa=crn]')

  headerName = (): PageElement => cy.get('[data-qa=name]')

  pageHeading = (): PageElement => cy.get('[data-qa=pageHeading]')

  getTab = (tabName: string): PageElement => cy.get(`[data-qa=${tabName}Tab]`)

  getCardHeader = (cardName: string): PageElement => cy.get(`[data-qa=${cardName}Card]`)

  getRowData = (cardName: string, rowName: string, type: string): PageElement => {
    return cy.get(`[data-qa=${cardName}Card]`).get(`[data-qa=${rowName}${type}]`)
  }
}
