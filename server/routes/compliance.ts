import { type RequestHandler, Router } from 'express'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { v4 } from 'uuid'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import MasApiClient from '../data/masApiClient'
import TierApiClient from '../data/tierApiClient'
import ArnsApiClient from '../data/arnsApiClient'
import { toRoshWidget, toTimeline } from '../utils/utils'
import { TimelineItem } from '../data/model/risk'

export default function complianceRoutes(router: Router, { hmppsAuthClient }: Services) {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/case/:crn/compliance', async (req, res, _next) => {
    const { crn } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_COMPLIANCE',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-people-on-probation-ui',
    })

    const arnsClient = new ArnsApiClient(token)
    const masClient = new MasApiClient(token)
    const tierClient = new TierApiClient(token)

    const [personCompliance, tierCalculation, risks, predictors] = await Promise.all([
      masClient.getPersonCompliance(crn),
      tierClient.getCalculationDetails(crn),
      arnsClient.getRisks(crn),
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
    res.render('pages/compliance', {
      personCompliance,
      tierCalculation,
      crn,
      risksWidget,
      predictorScores,
    })
  })
}
