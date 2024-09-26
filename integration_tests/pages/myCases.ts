import Page, { PageElement } from './page'

export default class YourCasesPage extends Page {
  constructor() {
    super('My cases')
  }

  getPagination = (): PageElement => cy.get(`[data-qa=pagination]`)
}
