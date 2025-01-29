import { HmppsAuthClient } from '../data'
import MasApiClient from '../data/masApiClient'
import { Route } from '../@types'

export const getUserLocations = (hmppsAuthClient: HmppsAuthClient): Route<Promise<void>> => {
  return async (req, res, next) => {
    const { username } = res.locals.user
    const token = await hmppsAuthClient.getSystemClientToken(username)
    if (!req?.session?.data?.locations?.[username]) {
      const masClient = new MasApiClient(token)
      const userLocations = await masClient.getUserLocations(username)
      req.session.data = {
        ...(req?.session?.data || {}),
        locations: {
          ...(req?.session?.data?.locations || {}),
          [username]: userLocations.locations,
        },
      }
    }
    res.locals.userLocations = req.session.data.locations[username]
    return next()
  }
}
