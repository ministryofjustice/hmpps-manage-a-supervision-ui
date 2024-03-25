import { Router } from 'express'

import type { Services } from '../services'

import startRoutes from './start'
import searchRoutes from './search'
import caseRoutes from './case'
import personalDetailRoutes from './personalDetails'
import sentenceDetailRoutes from './sentenceDetails'
import scheduleRoutes from './schedule'

export default function routes(services: Services): Router {
  const router = Router()
  startRoutes(router)
  searchRoutes(router, services)
  caseRoutes(router, services)
  personalDetailRoutes(router, services)
  sentenceDetailRoutes(router, services)
  scheduleRoutes(router, services)
  return router
}
