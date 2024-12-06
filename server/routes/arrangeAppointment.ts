import { type RequestHandler, Router } from 'express'
import { DateTime } from 'luxon'
import asyncMiddleware from '../middleware/asyncMiddleware'
import { autoStoreSessionData, getPersonalDetails, getUserLocations } from '../middleware/index'
import type { Services } from '../services'
import validate from '../middleware/validation/index'
import { setDataValue, generateRandomString, getDataValue } from '../utils/utils'
import { ArrangedSession } from '../models/ArrangedSession'

const arrangeAppointmentRoutes = async (router: Router, { hmppsAuthClient }: Services) => {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/case/:crn/arrange-appointment/type', async (req, res, _next) => {
    const id = generateRandomString()
    const { crn } = req.params
    return res.redirect(`/case/${crn}/arrange-appointment/${id}/type`)
  })
  get('/case/:crn/arrange-appointment/:id/type', async (req, res, _next) => {
    const errors = req?.session?.data?.errors
    if (errors) {
      delete req.session.data.errors
    }
    const { crn, id } = req.params
    return res.render(`pages/arrange-appointment/type`, { crn, id, errors })
  })

  router.post('/case/:crn/arrange-appointment/:id/*', autoStoreSessionData)

  router.post('/case/:crn/arrange-appointment/:id/type', (req, res, _next) => {
    const { crn, id } = req.params
    return res.redirect(`/case/${crn}/arrange-appointment/${id}/location`)
  })

  router.all('/case/:crn/arrange-appointment/:id/location', getUserLocations(hmppsAuthClient))

  get('/case/:crn/arrange-appointment/:id/location', async (req, res, _next) => {
    const { crn, id } = req.params
    const errors = req?.session?.data?.errors
    if (errors) {
      delete req.session.data.errors
    }
    return res.render(`pages/arrange-appointment/location`, { crn, id, errors })
  })

  router.post('/case/:crn/arrange-appointment/:id/location', validate.appointments, (req, res, _next) => {
    const { crn, id } = req.params
    return res.redirect(`/case/${crn}/arrange-appointment/${id}/date-time`)
  })

  router.all('/case/:crn/arrange-appointment/:id/date-time', getPersonalDetails(hmppsAuthClient))

  router.get('/case/:crn/arrange-appointment/:id/date-time', async (req, res, _next) => {
    const { crn, id } = req.params
    const today = new Date()
    const minDate = DateTime.fromJSDate(today).toFormat('dd/MM/yyyy')
    return res.render(`pages/arrange-appointment/date-time`, { crn, id, minDate })
  })
  router.post('/case/:crn/arrange-appointment/:id/date-time', validate.appointments, (req, res, _next) => {
    const { crn, id } = req.params
    return res.redirect(`/case/${crn}/arrange-appointment/${id}/repeating`)
  })

  router.all('/case/:crn/arrange-appointment/:id/repeating', async (req, res, next) => {
    const { crn, id } = req.params
    const { data } = req.session
    if (req.method === 'GET') {
      const { 'repeating-frequency': repeatingFrequency, 'repeating-count': repeatingCount } = req.query
      if (repeatingFrequency || repeatingCount) {
        setDataValue(data, ['appointments', crn, id, 'repeating'], 'Yes')
        if (repeatingFrequency) {
          setDataValue(data, ['appointments', crn, id, 'repeating-frequency'], decodeURI(repeatingFrequency as string))
        }
        if (repeatingCount) {
          setDataValue(data, ['appointments', crn, id, 'repeating-count'], repeatingCount)
        }
      }
      const appointment = getDataValue(data, ['appointments', crn, id])
      if (appointment?.date && appointment?.['repeating-frequency'] && appointment?.['repeating-count']) {
        const clonedAppointment = { ...appointment }
        const period = ['Weekly', 'Every 2 weeks'].includes(appointment['repeating-frequency']) ? 'week' : 'month'
        const increment = appointment['repeating-frequency'] === 'Every 2 weeks' ? 2 : 1
        const repeatAppointments = ArrangedSession.generateRepeatedAppointments(clonedAppointment, period, increment)
        res.locals.lastAppointmentDate = repeatAppointments.length
          ? repeatAppointments[repeatAppointments.length - 1].date
          : ''
      }
    }
    return next()
  })

  router.get('/case/:crn/arrange-appointment/:id/repeating', async (req, res, _next) => {
    const { crn, id } = req.params
    return res.render(`pages/arrange-appointment/repeating`, { crn, id })
  })
  router.post('/case/:crn/arrange-appointment/:id/repeating', validate.appointments, (req, res, _next) => {
    const { crn, id } = req.params
    return res.redirect(`/case/${crn}/arrange-appointment/${id}/confirm`)
  })
}

export default arrangeAppointmentRoutes
