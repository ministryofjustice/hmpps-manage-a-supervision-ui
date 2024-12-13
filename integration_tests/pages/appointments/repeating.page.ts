import Page from '../page'

export default class AppointmentRepeatingPage extends Page {
  constructor() {
    super('Will the appointment repeat?')
  }

  getLastAppointment = () => {
    return cy.get('[data-last-appointment]')
  }

  getLastAppointmentHeading = () => {
    return cy.get('[data-last-appointment] h3')
  }

  getLastAppointmentDate = () => {
    return cy.get('[data-last-appointment] p')
  }
}
