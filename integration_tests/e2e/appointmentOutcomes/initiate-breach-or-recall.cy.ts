import { checkPopHeader } from '../appointments/imports'
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
import InitiateBreachOrRecallPage from '../../pages/appointmentOutcomes/initiate-breach-or-recall.page'
import AddNotePage from '../../pages/appointments/add-note.page'
import { ExpectedOption, Journey, checkOptions, checkBreachOrRecallWarningBanner } from './imports'
import { SentenceType } from '../../../server/data/model/sentenceDetails'
import RescheduleCheckYourAnswerPage from '../../pages/appointments/reschedule-check-your-answer.page'

let manageAppointmentPage: ManageAppointmentPage
let outcomePage: OutcomePage
let attendedFailedToComplyPage: AttendedFailedToComplyPage
let checkYourAnswersPage: RescheduleCheckYourAnswerPage
let initiateBreachOrRecallPage: InitiateBreachOrRecallPage

const loadPage = ({
  journey = 'MANAGE',
  sentenceType = 'COMMUNITY',
  sendLetter = false,
  pss = false,
  description = '12 month Community order',
}: {
  journey?: Journey
  sentenceType?: SentenceType
  sendLetter?: boolean
  pss?: boolean
  description?: string
} = {}): void => {
  cy.task('stubAppointment', { eventId: '2501192724', isFuture: false })
  if (sentenceType === 'CUSTODY') {
    cy.task('stubSentences', { sentenceType: 'CUSTODY' })
  }
  if (sentenceType === 'COMMUNITY' && (pss || description !== '12 month Community order')) {
    cy.task('stubSentences', { sentenceType: 'COMMUNITY', pss, description })
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
  cy.get(`.govuk-radios__input[value=ATTENDED_FAILED_TO_COMPLY]`).click()
  outcomePage.getSubmitBtn().click()
  attendedFailedToComplyPage = new AttendedFailedToComplyPage()
  const action = sendLetter ? 'BREACH_RECALL_INITIATED_AND_SEND_LETTER' : 'BREACH_RECALL_INITIATED'
  cy.get(`.govuk-radios__input[value=${action}]`).click()
  attendedFailedToComplyPage.getSubmitBtn().click()
}

type RedirectPages = AddNotePage

type OptionsFor = 'BREACH_CREATED_BY' | 'LETTER_SENT_BY' | 'LETTER_TYPE'
const getExpectedOptions = ({
  optionsFor = 'BREACH_CREATED_BY',
  sentenceType = 'COMMUNITY',
  pss = false,
  youth = false,
}: {
  optionsFor?: OptionsFor
  sentenceType?: SentenceType
  pss?: boolean
  youth?: boolean
} = {}): ExpectedOption<RedirectPages>[] => {
  let expectedOptions: ExpectedOption<RedirectPages>[] = []
  if (optionsFor === 'BREACH_CREATED_BY') {
    const text = sentenceType === 'COMMUNITY' ? 'breach' : 'recall'
    expectedOptions = [
      { value: 'CASE_ADMIN', text: 'Case administrator', hint: 'This will be added to the appointment notes.' },
      {
        value: 'USER',
        text: `I’ll initiate the ${text}`,
      },
    ]
  }
  if (optionsFor === 'LETTER_SENT_BY') {
    expectedOptions = [
      {
        value: 'CASE_ADMIN',
        text: 'Case administrator',
        hint: 'You need to follow your local process to request a letter.',
      },
      {
        value: 'USER',
        text: 'I’ll send the letter',
      },
    ]
  }
  if (optionsFor === 'LETTER_TYPE') {
    if (sentenceType === 'CUSTODY') {
      expectedOptions = [
        { value: 'LICENCE_COMPLIANCE_LETTER_SENT', text: 'Licence compliance letter' },
        { value: 'OTHER_ENFORCEMENT_LETTER_SENT', text: 'A different enforcement letter' },
      ]
    }
    if (sentenceType === 'COMMUNITY' || youth || pss) {
      expectedOptions = [
        { value: 'BREACH_LETTER_SENT', text: 'Breach warning letter' },
        { value: 'OTHER_ENFORCEMENT_LETTER_SENT', text: 'A different enforcement letter' },
      ]
    }
  }
  return expectedOptions
}

const checkLetterTypeOptions = ({
  sentenceType = 'COMMUNITY',
  title,
  youth = false,
  pss = false,
}: {
  sentenceType?: SentenceType
  title: string
  youth?: boolean
  pss?: boolean
}) => {
  initiateBreachOrRecallPage = new InitiateBreachOrRecallPage()
  initiateBreachOrRecallPage.checkPageTitle(title)
  checkOptions(getExpectedOptions({ sentenceType }))
  checkOptions(getExpectedOptions({ optionsFor: 'LETTER_SENT_BY' }), 1)
  checkOptions(getExpectedOptions({ optionsFor: 'LETTER_TYPE', sentenceType, youth, pss }), 2)
  cy.get('[data-module="govuk-radios"]').should('have.length', 3)
}

const checkJourney = (journey: Journey) => {
  it(`should link to the page in the ${journey.toLowerCase()} appointment journey with the correct back link`, () => {
    loadPage({ journey })
    initiateBreachOrRecallPage = new InitiateBreachOrRecallPage()
    initiateBreachOrRecallPage.checkPageTitle('Initiate a breach')
    checkPopHeader({ name: 'Alton Berge', appointments: true, headerCrn: crn })
    getUuid(3).then(uuid => {
      const expectedLink =
        journey === 'MANAGE'
          ? `/case/${crn}/appointments/appointment/${appointmentId}/outcome/attended-failed-to-comply`
          : `/case/${crn}/arrange-appointment/${uuid}/outcome/attended-failed-to-comply`
      attendedFailedToComplyPage.getBackLink().should('have.attr', 'href', expectedLink)
    })
  })
}

describe('Initiate a breach or recall', () => {
  afterEach(() => {
    cy.task('resetMocks')
  })
  checkJourney('MANAGE')
  checkJourney('ARRANGE')
  checkJourney('RESCHEDULE')

  it('should render the recall options if sentence type is CUSTODY', () => {
    loadPage({ sentenceType: 'CUSTODY', sendLetter: true })
    checkLetterTypeOptions({ sentenceType: 'CUSTODY', title: 'Initiate a recall and send a letter' })
  })
  it('should render the breach letter options if sentence type is YOUTH COMMUNITY', () => {
    loadPage({ sendLetter: true, description: '204 C JA - Youth Rehabilitation Order' })
    checkLetterTypeOptions({ title: 'Initiate a breach and send a letter', youth: true })
  })
  it('should render the breach letter options if sentence type is PSS', () => {
    loadPage({ sendLetter: true, pss: true })
    checkLetterTypeOptions({ title: 'Initiate a breach and send a letter', pss: true })
  })

  checkBreachOrRecallWarningBanner(loadPage, InitiateBreachOrRecallPage)
})
