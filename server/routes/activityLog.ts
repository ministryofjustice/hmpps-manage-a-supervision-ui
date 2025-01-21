import { type RequestHandler, Router } from 'express'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { v4 } from 'uuid'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Query } from 'express-serve-static-core'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import MasApiClient from '../data/masApiClient'
import TierApiClient from '../data/tierApiClient'
import { TimelineItem } from '../data/model/risk'
import { toRoshWidget, toTimeline } from '../utils/utils'
import ArnsApiClient from '../data/arnsApiClient'

export default function activityLogRoutes(router: Router, { hmppsAuthClient }: Services) {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/case/:crn/activity-log', async (req, res, _next) => {
    const { crn } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const arnsClient = new ArnsApiClient(token)
    const masClient = new MasApiClient(token)
    const tierClient = new TierApiClient(token)

    if (req.query.view === 'compact') {
      res.locals.compactView = true
    } else {
      res.locals.defaultView = true
    }

    if (req.query.requirement) {
      res.locals.requirement = req.query.requirement
    }

    const [personActivity, tierCalculation, risks, predictors] = await Promise.all([
      masClient.getPersonActivityLog(crn),
      tierClient.getCalculationDetails(crn),
      arnsClient.getRisks(crn),
      arnsClient.getPredictorsAll(crn),
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

    const risksWidget = toRoshWidget(risks)

    let timeline: TimelineItem[] = []
    let predictorScores
    if (Array.isArray(predictors)) {
      timeline = toTimeline(predictors)
    }
    if (timeline.length > 0) {
      ;[predictorScores] = timeline
    }
    res.render('pages/activity-log', {
      personActivity,
      crn,
      queryParams,
      tierCalculation,
      risksWidget,
      predictorScores,
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

    const arnsClient = new ArnsApiClient(token)
    const masClient = new MasApiClient(token)
    const tierClient = new TierApiClient(token)

    const [personActivity, tierCalculation, risks, predictors] = await Promise.all([
      masClient.getPersonActivityLog(crn),
      tierClient.getCalculationDetails(crn),
      arnsClient.getRisks(crn),
      arnsClient.getPredictorsAll(crn),
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

    const risksWidget = toRoshWidget(risks)

    let timeline: TimelineItem[] = []
    let predictorScores
    if (Array.isArray(predictors)) {
      timeline = toTimeline(predictors)
    }
    if (timeline.length > 0) {
      ;[predictorScores] = timeline
    }
    res.render('pages/activity-log', {
      category,
      personActivity,
      queryParams,
      crn,
      tierCalculation,
      risksWidget,
      predictorScores,
    })
  })

  get('/case/:crn/activity-log/activity/:id', async (req, res, _next) => {
    const { crn, id } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)

    const arnsClient = new ArnsApiClient(token)
    const masClient = new MasApiClient(token)
    const tierClient = new TierApiClient(token)
    const [personAppointment, tierCalculation, risks, predictors] = await Promise.all([
      masClient.getPersonAppointment(crn, id),
      tierClient.getCalculationDetails(crn),
      arnsClient.getRisks(crn),
      arnsClient.getPredictorsAll(crn),
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

    const risksWidget = toRoshWidget(risks)

    let timeline: TimelineItem[] = []
    let predictorScores
    if (Array.isArray(predictors)) {
      timeline = toTimeline(predictors)
    }
    if (timeline.length > 0) {
      ;[predictorScores] = timeline
    }
    res.render('pages/appointments/appointment', {
      category,
      queryParams,
      personAppointment,
      crn,
      isActivityLog,
      tierCalculation,
      risksWidget,
      predictorScores,
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
