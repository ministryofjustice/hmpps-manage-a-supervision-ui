import Page, { PageElement } from './page'

export default class SchedulePage extends Page {
  constructor() {
    super('Schedule')
  }

  appointmentRow = (rowNum: number): PageElement => cy.get(`[data-qa=appointment${rowNum}]`)
}
