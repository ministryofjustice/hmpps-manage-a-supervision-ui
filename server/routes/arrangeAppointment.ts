import { type RequestHandler, Router } from 'express'
// import { auditService } from '@ministryofjustice/hmpps-audit-client'
// import { v4 } from 'uuid'
import asyncMiddleware from '../middleware/asyncMiddleware'
import { autoStoreSessionData, getPersonalDetails, getUserLocations } from '../middleware/index'
import type { Services } from '../services'
import validate from '../middleware/validation/index'

const arrangeAppointmentRoutes = async (router: Router, { hmppsAuthClient }: Services) => {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  get('/case/:crn/arrange-appointment/type', async (req, res, _next) => {
    const errors = req?.session?.data?.errors
    if (errors) {
      delete req.session.data.errors
    }
    const { crn } = req.params
    res.render(`pages/arrange-appointment/type`, { crn, errors })
  })

  router.post('/case/:crn/arrange-appointment/type', validate.appointments, autoStoreSessionData, (req, res, _next) => {
    const { crn } = req.params
    return res.redirect(`/case/${crn}/arrange-appointment/location`)
  })

  router.all('/case/:crn/arrange-appointment/location', getUserLocations(hmppsAuthClient))

  get('/case/:crn/arrange-appointment/location', async (req, res, _next) => {
    const { crn } = req.params
    const errors = req?.session?.data?.errors
    if (errors) {
      delete req.session.data.errors
    }
    return res.render(`pages/arrange-appointment/location`, { crn, errors })
  })

  router.post(
    '/case/:crn/arrange-appointment/location',
    validate.appointments,
    autoStoreSessionData,
    (req, res, _next) => {
      const { crn } = req.params
      return res.redirect(`/case/${crn}/arrange-appointment/date-time`)
    },
  )

  router.all('/case/:crn/arrange-appointment/date-time', getPersonalDetails(hmppsAuthClient))
  get('/case/:crn/arrange-appointment/date-time', async (req, res, _next) => {
    const { crn } = req.params
    return res.render(`pages/arrange-appointment/date-time`, { crn })
  })
}

export default arrangeAppointmentRoutes
