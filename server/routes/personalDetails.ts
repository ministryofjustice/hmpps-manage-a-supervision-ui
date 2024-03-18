import { type RequestHandler, Router } from 'express'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { v4 } from 'uuid'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import MasApiClient from '../data/masApiClient'

export default function personalDetailRoutes(router: Router, { hmppsAuthClient }: Services) {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/case/:crn/personal-details', async (req, res, _next) => {
    const { crn } = req.params
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

    const personalDetails = await masClient.getPersonalDetails(crn)
    res.render('pages/personal-details', {
      personalDetails,
      crn,
    })
  })

  get('/case/:crn/personal-details/personal-contact/:id', async (req, res, _next) => {
    const { crn } = req.params
    const { id } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_PERSONAL_CONTACT',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const personalContact = await masClient.getPersonalContact(crn, id)
    res.render('pages/personal-details/contact', {
      personalContact,
      crn,
    })
  })

  get('/case/:crn/personal-details/addresses', async (req, res, _next) => {
    const { crn } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_VIEW_ALL_ADDRESSES',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const addressOverview = await masClient.getPersonalAddresses(crn)
    res.render('pages/personal-details/addresses', {
      addressOverview,
      crn,
    })
  })

  get('/case/:crn/personal-details/documents/:documentId/download', async (req, res, _next) => {
    const { crn } = req.params
    const { documentId } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_DOWNLOAD_DOCUMENT',
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const document = await masClient.downloadDocument(crn, documentId)
    document.pipe(res)
  })

  get('/case/:crn/handoff/:system', async (req, res, _next) => {
    const { crn } = req.params
    const { system } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)

    await auditService.sendAuditMessage({
      action: `VIEW_MAS_HANDOFF_${system.toUpperCase()}`,
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const personSummary = await masClient.getPersonSummary(crn)
    res.render(`pages/handoff/${system}`, {
      personSummary,
      crn,
    })
  })

  get('/case/:crn/personal-details/disabilities', async (req, res, _next) => {
    const { crn } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)

    await auditService.sendAuditMessage({
      action: `VIEW_MAS_DISABILITIES`,
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const disabilities = await masClient.getPersonDisabilities(crn)
    res.render(`pages/personal-details/disabilities`, {
      disabilities,
      crn,
    })
  })

  get('/case/:crn/personal-details/adjustments', async (req, res, _next) => {
    const { crn } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)

    await auditService.sendAuditMessage({
      action: `VIEW_MAS_ADJUSTMENTS`,
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const adjustments = await masClient.getPersonAdjustments(crn)
    res.render(`pages/personal-details/adjustments`, {
      adjustments,
      crn,
    })
  })

  get('/case/:crn/personal-details/circumstances', async (req, res, _next) => {
    const { crn } = req.params
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)

    await auditService.sendAuditMessage({
      action: `VIEW_MAS_CIRCUMSTANCES`,
      who: res.locals.user.username,
      subjectId: crn,
      subjectType: 'CRN',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const circumstances = await masClient.getPersonCircumstances(crn)
    res.render(`pages/personal-details/circumstances`, {
      circumstances,
      crn,
    })
  })
}
