import Page, { PageElement } from '../page'

export default class AddressPage extends Page {
  constructor() {
    super('Addresses')
  }

  getRowData = (addressId: string, rowName: string, type: string): PageElement => {
    return cy.get(`[data-qa=${addressId}Section]`).within(() => cy.get(`[data-qa=${rowName}${type}]`))
  }

  getTableHeader = (addressId: string): PageElement => {
    return cy.get(`[data-qa=${addressId}Section]`).get(`[class=app-summary-card__title]`)
  }
}
