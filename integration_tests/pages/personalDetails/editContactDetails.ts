import Page, { PageElement } from '../page'

export default class EditContactDetails extends Page {
  constructor() {
    super('Edit contact details')
  }

  getNoFixedAddress = (addressId: string, rowName: string, type: string): PageElement => {
    return cy.get(`#noFixedAddress`)
  }

  getElement = (name: string): PageElement => {
    return cy.get(`[data-qa="${name}"]`)
  }

  getElementInput = (name: string): PageElement => {
    return cy.get(`[data-qa="${name}"] input`)
  }

  getDateElementInput = (name: string): PageElement => {
    return cy.get(`[data-qa="${name}"] govuk-input moj-js-datepicker-input`)
  }

  getCheckboxField = (name: string): PageElement => {
    return cy.get(`input[type="checkbox"]`)
  }
}
