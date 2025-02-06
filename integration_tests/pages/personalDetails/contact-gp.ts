import Page, { PageElement } from '../page'

export default class ContactGPPage extends Page {
  constructor() {
    super('GP')
  }

  getRowData = (rowName: string, type: string): PageElement => {
    return cy.get(`[data-qa=${rowName}${type}]`)
  }
}
