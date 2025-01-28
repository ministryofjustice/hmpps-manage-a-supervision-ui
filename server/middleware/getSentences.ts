import { HmppsAuthClient } from '../data'
import MasApiClient from '../data/masApiClient'
import { Route } from '../@types'

export const getSentences = (hmppsAuthClient: HmppsAuthClient): Route<Promise<void>> => {
  return async (req, res, next) => {
    const number = (req?.query?.number as string) || ''
    const crn = req.params.crn as string
    const token = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
    const masClient = new MasApiClient(token)
    const allSentences = await masClient.getSentences(crn, number)
    req.session.data = {
      ...(req?.session?.data || {}),
      sentences: {
        ...(req?.session?.data?.sentences || {}),
        [crn]: allSentences.sentences,
      },
    }
    res.locals.sentences = req.session.data.sentences[crn]
    return next()
  }
}
