import { Router } from 'express'
import type { Services } from '../services'
import evaluateFeatureFlags from './evaluateFeatureFlags'

export default function setUpFlags({ flagService }: Services): Router {
  const router = Router({ mergeParams: true })
  router.use(evaluateFeatureFlags(flagService))
  return router
}
