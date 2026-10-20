import { checkPopHeader, checkRiskToStaffAlert } from './imports'
import AppointmentCheckYourAnswersPage from '../../pages/appointments/check-your-answers.page'
import AppointmentNotePage from '../../pages/appointments/note.page'
import { crn, uuid } from './imports/common'
import {
  completeSentencePage,
  completeTypePage,
  completeLocationDateTimePage,
  completeTextMessageConfirmationPage,
} from './utils'
import TextMessageConfirmationPage from '../../pages/appointments/text-message-confirmation.page'
import AppointmentLocationDateTimePage from '../../pages/appointments/location-date-time.page'

const loadPage = ({ _crn = crn, allowSms = true } = {}) => {
  cy.visit(`/case/${crn}/arrange-appointment/${uuid}/sentence`)
  completeSentencePage({ eventIndex: 1, crnOverride: _crn })
  completeTypePage()
  completeLocationDateTimePage({ crnOverride: _crn, allowSms })
  if (allowSms) {
    completeTextMessageConfirmationPage({ _crn, _uuid: uuid, index: 1 })
  }
}
let appointmentNotePage: AppointmentNotePage
let textMessageConfirmationPage: TextMessageConfirmationPage
let locationDateTimePage: AppointmentLocationDateTimePage
describe('Add supporting information (optional)', () => {
  beforeEach(() => {
    cy.task('resetMocks')
  })

  it('should link back to the text message confirmation page if allow sms consent is yes', () => {
    loadPage()
    appointmentNotePage = new AppointmentNotePage()
    cy.get('.govuk-back-link').click()
    textMessageConfirmationPage = new TextMessageConfirmationPage()
    textMessageConfirmationPage.checkOnPage()
  })

  it('should link back to the location, date and time page if allow sms consent is no', () => {
    cy.task('stubAllowSmsFalse')
    loadPage({ allowSms: false })
    appointmentNotePage = new AppointmentNotePage()
    cy.get('.govuk-back-link').click()
    locationDateTimePage = new AppointmentLocationDateTimePage()
    locationDateTimePage.checkOnPage()
  })

  it('should render the pop header', () => {
    loadPage()
    appointmentNotePage = new AppointmentNotePage()
    appointmentNotePage.checkOnPage()
    checkPopHeader({ name: 'Alton Berge', appointments: true, headerCrn: 'X778160' })
  })
  it('should display validation errors if note is more than 12000 character', () => {
    loadPage()
    appointmentNotePage = new AppointmentNotePage()
    const note = 'x'.repeat(12001)
    cy.get(`#appointments-${crn}-${uuid}-notes`).invoke('val', note).trigger('input')
    cy.get(`#appointments-${crn}-${uuid}-sensitivity-2`).click()
    appointmentNotePage.getSubmitBtn().click()
    appointmentNotePage.checkErrorSummaryBox(['Note must be 12000 characters or less'])
    appointmentNotePage
      .getElement(`#appointments-${crn}-${uuid}-notes-error`)
      .should('contain.text', 'Note must be 12000 characters or less')
    cy.get('.govuk-character-count__status').should('contain.text', 'You have 1 character too many')
  })

  it('should count a return as 1 character', () => {
    loadPage()
    appointmentNotePage = new AppointmentNotePage()
    cy.get(`#appointments-${crn}-${uuid}-notes`).then($el => {
      const paragraph = 'x'.repeat(6000)
      const value = `${paragraph}\n\n${paragraph}`
      $el.val(value)
      $el[0].dispatchEvent(new Event('input', { bubbles: true }))
    })
    cy.get(`#appointments-${crn}-${uuid}-sensitivity-2`).click()
    appointmentNotePage.getSubmitBtn().click()
    appointmentNotePage.checkErrorSummaryBox(['Note must be 12000 characters or less'])
    appointmentNotePage
      .getElement(`#appointments-${crn}-${uuid}-notes-error`)
      .should('contain.text', 'Note must be 12000 characters or less')
    cy.get('.govuk-character-count__status').should('contain.text', 'You have 2 characters too many')
  })
  it('should show validation errors if sensitivity option is not selected', () => {
    loadPage()
    appointmentNotePage = new AppointmentNotePage()
    cy.get('textarea').clear()
    cy.get('textarea').type('A test note')
    appointmentNotePage.getSubmitBtn().click()
    it('should display the error summary box', () => {
      appointmentNotePage.checkErrorSummaryBox([
        'Select whether or not the appointment note contains sensitive information',
      ])
    })
    it('should display the error messages', () => {
      appointmentNotePage.getElement(`#appointments-${crn}-${uuid}-sensitivity-error`).should($error => {
        expect($error.text().trim()).to.include(
          'Select whether or not the appointment note contains sensitive information',
        )
      })
    })
  })
  it('should be on the check your answers page', () => {
    loadPage()
    appointmentNotePage = new AppointmentNotePage()
    cy.get(`#appointments-${crn}-${uuid}-sensitivity-2`).click()
    appointmentNotePage.getSubmitBtn().click()
    const checkYourAnswersPage = new AppointmentCheckYourAnswersPage()
    checkYourAnswersPage.checkPageTitle('Check your answers')
  })
  it('should check for correct text', () => {
    loadPage()
    appointmentNotePage = new AppointmentNotePage()
    cy.get('[data-qa="visorReport"]').should(
      'contain.text',
      'This is information that you believe must be recorded but not shared with a person on probation. If they make a request for their record, the Data Protection Team will decide whether the information can be shared.',
    )
  })
})
describe('Risk to staff alert', () => {
  it('should display the alert with medium risk to staff details', () => {
    loadPage({ _crn: 'X000001' })
    appointmentNotePage = new AppointmentNotePage()
    checkRiskToStaffAlert('X000001', 'Caroline', 'medium')
  })
})
