/* eslint-disable import/no-extraneous-dependencies */

import { type Router } from 'express'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { v4 } from 'uuid'

import { Query } from 'express-serve-static-core'
import asyncMiddleware from '../middleware/asyncMiddleware'
import { type Services } from '../services'
import MasApiClient from '../data/masApiClient'
import TierApiClient from '../data/tierApiClient'
import validate from '../middleware/validation/index'
import { toCamelCase, toISODate } from '../utils/utils'
import { filterActivityLog } from '../middleware'
import type { ActivityLogRequestBody, AppResponse, Route } from '../@types'

export default function activityLogRoutes(router: Router, { hmppsAuthClient }: Services) {
  const get = (path: string | string[], handler: Route<void>) => router.get(path, asyncMiddleware(handler))

  router.get(
    '/case/:crn/activity-log',
    validate.activityLog,
    filterActivityLog,
    async (req, res: AppResponse, _next) => {
      const { query, params } = req
      const { crn } = params
      const { filters } = res.locals
      const { page = '1', view = '' } = query
      const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
      const masClient = new MasApiClient(token)
      const tierClient = new TierApiClient(token)

      if (req.query.view === 'compact') {
        res.locals.compactView = true
      } else {
        res.locals.defaultView = true
      }
      if (req.query.requirement) {
        res.locals.requirement = req.query.requirement as string
      }
      const body: ActivityLogRequestBody = {
        keywords: filters.keywords,
        dateFrom: filters?.dateFrom ? toISODate(filters.dateFrom) : '',
        dateTo: filters?.dateTo ? toISODate(filters.dateTo) : '',
        compliance: filters?.compliance ? filters.compliance.map(option => toCamelCase(option as string)) : [],
      }
      const [personActivity, tierCalculation] = await Promise.all([
        masClient.postPersonActivityLog(crn, body, page as string),
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
        page,
        view,
        tierCalculation,
        url: req.url,
        query,
      })
    },
  )

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
      res.locals.requirement = req.query.requirement as string
    }

    const queryParams = getQueryString(req.query)

    res.render('pages/activity-log', {
      category,
      personActivity,
      queryParams,
      crn,
      tierCalculation,
      errors: req?.session?.errors,
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
