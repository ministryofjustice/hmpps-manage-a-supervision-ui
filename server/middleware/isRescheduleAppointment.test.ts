import httpMocks from 'node-mocks-http'
import { isRescheduleAppointment } from './isRescheduleAppointment'

describe('middleware/isRescheduleAppointment', () => {
  it('should return false if req.query.change is undefined', () => {
    const req = httpMocks.createRequest({ query: {} })
    expect(isRescheduleAppointment(req)).toEqual(false)
  })
  it('should return false if reschedule directory does not exist is req.query.change', () => {
    const req = httpMocks.createRequest({
      query: {
        change:
          '/case/X756510/appointments/appointment/2510042440/d58022bc-d0c7-46b8-aa6f-39ad07741578/check-your-answers',
      },
    })
    expect(isRescheduleAppointment(req)).toEqual(false)
  })
  it('should throw an error if req.query.change is not a string', () => {
    const req = httpMocks.createRequest({
      query: {
        change: 123,
      },
    })
    expect(() => isRescheduleAppointment(req)).toThrow(
      new Error('Invalid change parameter passed through. Must be a string and not contain ".." (i.e relative url)'),
    )
  })

  it('should throw an error if req.query.change contains ".."', () => {
    const req = httpMocks.createRequest({
      query: {
        change:
          '/case/X756510/appointments/../reschedule/2510042440/d58022bc-d0c7-46b8-aa6f-39ad07741578/check-your-answers',
      },
    })
    expect(() => isRescheduleAppointment(req)).toThrow(
      new Error('Invalid change parameter passed through. Must be a string and not contain ".." (i.e relative url)'),
    )
  })
  it('should throw an error if req.query.change starts with ".."', () => {
    const req = httpMocks.createRequest({
      query: {
        change: '../reschedule/2510042440/d58022bc-d0c7-46b8-aa6f-39ad07741578/check-your-answers',
      },
    })
    expect(() => isRescheduleAppointment(req)).toThrow(
      new Error('Invalid change parameter passed through. Must be a string and not contain ".." (i.e relative url)'),
    )
  })

  it.each([
    'https://example.com/reschedule',
    'HTTPS://example.com/reschedule',
    '//example.com/reschedule',
    '  https://example.com/reschedule',
    '  //example.com/reschedule',
  ])('should throw an error if req.query.change is an absolute or protocol-relative URL: %s', change => {
    const req = httpMocks.createRequest({ query: { change } })

    expect(() => isRescheduleAppointment(req)).toThrow(
      new Error('Invalid change parameter passed through. Must be a string and not contain ".." (i.e relative url)'),
    )
  })

  it('should throw an error if req.query.change is 0', () => {
    const req = httpMocks.createRequest({
      query: {
        change: 0,
      },
    })
    expect(() => isRescheduleAppointment(req)).toThrow(
      new Error('Invalid change parameter passed through. Must be a string and not contain ".." (i.e relative url)'),
    )
  })

  it('should throw an error if req.query.change is false', () => {
    const req = httpMocks.createRequest({
      query: {
        change: false,
      },
    })
    expect(() => isRescheduleAppointment(req)).toThrow(
      new Error('Invalid change parameter passed through. Must be a string and not contain ".." (i.e relative url)'),
    )
  })

  it('should return true if reschedule directory exists in req.query.change', () => {
    const req = httpMocks.createRequest({
      query: {
        change:
          '/case/X756510/appointments/reschedule/2510042440/d58022bc-d0c7-46b8-aa6f-39ad07741578/check-your-answers',
      },
    })
    expect(isRescheduleAppointment(req)).toEqual(true)
  })
})
