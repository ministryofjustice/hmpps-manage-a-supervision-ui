import { type RequestHandler, Router } from 'express'
// eslint-disable-next-line import/no-extraneous-dependencies
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { v4 } from 'uuid'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import MasApiClient from '../data/masApiClient'

export default function caseRoutes(router: Router, { hmppsAuthClient }: Services) {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/case/:crn', async (req, res, _next) => {
    const { crn } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_OVERVIEW',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })
    const [overview] = await Promise.all([masClient.getOverview(crn)])
    const warnings: string[] = []
    res.render('pages/overview', {
      overview,
      crn,
      warnings: warnings.map(warning => ({ text: warning })),
    })
  })
  get('/case/:crn/schedule', async (req, res, _next) => {
    const { crn } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_SCHEDULE',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })
    const [overview] = await Promise.all([masClient.getOverview(crn)])
    const warnings: string[] = []
    res.render('pages/schedule', {
      overview,
      crn,
      warnings: warnings.map(warning => ({ text: warning })),
    })
  })
}
