import { Request, Response, NextFunction } from 'express'
import { HmppsAuthClient } from '../data'
import { UserLocations } from '../data/model/caseload'
import MasApiClient from '../data/masApiClient'

export const getUserLocations = (hmppsAuthClient: HmppsAuthClient) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { username } = res.locals.user
    const token = await hmppsAuthClient.getSystemClientToken(username)
    let userLocations: UserLocations = null
    if (!req?.session?.data?.locations?.[username]) {
      const masClient = new MasApiClient(token)
      userLocations = await masClient.getUserLocations(username)
      req.session.data = {
        ...(req?.session?.data || {}),
        locations: {
          ...(req?.session?.data?.locations || {}),
          [username]: userLocations,
        },
      }
    } else {
      userLocations = req.session.data.locations[username]
    }
    res.locals.userLocations = userLocations
    return next()
  }
}
