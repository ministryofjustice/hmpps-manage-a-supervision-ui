import { type RequestHandler, Router } from 'express'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { v4 } from 'uuid'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import MasApiClient from '../data/masApiClient'
import ArnsApiClient from '../data/arnsApiClient'

export default function caseRoutes(router: Router, { hmppsAuthClient }: Services) {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/case/:crn', async (req, res, _next) => {
    const { crn } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)
    const arnsClient = new ArnsApiClient(token)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_OVERVIEW',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const [overview, risks] = await Promise.all([masClient.getOverview(crn), arnsClient.getRisks(crn)])

    res.render('pages/overview', {
      overview,
      risks,
      crn,
    })
  })
}
