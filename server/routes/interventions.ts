import { type RequestHandler, Router } from 'express'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { v4 } from 'uuid'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import MasApiClient from '../data/masApiClient'
import TierApiClient from '../data/tierApiClient'
import InterventionsApiClient from '../data/interventionsApiClient'

export default function interventionsRoutes(router: Router, { hmppsAuthClient }: Services) {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/case/:crn/interventions', async (req, res, _next) => {
    const { crn } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)
    const interventionsApiClient = new InterventionsApiClient(token)
    const tierClient = new TierApiClient(token)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_INTERVENTIONS',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const [personSummary, interventions, tierCalculation] = await Promise.all([
      masClient.getPersonSummary(crn),
      interventionsApiClient.getInterventions(crn),
      tierClient.getCalculationDetails(crn),
    ])
    res.render('pages/interventions', {
      personSummary,
      interventions,
      tierCalculation,
      crn,
    })
  })
}
