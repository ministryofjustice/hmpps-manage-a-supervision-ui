import { Router } from 'express'

import type { Services } from '../services'

import startRoutes from './start'
import searchRoutes from './search'
import caseRoutes from './case'
import personalDetailRoutes from './personalDetails'
import sentenceRoutes from './sentence'
import scheduleRoutes from './schedule'
import activityLogRoutes from './activityLog'
import risksRoutes from './risks'
import complianceRoutes from './compliance'

export default function routes(services: Services): Router {
  const router = Router()
  startRoutes(router)
  searchRoutes(router, services)
  caseRoutes(router, services)
  personalDetailRoutes(router, services)
  sentenceRoutes(router, services)
  scheduleRoutes(router, services)
  risksRoutes(router, services)
  activityLogRoutes(router, services)
  complianceRoutes(router, services)
  return router
}
