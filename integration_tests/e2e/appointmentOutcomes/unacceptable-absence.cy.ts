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
  uncheckAllRadios,
} from '../appointments/utils'
import SendLetterPage from '../../pages/appointmentOutcomes/send-letter.page'
import InitiateBreachOrRecallPage from '../../pages/appointmentOutcomes/initiate-breach-or-recall.page'
import AddNotePage from '../../pages/appointments/add-note.page'
import EnforcementActionPage from '../../pages/appointmentOutcomes/enforcement-action.page'
import { ExpectedOption, Journey, checkOptionRedirects } from './imports'
import { SentenceType } from '../../../server/data/model/sentenceDetails'
import RescheduleCheckYourAnswerPage from '../../pages/appointments/reschedule-check-your-answer.page'
import UnacceptableAbsencePage from '../../pages/appointmentOutcomes/unacceptable-absence.page'

let manageAppointmentPage: ManageAppointmentPage
let outcomePage: OutcomePage
let attendedFailedToComplyPage: AttendedFailedToComplyPage
let checkYourAnswersPage: RescheduleCheckYourAnswerPage
let unacceptableAbsencePage: UnacceptableAbsencePage

const loadPage = ({
  journey = 'MANAGE',
  sentenceType = 'COMMUNITY',
  isProbationPractitioner = false,
}: { journey?: Journey; sentenceType?: SentenceType; isProbationPractitioner?: boolean } = {}): void => {
  cy.task('stubAppointment', { eventId: '2501192724', isFuture: false })
  if (isProbationPractitioner) {
    cy.task('stubProbationPractitioner', { username: 'USER1' })
  }
  if (sentenceType === 'CUSTODY') {
    cy.task('stubSentences', { sentenceType: 'CUSTODY' })
  }
  if (journey === 'MANAGE') {
    cy.visit(`/case/${crn}/appointments/appointment/${appointmentId}/manage`)
    manageAppointmentPage = new ManageAppointmentPage()
    manageAppointmentPage.getTaskLink(1).click()
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
  outcomePage = new OutcomePage()
  uncheckAllRadios()
  cy.get(`.govuk-radios__input[value=UNACCEPTABLE_ABSENCE]`).click()
  outcomePage.getSubmitBtn().click()
}

type RedirectPages = SendLetterPage | InitiateBreachOrRecallPage | AddNotePage | EnforcementActionPage

const getExpectedOptions = (): ExpectedOption<RedirectPages>[] => {
  const expectedOptions: ExpectedOption<RedirectPages>[] = [
    { value: 'SEND_LETTER', text: 'Send a letter', RedirectPage: SendLetterPage, redirectPageName: 'Send a letter' },
    {
      value: 'BREACH_RECALL_INITIATED',
      text: `Initiate a breach`,
      RedirectPage: InitiateBreachOrRecallPage,
      redirectPageTitle: `Initiate a breach`,
    },
    {
      value: 'BREACH_RECALL_INITIATED_AND_SEND_LETTER',
      text: `Initiate a breach and send a letter`,
      RedirectPage: InitiateBreachOrRecallPage,
      redirectPageTitle: `Initiate a breach`,
    },
    {
      value: 'REFER_TO_OFFENDER_MANAGER',
      text: 'Refer to offender manager',
      hint: 'Notify the allocated probation practitioner so they can take action.',
      redirectPageTitle: 'Add a note',
      RedirectPage: AddNotePage,
    },
    {
      value: 'NO_FURTHER_ACTION',
      text: 'No further action',
      RedirectPage: AddNotePage,
      redirectPageTitle: 'Add a note',
    },
    {
      value: 'DIFFERENT_ACTION',
      text: 'I want to add a different action',
      RedirectPage: EnforcementActionPage,
      redirectPageTitle: 'Select an enforcement action for Alton’s failure to comply',
    },
  ]
  return expectedOptions
}

describe('Unacceptable absence', () => {
  afterEach(() => {
    cy.task('resetMocks')
  })
  it('should render the page in the manage appointment journey', () => {
    loadPage()
    unacceptableAbsencePage = new UnacceptableAbsencePage()
    unacceptableAbsencePage.checkPageTitle('enforcement action for Alton’s failure to comply')
  })
  it('should render the page in the arrange appointment journey', () => {
    loadPage({ journey: 'ARRANGE' })
    unacceptableAbsencePage = new UnacceptableAbsencePage()
    unacceptableAbsencePage.checkPageTitle('enforcement action for Alton’s failure to comply')
  })
  it('should render the page in the reschedule appointment journey', () => {
    loadPage({ journey: 'RESCHEDULE' })
    unacceptableAbsencePage = new UnacceptableAbsencePage()
    unacceptableAbsencePage.checkPageTitle('enforcement action for Alton’s failure to comply')
  })
  it('should show validation error when no option is selected', () => {
    const msg = 'Select an action for their unacceptable absence'
    loadPage()
    attendedFailedToComplyPage = new AttendedFailedToComplyPage()
    attendedFailedToComplyPage.getSubmitBtn().click()
    attendedFailedToComplyPage.checkErrorSummaryBox([msg])
    cy.get(`#appointments-${crn}-${appointmentId}-outcome-unacceptableAbsence-error`).should('contain.text', msg)
  })
  it('should redirect to the correct page when an option is selected', () => {
    const options = getExpectedOptions()
    loadPage()
    checkOptionRedirects(options, AttendedFailedToComplyPage)
  })
})
