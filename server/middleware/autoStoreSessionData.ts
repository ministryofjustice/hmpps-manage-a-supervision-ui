import { Request, Response, NextFunction } from 'express'
// import config from '../config'

type Input = string | string[]

const storeSessionData = (inputs: Record<string, Input>, req: Request): void => {
  const newSessionData = req?.session?.data || {}
  Object.entries(inputs).forEach(([key, val]: [string, Input]) => {
    let newVal = val
    if (key.charAt(0) !== '_') {
      if (val === '_unchecked' || val?.[0] === '_unchecked') {
        // delete newSessionData[key]
      }
      //         if (config.dateFields.includes(key)) {
      //   const [day, month, year]: string[] = val.split('/')
      //   data[key] = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      // }

      if (Array.isArray(val) && val.includes('_unchecked')) {
        newVal = (newVal as string[]).filter(v => v !== '_unchecked')
      }
      //  newSessionData[key] = newVal
    }
  })
  req.session.data = newSessionData
}

const autoStoreSessionData = (req: Request, res: Response, next: NextFunction) => {
  if (!req?.session?.data) {
    req.session.data = {}
  }

  //   req.session.data = { ...req.session} Object.assign({}, sessionDataDefaults, req.session.data)

  storeSessionData(req.body, req)
  //   storeData(req.query, req.session.data)

  // Send session data to all views

  res.locals.data = {}

  //   for (const j in req.session.data) {
  //     if (req?.session?.data?.[j as keyof Data]) {
  //       res.locals.data[j] = req.session.data[j as keyof Data]
  //     }
  //   }
  next()
}

export default autoStoreSessionData
