import { Router } from 'express'

import type { Services } from '../services'

import searchRoutes from './search'
import caseRoutes from './case'
import personalDetailRoutes from './personalDetails'
import sentenceRoutes from './sentence'
import scheduleRoutes from './appointments'
import activityLogRoutes from './activityLog'
import risksRoutes from './risks'
import complianceRoutes from './compliance'
import caseloadRoutes from './caseload'
import accessibilityRoutes from './accessibilityRoutes'
import interventionsRoutes from './interventions'
import arrangeAppointmentRoutes from './arrangeAppointment'

export default function routes(services: Services): Router {
  const router = Router()
  searchRoutes(router, services)
  caseRoutes(router, services)
  personalDetailRoutes(router, services)
  sentenceRoutes(router, services)
  scheduleRoutes(router, services)
  risksRoutes(router, services)
  activityLogRoutes(router, services)
  complianceRoutes(router, services)
  caseloadRoutes(router, services)
  accessibilityRoutes(router)
  interventionsRoutes(router, services)
  arrangeAppointmentRoutes(router, services)
  return router
}
