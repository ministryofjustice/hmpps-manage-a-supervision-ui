import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('My cases')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerPhaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')
}
