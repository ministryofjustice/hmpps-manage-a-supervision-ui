import { Request, Response, NextFunction } from 'express'
import { Data, Route } from '../@types'
// import config from '../config'

type Key = 'appointments' | 'locations' | 'errors'

type Input = any

const storeSessionData = (inputs: Record<string, Input>, req: Request): void => {
  const newSessionData: Data = req?.session?.data || {}
  Object.entries(inputs).forEach(([key, val]: [string, Input]) => {
    if (key.charAt(0) !== '_') {
      newSessionData[key as Key] = val
    }
  })
  req.session.data = newSessionData
  console.dir(req.session.data, { depth: null })
}

export const autoStoreSessionData: Route<void> = (req, res, next) => {
  storeSessionData(req.body, req)

  // Send session data to all views

  res.locals.data = {}

  //   for (const j in req.session.data) {
  //     if (req?.session?.data?.[j as keyof Data]) {
  //       res.locals.data[j] = req.session.data[j as keyof Data]
  //     }
  //   }
  next()
}
