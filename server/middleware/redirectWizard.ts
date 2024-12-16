import { Request, Response, NextFunction } from 'express'
import { getDataValue } from '../utils/utils'
import { Route } from '../@types'

export const redirectWizard = (requiredValues: string[]): Route<void> => {
  // eslint-disable-next-line consistent-return
  return async (req: Request, res: Response, next: NextFunction) => {
    const { crn, id } = req.params
    const { data } = req.session
    // eslint-disable-next-line no-restricted-syntax
    for (const requiredValue of requiredValues) {
      const value = getDataValue(data, ['appointments', crn, id, requiredValue])
      if (!value) {
        return res.redirect(`/case/${crn}/arrange-appointment/${id}/type`)
      }
    }
    return next()
  }
}
