import Page from '../page'

export default class AppointmentConfirmationPage extends Page {
  constructor() {
    super(`Appointments arranged`)
  }

  getPanel = () => {
    return cy.get(`.govuk-panel`)
  }

  getWhatHappensNext = () => {
    return cy.get(`[data-qa="what-happens-next"]`)
  }
}
