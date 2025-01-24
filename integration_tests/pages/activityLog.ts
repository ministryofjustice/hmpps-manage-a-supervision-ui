import Page, { PageElement } from './page'

export default class ActivityLogPage extends Page {
  constructor() {
    super('Activity log')
  }

  getApplyFiltersButton = (): PageElement => cy.get('[data-qa="submit-button"]')

  getKeywordsInput = (): PageElement => cy.get('[data-qa="keywords"] input')

  getDateFromInput = (): PageElement => cy.get('[data-qa="date-from"] input')

  getDateFromToggle = (): PageElement => cy.get('[data-qa="date-from"] .moj-datepicker__toggle')

  getDateFromDialog = (): PageElement => cy.get('[data-qa="date-from"] .moj-datepicker__dialog')

  getDateToInput = (): PageElement => cy.get('[data-qa="date-to"] input')

  getDateToToggle = (): PageElement => cy.get('[data-qa="date-to"] .moj-datepicker__toggle')

  getDateToDialog = (): PageElement => cy.get('[data-qa="date-to"] .moj-datepicker__dialog')

  getActivity = (index: string): PageElement => cy.get(`[data-qa=timeline${index}Card]`)

  getComplianceFilter = (index: string): PageElement => cy.get(`[data-qa="compliance"] input:nth-of-type(${index})`)
}
