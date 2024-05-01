import type { NextFunction, Request, Response } from 'express'
import MasApiClient from '../data/masApiClient'
import { Services } from '../services'
import asyncMiddleware from './asyncMiddleware'

export default function limitedAccess(services: Services) {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = await services.hmppsAuthClient.getSystemClientToken()
    const access = await new MasApiClient(token).getUserAccess(res.locals.user.username, req.params.crn)

    if (access.userExcluded || access.userRestricted) {
      if (access.exclusionMessage) {
        res.render('autherror-lao', { message: access.exclusionMessage })
      } else if (access.restrictionMessage) {
        res.render('autherror-lao', { message: access.restrictionMessage })
      } else {
        res.render('autherror-lao', { message: 'You are not authorised to view this case.' })
      }
      return
    }
    next()
  })
}
