import { type RequestHandler, Router } from 'express'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { v4 } from 'uuid'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import MasApiClient from '../data/masApiClient'
import ArnsApiClient from '../data/arnsApiClient'
import TierApiClient from '../data/tierApiClient'
import { toRoshWidget, toTimeline } from '../utils/utils'
import { TimelineItem } from '../data/model/risk'

export default function caseRoutes(router: Router, { hmppsAuthClient }: Services) {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/case/:crn', async (req, res, _next) => {
    const { crn } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)
    const arnsClient = new ArnsApiClient(token)
    const tierClient = new TierApiClient(token)
    const sentenceNumber = (req?.query?.sentenceNumber || '') as string
    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_OVERVIEW',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-people-on-probation-ui',
    })

    const [overview, risks, tierCalculation, predictors] = await Promise.all([
      masClient.getOverview(crn, sentenceNumber),
      arnsClient.getRisks(crn),
      tierClient.getCalculationDetails(crn),
      arnsClient.getPredictorsAll(crn),
    ])

    const risksWidget = toRoshWidget(risks)

    let timeline: TimelineItem[] = []
    let predictorScores
    if (Array.isArray(predictors)) {
      timeline = toTimeline(predictors)
    }
    if (timeline.length > 0) {
      ;[predictorScores] = timeline
    }
    res.render('pages/overview', {
      overview,
      risks,
      crn,
      tierCalculation,
      risksWidget,
      predictorScores,
    })
  })
}
