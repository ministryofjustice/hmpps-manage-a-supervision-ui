import * as cheerio from 'cheerio'
import httpMocks from 'node-mocks-http'
import { RiskData } from '@ministryofjustice/hmpps-arns-frontend-components-lib'
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
import { TierCalculation } from '../../../data/tierApiClient'

const crn = 'X000001'
const contactId = '1234'
const page = 'unacceptable-absence'
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
  [`appointments-${crn}-${contactId}-outcome-unacceptableAbsence`]: error,
}

const riskData: RiskData = {
  assessments: [
    {
      outputVersion: '1',
      completedDate: '09 May 2024',
      completedDateTime: '09 May 2024 at 10:22',
      assessmentType: 'layer 3',
      ogrs3: {
        name: 'OGRS',
        band: 'LOW',
        staticOrDynamic: null,
        score: 1,
        completedDate: '09 May 2024',
      },
      ovp: {
        name: 'OVP',
        band: 'LOW',
        staticOrDynamic: null,
        score: 10,
        completedDate: '09 May 2024',
      },
      ogp: {
        name: 'OGP',
        band: 'LOW',
        staticOrDynamic: null,
        score: 15,
        completedDate: '09 May 2024',
      },
      rsr: {
        name: 'RSR',
        band: 'LOW',
        staticOrDynamic: 'Dynamic',
        score: 0.76,
        completedDate: '09 May 2024',
      },
      ospdc: {
        name: 'OSP–DC',
        band: null,
        staticOrDynamic: null,
        score: null,
        completedDate: '09 May 2024',
      },
      ospiic: {
        name: 'OSP–IIC',
        band: null,
        staticOrDynamic: null,
        score: null,
        completedDate: '09 May 2024',
      },
    },
  ],
  httpStatus: 200,
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
  headerCRN: string
  headerDob: string
  headerTierLink: string
  tierCalculation: Partial<TierCalculation>
  riskData: RiskData
  errorMessages?: Record<string, string>
  flags: Record<string, boolean>
}

const baseModel: TestModel = {
  appointmentOutcome,
  headerPersonName: {
    forename,
    surname: 'Morrison',
  },
  headerCRN: crn,
  headerDob: '1974-10-19',
  headerTierLink: 'http://tier/link',
  riskData,
  tierCalculation: { tierScore: 'C' },
  flags: {
    enableSupervisionPackagePoPHeader: true,
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
  return cheerio.load(env.render('pages/appointment-outcomes/unacceptable-absence.njk', input))
}

describe('Unacceptable absence', () => {
  it('should render the page', () => {
    const $ = render()
    expect($('.govuk-back-link').attr('href')).toBe(appointmentOutcome.backLink)
    expect($('main').find('[data-qa="new-pop-header"]').length).toBe(1)
    expect($('[data-qa=pageHeading]').text()).toContain(`Enforcement action for ${forename}’s unacceptable absence`)
    expect($('.moj-ticket-panel').length).toBe(0)
    expect($('[data-qa="recall-warning"]').length).toBe(0)
    expect($('main').find('legend').text()).toContain(`Select an action for ${forename}’s unacceptable absence`)
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
      `#appointments-${crn}-${contactId}-outcome-unacceptableAbsence`,
    )
    expect($('.govuk-error-summary').find('li').eq(0).find('a').text().trim()).toBe(error)
    expect($('form > .govuk-form-group').hasClass(`govuk-form-group--error`)).toBe(true)
    expect($('form').find('.govuk-error-message').text().trim()).toContain(error)
  })
  it('should persist the selection', () => {
    const session = {
      outcome: {
        outcomeType: 'UNACCEPTABLE_ABSENCE',
        unacceptableAbsence: 'BREACH_RECALL_INITIATED',
      },
    }
    const $ = render({}, session)
    expect($('.govuk-radios').find('.govuk-radios__item').eq(1).find('input').attr('checked')).toBeDefined()
  })
})
