import { type RequestHandler, Router } from 'express'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { v4 } from 'uuid'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import MasApiClient from '../data/masApiClient'
import logger from '../../logger'
import { ErrorMessages } from '../data/model/caseload'
import TierApiClient from '../data/tierApiClient'

export default function scheduleRoutes(router: Router, { hmppsAuthClient }: Services) {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/case/:crn/schedule', async (req, res, _next) => {
    const { crn } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)
    const tierClient = new TierApiClient(token)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_SCHEDULE',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const [schedule, tierCalculation] = await Promise.all([
      masClient.getPersonSchedule(crn, 'upcoming'),
      tierClient.getCalculationDetails(crn),
    ])
    res.render('pages/schedule', {
      schedule,
      crn,
      tierCalculation,
    })
  })

  get('/case/:crn/schedule/appointment/:contactId', async (req, res, _next) => {
    const { crn } = req.params
    const { contactId } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_PERSONAL_DETAILS',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const personAppointment = await masClient.getPersonAppointment(crn, contactId)
    res.render('pages/schedule/appointment', {
      personAppointment,
      crn,
    })
  })

  get('/case/:crn/record-an-outcome/:actionType', async (req, res, _next) => {
    const { crn, actionType } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_PERSONAL_DETAILS',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const schedule = await masClient.getPersonSchedule(crn, 'previous')
    res.render('pages/schedule/record-an-outcome', {
      schedule,
      crn,
      actionType,
    })
  })

  post('/case/:crn/record-an-outcome/:actionType', async (req, res, _next) => {
    const { crn, actionType } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)

    const errorMessages: ErrorMessages = {}
    if (req.body['appointment-id'] == null) {
      logger.info('Appointment not selected')
      errorMessages.appointment = { text: 'Please select an appointment' }
      const schedule = await masClient.getPersonSchedule(crn, 'previous')
      res.render('pages/schedule/record-an-outcome', {
        errorMessages,
        schedule,
        crn,
        actionType,
      })
    } else {
      res.redirect(`/case/${crn}/schedule/appointment/${req.body['appointment-id']}`)
    }
  })
}
