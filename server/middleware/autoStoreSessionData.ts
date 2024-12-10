import { Request, Response, NextFunction } from 'express'
import { Data, Route } from '../@types'
import config from '../config'
import { getDataValue, setDataValue } from '../utils/utils'

type Key = 'appointments' | 'locations' | 'errors'

type Input = any

// const getNestedObjectPath = (obj: Record<string, object | string>): string[] => {
//   const path: string[] = []
//   const loopObject = (o: Record<string, object | string>) => {
//     const keys = Object.keys(obj)
//     path.push(keys[0])
//     if (typeof obj[keys[0]] === 'object') {
//       loopObject(obj[keys[0]] as Record<string, object | string>)
//     }
//   }
//   loopObject(obj)
//   return path
// }

// const valueIsSlashedDate = (val: string) => {
//   console.log('test', val)
//   const regex: RegExp = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19[0-9]{2}|20[0-9]{2})$/
//   return regex.test(val)
// }

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
  // console.log('------ stored data -------')
  // console.dir(req.session.data, { depth: null })
  // console.log('------ end stored data -------')
  return next()
}
