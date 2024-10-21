import { type RequestHandler, Router } from 'express'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { v4 } from 'uuid'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import MasApiClient from '../data/masApiClient'
import TierApiClient from '../data/tierApiClient'

export default function sentenceRoutes(router: Router, { hmppsAuthClient }: Services) {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/case/:crn/sentence', async (req, res, _next) => {
    const { crn } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_SENTENCE',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const masClient = new MasApiClient(token)
    const tierClient = new TierApiClient(token)

    const [sentenceDetails, tierCalculation] = await Promise.all([
      masClient.getSentenceDetails(crn),
      tierClient.getCalculationDetails(crn),
    ])

    res.render('pages/sentence', {
      sentenceDetails,
      crn,
      tierCalculation,
    })
  })

  get('/case/:crn/sentence/previous-orders', async (req, res, _next) => {
    const { crn } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_SENTENCE_PREVIOUS_ORDERS',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const masClient = new MasApiClient(token)

    const previousOrderHistory = await masClient.getSentencePreviousOrders(crn)

    res.render('pages/sentence/previous-orders', {
      previousOrderHistory,
      crn,
    })
  })

  get('/case/:crn/sentence/offences/:eventNumber', async (req, res, _next) => {
    const { crn, eventNumber } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_SENTENCE_OFFENCE_DETAILS',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const masClient = new MasApiClient(token)

    const offences = await masClient.getSentenceOffences(crn, eventNumber)

    res.render('pages/sentence/offences', {
      offences,
      crn,
    })
  })

  get('/case/:crn/address-book-professional', async (req, res, _next) => {
    const { crn } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_SENTENCE_PROFESSIONAL_CONTACTS',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const masClient = new MasApiClient(token)

    const professionalContact = await masClient.getContacts(crn)

    res.render('pages/address-book-professional', {
      professionalContact,
      crn,
    })
  })

  get('/case/:crn/sentence/licence-condition/:licenceConditionId/note/:noteId', async (req, res, _next) => {
    const { crn, licenceConditionId, noteId } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_SENTENCE_LICENCE_CONDITION_NOTE',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const masClient = new MasApiClient(token)
    const tierClient = new TierApiClient(token)

    const [licenceNoteDetails, tierCalculation] = await Promise.all([
      masClient.getSentenceLicenceConditionNote(crn, licenceConditionId, noteId),
      tierClient.getCalculationDetails(crn),
    ])

    res.render('pages/licence-condition-note', {
      licenceNoteDetails,
      tierCalculation,
      crn,
    })
  })
}
