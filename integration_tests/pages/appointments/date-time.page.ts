import Page from '../page'

export default class AppointmentDateTimePage extends Page {
  constructor() {
    super('Enter the date and time of the appointment')
  }

  getDatePickerToggle = () => {
    return cy.get('.moj-datepicker__toggle')
  }

  getDatePickerDialog = () => {
    return cy.get('.moj-datepicker__dialog')
  }

  getActiveDayButton = () => {
    return cy.get('.moj-datepicker__button--today')
  }

  getDatePickerInput = () => {
    return cy.get('.moj-js-datepicker-input')
  }

  getTimePickerList = () => {
    return cy.get('.ui-timepicker-list')
  }

  getTimePickerListItems = () => {
    return cy.get('.ui-timepicker-list li', { timeout: 3000 })
  }
}
