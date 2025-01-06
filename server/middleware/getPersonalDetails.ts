import { Request, Response, NextFunction } from 'express'
import { HmppsAuthClient } from '../data'
import MasApiClient from '../data/masApiClient'

export const getPersonalDetails = (hmppsAuthClient: HmppsAuthClient) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { crn } = req.params
    if (!req?.session?.data?.personalDetails?.[crn]) {
      const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
      const masClient = new MasApiClient(token)
      const overview = await masClient.getPersonalDetails(crn)
      req.session.data = {
        ...(req?.session?.data || {}),
        personalDetails: {
          ...(req?.session?.data?.personalDetails || {}),
          [crn]: overview,
        },
      }
    }
    res.locals.case = req.session.data.personalDetails?.[crn]
    return next()
  }
}
