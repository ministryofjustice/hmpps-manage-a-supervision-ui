/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
import { type RequestHandler, Router } from 'express'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { v4 } from 'uuid'

import { Query } from 'express-serve-static-core'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import MasApiClient from '../data/masApiClient'
import TierApiClient from '../data/tierApiClient'

interface Filters {
  keywords: string
  dateFrom: string
  dateTo: string
  compliance: string[] | string
}

export default function activityLogRoutes(router: Router, { hmppsAuthClient }: Services) {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/case/:crn/activity-log', async (req, res, _next) => {
    const { crn } = req.params
    const { url } = req
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)
    const tierClient = new TierApiClient(token)
    const { keywords = '', dateFrom = '', dateTo = '', clearFilterKey, clearFilterValue } = req.query
    let { compliance } = req.query
    const baseUrl = `/case/${crn}/activity-log`

    compliance = compliance ? (Array.isArray(compliance) ? compliance : [compliance]) : []
    if (compliance?.length && clearFilterKey === 'compliance') {
      compliance = compliance.filter(value => value !== clearFilterValue)
    }

    const filters: Filters = {
      keywords: keywords && clearFilterKey !== 'keywords' ? (keywords as string) : '',
      dateFrom: dateFrom && clearFilterKey !== 'dateRange' ? (dateFrom as string) : '',
      dateTo: dateTo && clearFilterKey !== 'dateRange' ? (dateTo as string) : '',
      compliance: compliance as string[],
    }

    const queryStr = Object.entries(filters).reduce((acc, [key, value], i) => {
      if (value) {
        if (Array.isArray(value)) {
          for (let j = 0; j < value.length; j += 1) {
            acc = `${acc}${acc ? '&' : ''}${key}=${encodeURI(value[j])}`
          }
        } else {
          acc = `${acc}${i > 0 ? '&' : ''}${key}=${encodeURI(value)}`
        }
      }
      return acc
    }, '')

    if (clearFilterKey) {
      return res.redirect(`${baseUrl}${queryStr ? `?${queryStr}` : ''}`)
    }

    const filterHref = (key: string, value: string): string =>
      `${baseUrl}${queryStr ? `?${queryStr}&` : '?'}&clearFilterKey=${key}&clearFilterValue=${encodeURI(value)}`

    const selectedFilterItems = Object.entries(filters)
      .filter(([_key, value]) => value)
      .reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
          for (const text of value) {
            acc = [
              ...acc,
              {
                text,
                href: filterHref(key, text),
              },
            ]
          }
        } else if (key !== 'dateTo') {
          let text = value
          let cfKey = key
          if (key === 'dateFrom') {
            text = `${value} - ${filters.dateTo}`
            cfKey = 'dateRange'
          }
          acc = [
            ...acc,
            {
              text,
              href: filterHref(cfKey, value),
            },
          ]
        }
        return acc
      }, [])

    if (selectedFilterItems.length) {
      console.log('request activity log results...')
    }

    const complianceOptions = ['Absences waiting for evidence', 'Acceptable absences', 'Appointments'].map(option => ({
      text: option,
      value: option,
      checked: filters.compliance.includes(option),
    }))

    if (req.query.view === 'compact') {
      res.locals.compactView = true
    } else {
      res.locals.defaultView = true
    }
    if (req.query.requirement) {
      res.locals.requirement = req.query.requirement
    }

    const [personActivity, tierCalculation] = await Promise.all([
      masClient.getPersonActivityLog(crn),
      tierClient.getCalculationDetails(crn),
    ])

    const queryParams = getQueryString(req.query)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_ACTIVITY_LOG',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-people-on-probation-ui',
    })
    res.render('pages/activity-log', {
      personActivity,
      crn,
      queryParams,
      tierCalculation,
      filters: {
        selectedFilterItems,
        complianceOptions,
        baseUrl,
        ...filters,
      },
    })
  })

  get('/case/:crn/activity-log/:category', async (req, res, _next) => {
    const { crn, category } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_ACTIVITY_LOG_CATEGORY',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-people-on-probation-ui',
    })

    const masClient = new MasApiClient(token)
    const tierClient = new TierApiClient(token)

    const [personActivity, tierCalculation] = await Promise.all([
      masClient.getPersonActivityLog(crn),
      tierClient.getCalculationDetails(crn),
    ])

    if (req.query.view === 'compact') {
      res.locals.compactView = true
    } else {
      res.locals.defaultView = true
    }

    if (req.query.requirement) {
      res.locals.requirement = req.query.requirement
    }

    const queryParams = getQueryString(req.query)

    res.render('pages/activity-log', {
      category,
      personActivity,
      queryParams,
      crn,
      tierCalculation,
    })
  })

  get('/case/:crn/activity-log/activity/:id', async (req, res, _next) => {
    const { crn, id } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)

    const masClient = new MasApiClient(token)
    const tierClient = new TierApiClient(token)
    const [personAppointment, tierCalculation] = await Promise.all([
      masClient.getPersonAppointment(crn, id),
      tierClient.getCalculationDetails(crn),
    ])
    const isActivityLog = true
    const queryParams = getQueryString(req.query)

    const { category } = req.query

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_ACTIVITY_LOG_DETAIL',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-people-on-probation-ui',
    })

    res.render('pages/appointments/appointment', {
      category,
      queryParams,
      personAppointment,
      crn,
      isActivityLog,
      tierCalculation,
    })
  })

  function getQueryString(params: Query): string[] {
    const queryParams: string[] = []
    if (params.view) {
      queryParams.push(`view=${params.view}`)
    }

    if (params.requirement) {
      queryParams.push(`requirement=${params.requirement}`)
    }
    return queryParams
  }
}
