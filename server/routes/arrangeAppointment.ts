import { type RequestHandler, Router } from 'express'
// import { auditService } from '@ministryofjustice/hmpps-audit-client'
// import { v4 } from 'uuid'
import asyncMiddleware from '../middleware/asyncMiddleware'
import autoStoreSessionData from '../middleware/autoStoreSessionData'
import type { Services } from '../services'
import MasApiClient from '../data/masApiClient'
import validate from '../middleware/validation/index'

const arrangeAppointmentRoutes = async (router: Router, { hmppsAuthClient }: Services) => {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  get('/case/:crn/arrange-appointment/type', async (req, res, _next) => {
    const { crn } = req.params
    res.render(`pages/arrange-appointment/type`, { crn })
  })

  router.post('/case/:crn/arrange-appointment/type', validate.appointments, autoStoreSessionData, (req, res, _next) => {
    const { crn } = req.params
    res.render(`pages/arrange-appointment/type`, { crn })
  })

  get('/case/:crn/arrange-appointment/location', async (_req, res, _next) => {
    const { username } = res.locals.user
    const token = await hmppsAuthClient.getSystemClientToken(username)
    const masClient = new MasApiClient(token)
    const userLocations = await masClient.getUserLocations(username)
    return res.render(`pages/arrange-appointment/location`, { paths: { back: '#' }, userLocations })
  })
}

export default arrangeAppointmentRoutes
