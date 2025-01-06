import { Request, Response, NextFunction } from 'express'
import { HmppsAuthClient } from '../data'
import MasApiClient from '../data/masApiClient'

export const getSentences = (hmppsAuthClient: HmppsAuthClient) => {
  return async (req: Request, res: Response, next: NextFunction) => {
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
