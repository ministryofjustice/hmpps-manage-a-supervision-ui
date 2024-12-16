import { Request, Response, NextFunction } from 'express'
import { Data, Route } from '../@types'
import config from '../config'
import { getDataValue, setDataValue } from '../utils/utils'

type Key = 'appointments' | 'locations' | 'errors'

type Input = any

const toISODate = (val: string): string => {
  const [day, month, year]: string[] = val.split('/')
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

export const autoStoreSessionData = (req: Request, res: Response, next: NextFunction): void => {
  const newSessionData = req?.session?.data || {}
  const { crn, id } = req.params
  const inputs: Record<string, Input> = req.body
  Object.entries(inputs).forEach(([key, val]: [string, Input]) => {
    if (key.charAt(0) !== '_') {
      const getPath = id ? [key, crn, id] : [key, crn]
      const body: Record<string, string> = getDataValue(inputs, getPath)
      Object.keys(body).forEach(valueKey => {
        let newValue = body[valueKey]
        if (config.dateFields.includes(valueKey) && body[valueKey].includes('/')) {
          newValue = toISODate(body[valueKey])
        }
        const setPath = id ? [key, crn, id, valueKey] : [key, crn, valueKey]
        setDataValue(newSessionData, setPath, newValue)
      })
    }
  })
  req.session.data = newSessionData
  return next()
}
