import { crn, appointmentId } from '../appointments/imports/common'
import AttendedFailedToComplyPage from '../../pages/appointmentOutcomes/attended-failed-to-comply.page'
import ManageAppointmentPage from '../../pages/appointments/manage-appointment.page'
import OutcomePage from '../../pages/appointmentOutcomes/outcome.page'
import {
  completeSentencePage,
  completeTypePage,
  completeLocationDateTimePage,
  completeRescheduleAppointmentPage,
  getUuid,
} from '../appointments/utils'
import SendLetterPage from '../../pages/appointmentOutcomes/send-letter.page'
import AddNotePage from '../../pages/appointments/add-note.page'
import { Journey } from './imports'
import { SentenceType } from '../../../server/data/model/sentenceDetails'
import RescheduleCheckYourAnswerPage from '../../pages/appointments/reschedule-check-your-answer.page'
import { AppointmentEnforcementAction } from '../../../server/models/Appointments'
import { PersonAppointmentEnforcementAction } from '../../../server/data/model/schedule'
import UpdateEnforcementActionPage from '../../pages/appointmentOutcomes/update-enforcement-action.page'

let manageAppointmentPage: ManageAppointmentPage
let outcomePage: OutcomePage
let attendedFailedToComplyPage: AttendedFailedToComplyPage
let checkYourAnswersPage: RescheduleCheckYourAnswerPage
let sendLetterPage: SendLetterPage
let addNotePage: AddNotePage
let updateEnforcementActionPage: UpdateEnforcementActionPage

interface Params {
  eventId: string
  isFuture: boolean
  outcome?: string
  action?: string
  hasOutcome?: boolean
  hasComplied?: boolean
  enforcementAction?: PersonAppointmentEnforcementAction
}

const loadPage = ({
  journey = 'MANAGE',
  sentenceType = 'COMMUNITY',
  action = 'SEND_LETTER',
  description = '12 month Community order',
  pss = false,
  updateAction = false,
}: {
  journey?: Journey
  sentenceType?: SentenceType
  action?: AppointmentEnforcementAction
  description?: string
  pss?: boolean
  updateAction?: boolean
} = {}): void => {
  const params: Params = { eventId: '2501192724', isFuture: false }
  if (updateAction) {
    params.outcome = 'Attended - failed to comply'
    params.action = 'First warning letter sent'
    params.hasOutcome = true
    params.hasComplied = false
    params.enforcementAction = { code: 'EA02', description: 'First warning letter sent' }
  }
  cy.task('stubAppointment', params)
  if (sentenceType !== 'COMMUNITY') {
    cy.task('stubSentences', { sentenceType, description, pss })
  }
  if (journey === 'MANAGE') {
    cy.visit(`/case/${crn}/appointments/appointment/${appointmentId}/manage`)
    manageAppointmentPage = new ManageAppointmentPage()
    const index = updateAction ? 2 : 1
    manageAppointmentPage.getTaskLink(index).click()
  }
  if (journey === 'ARRANGE') {
    completeSentencePage()
    completeTypePage(1)
    completeLocationDateTimePage({ dateInPast: true })
  }
  if (journey === 'RESCHEDULE') {
    completeRescheduleAppointmentPage({ crn })
    checkYourAnswersPage = new RescheduleCheckYourAnswerPage()
    checkYourAnswersPage.getSubmitBtn().click()
    getUuid(2).then(pageUuid => {
      completeLocationDateTimePage({ dateInPast: true, uuidOveride: pageUuid })
    })
  }
  if (updateAction) {
    updateEnforcementActionPage = new UpdateEnforcementActionPage()
    cy.get(`.govuk-radios__input[value=SEND_ANOTHER_LETTER]`).click()
    updateEnforcementActionPage.getSubmitBtn().click()
  } else {
    outcomePage = new OutcomePage()
    cy.get(`.govuk-radios__input[value=ATTENDED_FAILED_TO_COMPLY]`).click()
    outcomePage.getSubmitBtn().click()
  }
  if (!updateAction) {
    attendedFailedToComplyPage = new AttendedFailedToComplyPage()
    cy.get(`.govuk-radios__input[value=${action}]`).click()
    attendedFailedToComplyPage.getSubmitBtn().click()
  }
}

describe('Send a letter', () => {
  afterEach(() => {
    cy.task('resetMocks')
  })
  it('should render the page, show validation errors and redirect once all options are selected', () => {
    const msgs = ['Select who will send the letter', 'Select the type of letter']
    loadPage()
    sendLetterPage = new SendLetterPage()
    sendLetterPage.checkPageTitle('Send a letter')

    sendLetterPage.getSubmitBtn().click()
    sendLetterPage.checkErrorSummaryBox(msgs)
    cy.get(`#appointments-${crn}-${appointmentId}-outcome-letterSentBy-error`).should('contain.text', msgs[0])
    cy.get(`#appointments-${crn}-${appointmentId}-outcome-letterType-error`).should('contain.text', msgs[1])

    cy.get('[data-module="govuk-radios"]').eq(0).find('.govuk-radios__item').eq(0).find('input').click()
    cy.get('[data-module="govuk-radios"]').eq(1).find('.govuk-radios__item').eq(0).find('input').click()
    sendLetterPage.getSubmitBtn().click()
    addNotePage = new AddNotePage()
    addNotePage.checkOnPage()
  })
  it('should render the page in the arrange appointment journey', () => {
    loadPage({ journey: 'ARRANGE' })
    sendLetterPage = new SendLetterPage()
    sendLetterPage.checkPageTitle('Send a letter')
  })
  it('should render the page in the reschedule appointment journey', () => {
    loadPage({ journey: 'RESCHEDULE' })
    sendLetterPage = new SendLetterPage()
    sendLetterPage.checkPageTitle('Send a letter')
  })
  it('should render the page when linked to from the update enforcement action page', () => {
    loadPage({ updateAction: true })
    sendLetterPage = new SendLetterPage()
    sendLetterPage.checkPageTitle('Send a letter')
  })
})
