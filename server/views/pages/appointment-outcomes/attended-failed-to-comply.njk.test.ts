import * as cheerio from 'cheerio'
import httpMocks from 'node-mocks-http'
import { createNunjucksTestEnv } from '../../../testutils/nunjucksTestEnv'
import {
  AppointmentOutcomeProps,
  AppointmentOutcomeSentence,
  AppResponse,
  BreachOrRecallWarning,
  OutcomeTicket,
} from '../../../models/Locals'
import { Activity } from '../../../data/model/schedule'
import { AppointmentEnforcementAction, AttendedCompliedAppointment } from '../../../models/Appointments'
import { Option } from '../../../models/Option'
import { Name } from '../../../data/model/personalDetails'

const crn = 'X000001'
const contactId = '1234'
const page = 'attended-failed-to-comply'
const forename = 'James'
const error = 'Select an action for their failure to comply'

const options: Option<AppointmentEnforcementAction>[] = [
  { value: 'SEND_LETTER', text: 'Send a letter' },
  { value: 'BREACH_RECALL_INITIATED', text: 'Initiate a breach' },
  {
    value: 'BREACH_RECALL_INITIATED_AND_SEND_LETTER',
    text: 'Initiate a breach and send a letter',
  },
  {
    value: 'REFER_TO_OFFENDER_MANAGER',
    text: 'Refer to offender manager',
    hint: {
      text: 'Notify the allocated probation practitioner so they can take action.',
    },
  },
  { value: 'NO_FURTHER_ACTION', text: 'No further action' },
  { divider: 'or' },
  {
    value: 'DIFFERENT_ACTION',
    text: 'I want to add a different action',
  },
]

const ticket: OutcomeTicket = {
  title: 'James has had multiple counts of non-compliance in the past 12 months',
  html: '<p class="govuk-body">You should consider initiating a breach.</p><p class="govuk-body"><a class="govuk-link" href="" target="_blank" rel="noopener noreferrer">View a list of James’s non-compliance (opens in new tab)</a>.</p>',
  type: 'RED',
}

const breachOrRecallWarning: BreachOrRecallWarning = {
  title: `There is a live recall for this sentence`,
  text: `The recall for sentence order was initiated on 10 October 2026.`,
  type: 'RECALL',
}

const errorMessages: Record<string, string> = {
  [`appointments-${crn}-${contactId}-outcome-attendedFailedToComply`]: error,
}

const appointmentOutcome: Partial<AppointmentOutcomeProps<AttendedCompliedAppointment | Activity>> = {
  crn,
  id: contactId,
  uuid: undefined,
  contactId,
  forename,
  appointment: {} as Activity,
  documents: [],
  isValidParams: true,
  isInPast: true,
  reqUrl: '',
  baseUrl: '',
  baseOutcomeUrl: `/case/${crn}/appointments/appointment/${contactId}/outcome/${page}`,
  completedUrl: '',
  appointmentSession: {},
  isProbationPractitioner: false,
  appointmentHintText: '',
  sendBreachOrRecallLetter: false,
  sendLetter: false,
  showLetterTypeOptions: false,
  otherAction: false,
  sentence: {} as AppointmentOutcomeSentence,
  backLink: `/case/${crn}/appointments/appointment/${contactId}/outcome`,
  breachOrRecallWarning: null,
  options,
  ticket: null,
}

type TestModel = {
  appointmentOutcome: Partial<AppointmentOutcomeProps<AttendedCompliedAppointment | Activity>>
  headerPersonName: Name
  errorMessages?: Record<string, string>
}

const baseModel: TestModel = {
  appointmentOutcome,
  headerPersonName: {
    forename,
    surname: 'Morrison',
  },
}

const render = (model = {} as Partial<TestModel>, session = {}) => {
  const input = {
    ...baseModel,
    ...model,
    appointmentOutcome: {
      ...baseModel.appointmentOutcome,
      ...model.appointmentOutcome,
    },
  }
  const req = httpMocks.createRequest({
    params: {
      crn,
      id: contactId,
      contactId,
    },
    session: {
      data: {
        appointments: {
          [crn]: {
            [contactId]: session,
          },
        },
      },
    },
  })
  const res = httpMocks.createResponse({
    locals: input,
  }) as AppResponse
  const env = createNunjucksTestEnv(req, res)
  return cheerio.load(env.render('pages/appointment-outcomes/attended-failed-to-comply.njk', input))
}

describe('Attended - failed to comply', () => {
  it('should render the page', () => {
    const $ = render()
    expect($('.govuk-back-link').attr('href')).toBe(appointmentOutcome.backLink)
    expect($('[data-qa=pageHeading]').text()).toContain(`Enforcement action for ${forename}’s failure to comply`)
    expect($('.moj-ticket-panel').length).toBe(0)
    expect($('[data-qa="recall-warning"]').length).toBe(0)
    expect($('main').find('legend').text()).toContain(`Select an action for ${forename}’s failure to comply`)
    const elements = $('.govuk-radios > div')
    expect(elements.length).toBe(7)
    elements.each((index, element) => {
      expect($(element).find('input').attr('checked')).toBeUndefined()
      if ($(element).find('label').length) {
        expect($(element).find('label').text().trim()).toBe(options[index].text)
        if (options[index]?.hint) {
          expect($(element).find('.govuk-hint').text().trim()).toBe(options[index].hint.text)
        }
      } else {
        expect($(element).text().trim()).toBe(options[index].divider)
      }
    })
    expect($('main').find('button').text().trim()).toBe('Continue')
  })

  it('should display the multiple counts of non-compliance ticket', () => {
    const $ = render({ appointmentOutcome: { ticket } })
    expect($('.moj-ticket-panel').find('h2').text().trim()).toBe(ticket.title)
    expect($('.moj-ticket-panel').html().trim()).toContain(ticket.html)
    expect($('.moj-ticket-panel').find('.moj-ticket-panel__content--red').length).toBe(1)
  })
  it('should display the breach/recall warning banner', () => {
    const $ = render({ appointmentOutcome: { breachOrRecallWarning } })
    expect($('[data-qa="recall-warning"]').length).toBe(1)
    expect($('[data-qa="recall-warning"]').find('h2').text().trim()).toBe(breachOrRecallWarning.title)
    expect($('[data-qa="recall-warning"]').find('span').text().trim()).toBe(breachOrRecallWarning.text)
  })
  it('should display the validation', () => {
    const $ = render({ errorMessages })
    expect($('.govuk-error-summary').find('h2').text().trim()).toEqual('There is a problem')
    expect($('.govuk-error-summary').find('li').length).toBe(1)
    expect($('.govuk-error-summary').find('li').eq(0).find('a').attr('href')).toBe(
      `#appointments-${crn}-${contactId}-outcome-attendedFailedToComply`,
    )
    expect($('.govuk-error-summary').find('li').eq(0).find('a').text().trim()).toBe(error)
    expect($('form > .govuk-form-group').hasClass(`govuk-form-group--error`)).toBe(true)
    expect($('form').find('.govuk-error-message').text().trim()).toContain(error)
  })
  it('should persist the selection', () => {
    const session = {
      outcome: {
        outcomeType: 'ATTENDED_FAILED_TO_COMPLY',
        attendedFailedToComply: 'NO_FURTHER_ACTION',
      },
    }
    const $ = render({}, session)
    expect($('.govuk-radios').find('.govuk-radios__item').eq(4).find('input').attr('checked')).toBeDefined()
  })
})
