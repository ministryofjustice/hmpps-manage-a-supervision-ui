import httpMocks from 'node-mocks-http'
import appointmentOutcomes from './appointmentOutcomes'
import { mockAppResponse } from '../../controllers/mocks'

const crn = 'X000001'
const id = '1234'
const baseOutcomeUrl = `/case/${crn}/appointments/appointment/${id}/outcome`
const page = 'initiate-breach-or-recall'
const renderPath = `pages/appointment-outcomes/${page}`
const field = (name: string) => `appointments-${crn}-${id}-outcome-${name}`
const outcomeBody = (values: Record<string, string>) => ({ appointments: { [crn]: { [id]: { outcome: values } } } })

const setup = ({
  body = {},
  sentenceType = 'COMMUNITY',
  sendBreachOrRecallLetter = false,
  showLetterTypeOptions = false,
}: {
  body?: Record<string, unknown>
  sentenceType?: 'COMMUNITY' | 'CUSTODY'
  sendBreachOrRecallLetter?: boolean
  showLetterTypeOptions?: boolean
} = {}) => {
  const url = `${baseOutcomeUrl}/${page}`
  const req = httpMocks.createRequest({ method: 'POST', url, body })
  const res = mockAppResponse({
    renderPath,
    appointmentOutcome: {
      crn,
      id,
      contactId: id,
      isInPast: true,
      baseOutcomeUrl,
      reqUrl: url,
      sendBreachOrRecallLetter,
      showLetterTypeOptions,
      appointmentSession: {},
      sentence: { type: sentenceType },
    },
  })
  const next = jest.fn()
  appointmentOutcomes(req, res, next)
  return { res, next }
}

describe('middleware/validation/appointmentOutcomes - initiate breach or recall', () => {
  it('should require who creates the breach NSI for a community sentence', () => {
    const { res, next } = setup()
    expect(next).not.toHaveBeenCalled()
    expect(res.render).toHaveBeenCalledTimes(1)
    expect(res.render).toHaveBeenCalledWith(
      renderPath,
      expect.objectContaining({
        errorMessages: { [field('breachNSICreatedBy')]: 'Select who will create the breach NSI' },
      }),
    )
  })

  it('should require who creates the recall for a custody sentence', () => {
    const { res, next } = setup({ sentenceType: 'CUSTODY' })
    expect(next).not.toHaveBeenCalled()
    expect(res.render).toHaveBeenCalledWith(
      renderPath,
      expect.objectContaining({
        errorMessages: { [field('breachNSICreatedBy')]: 'Select who will create the recall' },
      }),
    )
  })

  it('should require all three options when sending a letter', () => {
    const { res, next } = setup({
      sentenceType: 'CUSTODY',
      sendBreachOrRecallLetter: true,
      showLetterTypeOptions: true,
    })
    expect(next).not.toHaveBeenCalled()
    expect(res.render).toHaveBeenCalledWith(
      renderPath,
      expect.objectContaining({
        errorMessages: {
          [field('breachNSICreatedBy')]: 'Select who will create the recall',
          [field('letterSentBy')]: 'Select who will send the letter',
          [field('letterType')]: 'Select the type of letter',
        },
      }),
    )
  })

  it('should only return errors for the options that have not been answered', () => {
    const { res } = setup({
      body: outcomeBody({ breachNSICreatedBy: 'USER' }),
      sendBreachOrRecallLetter: true,
      showLetterTypeOptions: true,
    })
    expect(res.render).toHaveBeenCalledWith(
      renderPath,
      expect.objectContaining({
        errorMessages: {
          [field('letterSentBy')]: 'Select who will send the letter',
          [field('letterType')]: 'Select the type of letter',
        },
      }),
    )
  })

  it('should not require the letter options when not sending a letter', () => {
    const { res } = setup()
    const { errorMessages } = (res.render as jest.Mock).mock.calls[0][1]
    expect(Object.keys(errorMessages)).toEqual([field('breachNSICreatedBy')])
  })

  it('should not require the letter type if the letter type options are not shown', () => {
    const { res } = setup({ sendBreachOrRecallLetter: true, showLetterTypeOptions: false })
    const { errorMessages } = (res.render as jest.Mock).mock.calls[0][1]
    expect(Object.keys(errorMessages)).toEqual([field('breachNSICreatedBy'), field('letterSentBy')])
  })

  it('should call next if all options are selected', () => {
    const { res, next } = setup({
      body: outcomeBody({ breachNSICreatedBy: 'USER', letterSentBy: 'USER', letterType: 'BREACH_LETTER_SENT' }),
      sendBreachOrRecallLetter: true,
      showLetterTypeOptions: true,
    })
    expect(res.render).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('should call next if the breach/recall option is selected and no letter is being sent', () => {
    const { res, next } = setup({ body: outcomeBody({ breachNSICreatedBy: 'CASE_ADMIN' }) })
    expect(res.render).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
  })
})
