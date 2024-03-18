import Page, { PageElement } from '../page'

export default class ContactPage extends Page {
  constructor() {
    super('Contact')
  }

  getRowData = (rowName: string, type: string): PageElement => {
    return cy.get(`[data-qa=${rowName}${type}]`)
  }
}
