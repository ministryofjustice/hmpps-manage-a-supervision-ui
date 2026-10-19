import httpMocks from 'node-mocks-http'
import { setCollapsibleRiskFlags } from './setCollapsibleRiskFlags'
import { AppResponse } from '../models/Locals'

const nextSpy = jest.fn()

describe('/middleware/setCollapsibleRiskFlags', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sets collapsibleRiskFlags to true when enablePersonHeader is enabled', () => {
    const req = httpMocks.createRequest()
    const res = httpMocks.createResponse({ locals: { flags: { enablePersonHeader: true } } }) as AppResponse
    setCollapsibleRiskFlags(req, res, nextSpy)
    expect(res.locals.collapsibleRiskFlags).toBe(true)
    expect(nextSpy).toHaveBeenCalled()
  })

  it('does not set collapsibleRiskFlags when enablePersonHeader is disabled', () => {
    const req = httpMocks.createRequest()
    const res = httpMocks.createResponse({ locals: { flags: { enablePersonHeader: false } } }) as AppResponse
    setCollapsibleRiskFlags(req, res, nextSpy)
    expect(res.locals.collapsibleRiskFlags).toBeUndefined()
    expect(nextSpy).toHaveBeenCalled()
  })

  it('does not set collapsibleRiskFlags when flags are not available', () => {
    const req = httpMocks.createRequest()
    const res = httpMocks.createResponse() as AppResponse
    setCollapsibleRiskFlags(req, res, nextSpy)
    expect(res.locals.collapsibleRiskFlags).toBeUndefined()
    expect(nextSpy).toHaveBeenCalled()
  })
})
