import { Request } from 'express'

export const isRescheduleAppointment = (req: Request): boolean => {
  const change = req?.query?.change
  if (typeof change !== 'string' || !change) return false
  return change.includes('/reschedule')
}
