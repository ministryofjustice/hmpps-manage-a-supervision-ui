import Page from '../page'

export default class AppointmentPreviewPage extends Page {
  constructor() {
    super(`Appointments you’re arranging`)
  }

  getAppointmentSection = (id: string) => {
    return cy.get(`section[data-qa="${id}"]`)
  }

  getAppointmentHeading = (id: string) => {
    return cy.get(`[data-qa="${id}"] h2`)
  }

  getAppointmentTableHeading = (id: string, index: number) => {
    return cy.get(`[data-qa="${id}"] table thead tr th:nth-child(${index})`)
  }

  getAppointmentRows = (id: string) => {
    return cy.get(`[data-qa="${id}"] tbody tr`)
  }

  getAppointmentRowDate = (id: string, index: number) => {
    return cy.get(`[data-qa="${id}"] tbody tr:nth-child(${index}) td:first-child`)
  }

  getAppointmentRowTime = (id: string, index: number) => {
    return cy.get(`[data-qa="${id}"] tbody tr:nth-child(${index}) td:last-child`)
  }
}
