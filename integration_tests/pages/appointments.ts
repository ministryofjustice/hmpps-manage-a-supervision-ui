import Page, { PageElement } from './page'

export default class AppointmentsPage extends Page {
  constructor() {
    super('Appointments')
  }

  checkOnPage(): void {
    // Don't check title
  }

  upcomingAppointmentType = (rowNum: number): PageElement => cy.get(`[data-qa=upcomingAppointmentType${rowNum}]`)

  upcomingAppointmentDate = (rowNum: number): PageElement => cy.get(`[data-qa=upcomingAppointmentDate${rowNum}]`)

  upcomingAppointmentTime = (rowNum: number): PageElement => cy.get(`[data-qa=upcomingAppointmentTime${rowNum}]`)

  pastAppointmentType = (rowNum: number): PageElement => cy.get(`[data-qa=pastAppointmentType${rowNum}]`)

  pastAppointmentDate = (rowNum: number): PageElement => cy.get(`[data-qa=pastAppointmentDate${rowNum}]`)

  pastAppointmentTime = (rowNum: number): PageElement => cy.get(`[data-qa=pastAppointmentTime${rowNum}]`)
}
