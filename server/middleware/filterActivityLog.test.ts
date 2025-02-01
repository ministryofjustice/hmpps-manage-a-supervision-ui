import { Request } from 'express'
import { filterActivityLog } from './filterActivityLog'
import { AppResponse } from '../@types'

describe('/middleware/filterActivityLog', () => {
  const nextSpy = jest.fn()
  const crn = 'X756510'
  const res = {
    locals: {},
    redirect: jest.fn().mockReturnThis(),
  } as unknown as AppResponse

  const req = {
    body: {},
    params: {},
    query: {},
    session: {
      cache: {
        activityLog: {
          results: null,
          filters: null,
        },
      },
    },
    method: 'GET',
  } as Request

  it(`should redirect the page if 'submit' is in the request query`, () => {
    req.url = `case/${crn}/activity-log?keywords=&dateFrom=&dateTo=&submit=true&page=2`
    req.params.crn = crn
    req.query = { keywords: '', dateFrom: '', dateTo: '', submit: 'true' }
    req.session.cache.activityLog.filters = {
      keywords: 'some keywords',
      dateFrom: '21/1/2025',
      dateTo: '31/1/2025',
      compliance: ['Option 1', 'Option 2', 'Option 3'],
    }
    const redirectSpy = jest.spyOn(res, 'redirect')
    filterActivityLog(req, res, nextSpy)
    expect(redirectSpy).toHaveBeenCalledWith(`case/${crn}/activity-log?keywords=&dateFrom=&dateTo=`)
  })

  it(`should hydrate the selected filter values from cache, if the cache exists, no values exist in the query and form has not been submitted`, () => {
    req.url = `case/${crn}/activity-log?keywords=&dateFrom=&dateTo=&page=2`
    req.query = { keywords: '', dateFrom: '', dateTo: '' }
    req.session.cache.activityLog.filters = {
      keywords: 'some keywords',
      dateFrom: '12/1/2025',
      dateTo: '27/1/2025',
      compliance: ['no outcome', 'complied'],
    }
    filterActivityLog(req, res, nextSpy)
    expect(res.locals.filters.query).toEqual({
      ...req.session.cache.activityLog.filters,
    })
  })

  it('should hydrate the selected filter values from the request query if form has been submitted but query exists', () => {
    req.url = `case/${crn}/activity-log?keywords=some+keyword&dateFrom=12/1/2025&dateTo=27/1/2025&compliance=no+outcome&compliance=complied&page=2`
    req.query = {
      keywords: 'some keyword',
      dateFrom: '12/1/2025',
      dateTo: '27/1/2025',
      compliance: ['no outcome', 'complied'],
    }
    filterActivityLog(req, res, nextSpy)
    expect(res.locals.filters.query).toEqual({
      ...req.query,
    })
  })
})
