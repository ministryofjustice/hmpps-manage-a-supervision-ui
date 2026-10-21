import { DateTime } from 'luxon'
import { crn, appointmentId } from '../appointments/imports/common'
import FailedToAttendPage from '../../pages/appointmentOutcomes/failed-to-attend.page'
import ManageAppointmentPage from '../../pages/appointments/manage-appointment.page'
import OutcomePage from '../../pages/appointmentOutcomes/outcome.page'
import {
  completeSentencePage,
  completeTypePage,
  completeLocationDateTimePage,
  completeRescheduleAppointmentPage,
  getUuid,
  uncheckAllRadios,
} from '../appointments/utils'
import SendLetterPage from '../../pages/appointmentOutcomes/send-letter.page'
import InitiateBreachOrRecallPage from '../../pages/appointmentOutcomes/initiate-breach-or-recall.page'
import AddNotePage from '../../pages/appointments/add-note.page'
import RescheduleCheckYourAnswerPage from '../../pages/appointments/reschedule-check-your-answer.page'
import EnforcementActionPage from '../../pages/appointmentOutcomes/enforcement-action.page'
import { ExpectedOption, Journey, checkOptionRedirects } from './imports'
import { type SentenceType } from '../../../server/data/model/sentenceDetails'

let manageAppointmentPage: ManageAppointmentPage
let outcomePage: OutcomePage
let failedToAttendPage: FailedToAttendPage
let checkYourAnswersPage: RescheduleCheckYourAnswerPage

const now = DateTime.now()
const date = now.plus({ days: 2 })
const responseByDate = date.toFormat('yyyy-MM-dd')

interface Args {
  journey?: Journey
  isProbationPractitioner?: boolean
  enforcementActionResponseByDate?: string
  sentenceType?: SentenceType
  startDateTime?: string
}

const loadPage = ({
  journey = 'MANAGE',
  enforcementActionResponseByDate = responseByDate,
  sentenceType = 'COMMUNITY',
  startDateTime = '2024-02-21T10:15:00.382936Z',
}: Args = {}): void => {
  cy.task('stubAppointment', {
    eventId: '2501192724',
    isFuture: false,
    enforcementActionResponseByDate,
    sentenceType,
    startDateTime,
  })
  if (journey === 'MANAGE') {
    cy.visit(`/case/${crn}/appointments/appointment/${appointmentId}/manage`)
    manageAppointmentPage = new ManageAppointmentPage()
    manageAppointmentPage.getTaskLink(1).click()
  }
  if (journey === 'RESCHEDULE') {
    completeRescheduleAppointmentPage({ crn })
    checkYourAnswersPage = new RescheduleCheckYourAnswerPage()
    checkYourAnswersPage.getSubmitBtn().click()
    getUuid(2).then(pageUuid => {
      completeLocationDateTimePage({ dateInPast: true, uuidOveride: pageUuid })
    })
  }
  if (journey === 'ARRANGE') {
    completeSentencePage()
    completeTypePage(1)
    completeLocationDateTimePage({ dateInPast: true })
  }
  outcomePage = new OutcomePage()
  uncheckAllRadios()
  cy.get(`.govuk-radios__input[value=FAILED_TO_ATTEND]`).click()
  outcomePage.getSubmitBtn().click()
}

type RedirectPages = SendLetterPage | InitiateBreachOrRecallPage | AddNotePage | EnforcementActionPage

const getExpectedOptions = ({ isProbationPractitioner = false } = {}): ExpectedOption<RedirectPages>[] => {
  const expectedOptions: ExpectedOption<RedirectPages>[] = [
    { value: 'SEND_LETTER', text: 'Send a letter', RedirectPage: SendLetterPage, redirectPageName: 'Send a letter' },
    {
      value: 'DECISION_PENDING_RESPONSE_FROM_PERSON_ON_PROBATION',
      text: 'Decision pending Alton’s response',
      RedirectPage: AddNotePage,
      redirectPageTitle: 'Add a note',
    },
  ]
  if (!isProbationPractitioner) {
    expectedOptions.push({
      value: 'REFER_TO_OFFENDER_MANAGER',
      text: 'Refer to offender manager',
      hint: 'Notify the allocated probation practitioner so they can take action.',
      RedirectPage: AddNotePage,
      redirectPageTitle: 'Add a note',
    })
  }
  expectedOptions.push({
    value: 'DIFFERENT_ACTION',
    text: 'I want to add a different action',
    RedirectPage: EnforcementActionPage,
    redirectPageTitle: 'Select an enforcement action for Alton’s failure to comply',
  })
  return expectedOptions
}

describe('Failed to attend', () => {
  beforeEach(() => {
    cy.task('resetMocks')
  })
  it('should link to the page in the manage appointment journey', () => {
    loadPage()
    failedToAttendPage = new FailedToAttendPage()
    failedToAttendPage.checkPageTitle(`Enforcement action for Alton’s absence`)
  })
  it('should link to the page in the arrange appointment journey', () => {
    loadPage({ journey: 'ARRANGE' })
    failedToAttendPage = new FailedToAttendPage()
    failedToAttendPage.checkPageTitle(`Enforcement action for Alton’s absence`)
  })
  it('should link to the page in the reschedule appointment journey', () => {
    loadPage({ journey: 'RESCHEDULE' })
    failedToAttendPage = new FailedToAttendPage()
    failedToAttendPage.checkPageTitle(`Enforcement action for Alton’s absence`)
  })
  it('should show validation error when no option is selected', () => {
    const msg = 'Select an enforcement action for their absence'
    loadPage({ journey: 'MANAGE' })
    failedToAttendPage = new FailedToAttendPage()
    failedToAttendPage.getSubmitBtn().click()
    failedToAttendPage.checkErrorSummaryBox([msg])
    cy.get(`#appointments-${crn}-${appointmentId}-outcome-failedToAttend-error`).should('contain.text', msg)
  })
  it('should redirect to the correct page when an option is selected', () => {
    const options = getExpectedOptions()
    loadPage({ journey: 'MANAGE' })
    checkOptionRedirects(options, FailedToAttendPage)
  })
})
