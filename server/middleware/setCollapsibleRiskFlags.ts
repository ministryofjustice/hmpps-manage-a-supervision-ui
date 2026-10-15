import { Request, NextFunction } from 'express'
import { AppResponse } from '../models/Locals'

// Transactional journeys (e.g. arrange an appointment) let the user hide the NDelius risk flags in the person header
export const setCollapsibleRiskFlags = (_req: Request, res: AppResponse, next: NextFunction) => {
  if (res.locals.flags?.enablePersonHeader === true) {
    res.locals.collapsibleRiskFlags = true
  }
  return next()
}
