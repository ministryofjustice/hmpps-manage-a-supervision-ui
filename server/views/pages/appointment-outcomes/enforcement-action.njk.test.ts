import * as cheerio from 'cheerio'
import httpMocks from 'node-mocks-http'
import { createNunjucksTestEnv } from '../../../testutils/nunjucksTestEnv'
import {
  AppointmentOutcomeProps,
  AppointmentOutcomeSentence,
  AppResponse,
  CurrentEnforcementAction,
} from '../../../models/Locals'
import { Activity } from '../../../data/model/schedule'
import { AppointmentEnforcementAction, AttendedCompliedAppointment } from '../../../models/Appointments'
import { Option } from '../../../models/Option'
import { Name } from '../../../data/model/personalDetails'

const crn = 'X000001'
const contactId = '1234'
const page = 'enforcement-action'
const forename = 'James'
const error = 'Select an enforcement action for their failure to comply'

const options: Option<AppointmentEnforcementAction | ''>[] = [
  { value: '', text: 'Select enforcement action' },
  { value: 'BREACH_RECALL_INITIATED', text: 'Breach/recall initiated' },
  {
    value: 'BREACH_CONFIRMATION_SENT',
    text: 'Breach confirmation sent',
  },
  { value: 'BREACH_LETTER_SENT', text: 'Breach letter sent' },
  {
    value: 'SEND_CONFIRMATION_OF_BREACH',
    text: 'Send confirmation of breach',
  },
  { value: 'RECALL_REQUESTED', text: 'Recall requested' },
  {
    value: 'IMMEDIATE_BREACH_OR_RECALL',
    text: 'Immediate breach or recall',
  },
  {
    value: 'FIRST_WARNING_LETTER_SENT',
    text: 'First warning letter sent',
  },
  {
    value: 'SECOND_WARNING_LETTER_SENT',
    text: 'Second warning letter sent',
  },
  {
    value: 'OTHER_ENFORCEMENT_LETTER_SENT',
    text: 'Other enforcement letter sent',
  },
  {
    value: 'LICENCE_COMPLIANCE_LETTER_SENT',
    text: 'Licence compliance letter sent',
  },
  {
    value: 'ENFORCEMENT_LETTER_REQUESTED',
    text: 'Enforcement letter requested',
  },
  { value: 'WITHDRAW_WARNING_LETTER', text: 'Withdraw warning letter' },
  {
    value: 'DECISION_PENDING_RESPONSE_FROM_PERSON_ON_PROBATION',
    text: 'Decision pending James’s response',
  },
  {
    value: 'REFER_TO_OFFENDER_MANAGER',
    text: 'Refer to offender manager',
  },
  { value: 'YOT_OM_NOTIFIED', text: 'YOT OM notified' },
  { value: 'NO_FURTHER_ACTION', text: 'No further action' },
  { value: 'WITHDRAWAL_OF_WARNING', text: 'Withdrawal of warning' },
]

const errorMessages: Record<string, string> = {
  [`appointments-${crn}-${contactId}-outcome-otherEnforcementAction`]: error,
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
  currentEnforcementAction: null,
}

type TestModel = {
  appointmentOutcome: Partial<AppointmentOutcomeProps<AttendedCompliedAppointment | Activity>>
  headerPersonName: Name
  errorMessages?: Record<string, string>
  flags: Record<string, boolean>
}

const baseModel: TestModel = {
  appointmentOutcome,
  headerPersonName: {
    forename,
    surname: 'Morrison',
  },
  flags: {
    enablePersonHeader: true,
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
  return cheerio.load(env.render('pages/appointment-outcomes/enforcement-action.njk', input))
}

describe('Enforcement action', () => {
  it('should render the page', () => {
    const $ = render()
    const select = $(`#appointments-${crn}-${contactId}-outcome-otherEnforcementAction`)
    expect($('.govuk-back-link').attr('href')).toBe(appointmentOutcome.backLink)
    expect($('main').find('.person-header').length).toBe(1)
    expect($('[data-qa=pageHeading]').text()).toContain(
      `Select an enforcement action for ${forename}’s failure to comply`,
    )
    expect($('.moj-ticket-panel').length).toBe(0)
    expect($('[data-qa="recall-warning"]').length).toBe(0)
    expect($('main').find('.govuk-inset-text').length).toBe(0)
    const selectOptions = select.find('option')
    expect(selectOptions.length).toBe(options.length)
    selectOptions.each((index, option) => {
      expect($(option).val()).toBe(options[index].value)
      expect($(option).text()).toBe(options[index].text)
    })
    expect(select.find('option[selected]').length).toBe(0)
    expect($('main').find('button').text().trim()).toBe('Continue')
  })

  it('should display the current enforcement action', () => {
    const currentEnforcementAction: CurrentEnforcementAction = {
      action: 'REFER_TO_OFFENDER_MANAGER',
      description: 'Refer to offender manager',
      tagColour: 'PURPLE',
    }
    const $ = render({ appointmentOutcome: { currentEnforcementAction } })
    expect($('main').find('.govuk-inset-text').text().trim()).toContain('The current enforcement status is:')
    expect($('main').find('.govuk-inset-text').find('strong').text().trim()).toBe('Refer to offender manager')
    expect($('main').find('.govuk-inset-text').find('strong').hasClass('govuk-tag--purple')).toBe(true)
  })

  it('should display the validation', () => {
    const $ = render({ errorMessages })
    expect($('.govuk-error-summary').find('h2').text().trim()).toEqual('There is a problem')
    expect($('.govuk-error-summary').find('li').length).toBe(1)
    expect($('.govuk-error-summary').find('li').eq(0).find('a').attr('href')).toBe(
      `#appointments-${crn}-${contactId}-outcome-otherEnforcementAction`,
    )
    expect($('.govuk-error-summary').find('li').eq(0).find('a').text().trim()).toBe(error)
    expect($('form').find(`.govuk-form-group--error`).length).toBe(1)
    expect($('form').find('.govuk-error-message').text().trim()).toContain(error)
  })
  it('should persist the selection', () => {
    const session = {
      outcome: {
        outcomeType: 'ATTENDED_FAILED_TO_COMPLY',
        otherEnforcementAction: 'BREACH_LETTER_SENT',
      },
    }
    const $ = render({}, session)
    const select = $(`#appointments-${crn}-${contactId}-outcome-otherEnforcementAction`)
    expect(select.find('option[selected]').val()).toBe('BREACH_LETTER_SENT')
  })
})
