import { type RequestHandler, Router } from 'express'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { v4 } from 'uuid'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import MasApiClient from '../data/masApiClient'

export default function activityLogRoutes(router: Router, { hmppsAuthClient }: Services) {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/case/:crn/activity-log', async (req, res, _next) => {
    const { crn } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_ACTIVITY_LOG',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const masClient = new MasApiClient(token)

    const personActivity = await masClient.getPersonActivityLog(crn)

    if (req.query.view === 'compact') {
      res.locals.compactView = true
    } else {
      res.locals.defaultView = true
    }

    res.render('pages/activity-log', {
      personActivity,
      crn,
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
      service: 'hmpps-manage-a-supervision-ui',
    })

    const masClient = new MasApiClient(token)

    const personActivity = await masClient.getPersonActivityLog(crn)

    if (req.query.view === 'compact') {
      res.locals.compactView = true
    } else {
      res.locals.defaultView = true
    }

    res.render('pages/activity-log', {
      category,
      personActivity,
      crn,
    })
  })

  get('/case/:crn/activity-log/activity/:id', async (req, res, _next) => {
    const { crn, id } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_ACTIVITY_LOG_DETAIL',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })
    const masClient = new MasApiClient(token)
    const personAppointment = await masClient.getPersonAppointment(crn, id)
    const isActivityLog = true
    const queryParams: string[] = []

    const { category } = req.query
    if (req.query.view) {
      queryParams.push(`view=${req.query.view}`)
    }
    res.render('pages/schedule/appointment', {
      category,
      queryParams,
      personAppointment,
      crn,
      isActivityLog,
    })
  })
}
