import { type RequestHandler, Router } from 'express'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { v4 } from 'uuid'
import getPaginationLinks, { Pagination } from '@ministryofjustice/probation-search-frontend/utils/pagination'
import { addParameters } from '@ministryofjustice/probation-search-frontend/utils/url'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import MasApiClient from '../data/masApiClient'
import logger from '../../logger'
import { ErrorMessages } from '../data/model/caseload'

export default function caseloadRoutes(router: Router, { hmppsAuthClient }: Services) {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/case', async (req, res, _next) => {
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_CASELOAD',
      who: res.locals.user.username,
      subjectId: res.locals.user.username,
      subjectType: 'USER',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })

    const currentNavSection = 'yourCases'
    const pageNum: number = req.query.page ? Number.parseInt(req.query.page as string, 10) : 1

    const caseload = await masClient.getUserCaseload(res.locals.user.username, (pageNum - 1).toString())

    const pagination: Pagination = getPaginationLinks(
      req.query.page ? Number.parseInt(req.query.page as string, 10) : 1,
      caseload.totalPages,
      caseload.totalElements,
      page => addParameters(req, { page: page.toString() }),
      caseload.pageSize,
    )

    res.render('pages/caseload/minimal-cases', {
      pagination,
      caseload,
      currentNavSection,
    })
  })

  get('/teams', async (req, res, _next) => {
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)

    if (req.session.mas === undefined || req.session.mas.team === undefined) {
      const userTeams = await masClient.getUserTeams(res.locals.user.username)
      req.session.mas = { teamCount: userTeams.teams.length }
      switch (userTeams.teams.length) {
        case 1: {
          req.session.mas.team = userTeams.teams[0].code
          res.redirect(`/team/case`)
          break
        }
        case 0: {
          res.redirect(`/team/case`)
          break
        }
        default: {
          await auditService.sendAuditMessage({
            action: 'VIEW_MAS_TEAMS',
            who: res.locals.user.username,
            subjectId: res.locals.user.username,
            subjectType: 'USER',
            correlationId: v4(),
            service: 'hmpps-manage-a-supervision-ui',
          })
          res.render('pages/caseload/select-team', {
            userTeams,
          })
        }
      }
    } else {
      res.redirect(`/team/case`)
    }
  })

  get('/change-team', async (req, res, _next) => {
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)
    const currentTeam = req.session?.mas?.team ? req.session?.mas?.team : undefined

    await auditService.sendAuditMessage({
      action: 'VIEW_MAS_TEAMS',
      who: res.locals.user.username,
      subjectId: res.locals.user.username,
      subjectType: 'USER',
      correlationId: v4(),
      service: 'hmpps-manage-a-supervision-ui',
    })
    const userTeams = await masClient.getUserTeams(res.locals.user.username)
    res.render('pages/caseload/select-team', {
      userTeams,
      currentTeam,
    })
  })

  get('/team/case', async (req, res, _next) => {
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)
    if (req.session.mas === undefined || (req.session.mas.teamCount > 0 && req.session.mas.team === undefined)) {
      res.redirect('/teams')
    } else {
      const teamCode = req.session.mas.team
      const { teamCount } = req.session.mas
      await auditService.sendAuditMessage({
        action: 'VIEW_MAS_CASELOAD_TEAM',
        who: res.locals.user.username,
        subjectId: teamCode,
        subjectType: 'TEAM',
        correlationId: v4(),
        service: 'hmpps-manage-a-supervision-ui',
      })
      const pageNum: number = req.query.page ? Number.parseInt(req.query.page as string, 10) : 1
      const currentNavSection = 'teamCases'
      const caseload =
        teamCount > 0
          ? await masClient.getTeamCaseload(teamCode, (pageNum - 1).toString())
          : { totalPages: 0, totalElements: 0, pageSize: 0 }

      const pagination: Pagination = getPaginationLinks(
        req.query.page ? Number.parseInt(req.query.page as string, 10) : 1,
        caseload.totalPages,
        caseload.totalElements,
        page => addParameters(req, { page: page.toString() }),
        caseload.pageSize,
      )
      res.render('pages/caseload/minimal-cases', {
        pagination,
        caseload,
        currentNavSection,
        teamCount,
      })
    }
  })

  post('/team/case', async (req, res, _next) => {
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)
    const errorMessages: ErrorMessages = {}
    if (req.body['team-code'] == null) {
      logger.info('Team not selected')
      errorMessages.team = { text: 'Please select a team' }
      const userTeams = await masClient.getUserTeams(res.locals.user.username)
      res.render('pages/caseload/select-team', {
        errorMessages,
        userTeams,
      })
    } else {
      req.session.mas.team = req.body['team-code']
      res.redirect(`/teams`)
    }
  })
}
