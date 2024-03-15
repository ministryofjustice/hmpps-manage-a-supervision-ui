import { Router } from 'express'

import type { Services } from '../services'

import startRoutes from './start'
import searchRoutes from './search'
import caseRoutes from './case'
import personalDetailRoutes from './personalDetails'

export default function routes(services: Services): Router {
  const router = Router()
  startRoutes(router)
  searchRoutes(router, services)
  caseRoutes(router, services)
  personalDetailRoutes(router, services)
  return router
}
