import { Request } from 'express'

export const isRescheduleAppointment = (req: Request): boolean => {
  const { change = null } = req?.query as Record<string, string>

  if (change === null) return false
  if (typeof change !== 'string' || change.includes('..') || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(change.trim())) {
    throw new Error('Invalid change parameter passed through. Must be a string and not contain ".." (i.e relative url)')
  }
  return change.includes('/reschedule')
}
