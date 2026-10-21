import { Request } from 'express'

export const isRescheduleAppointment = (req: Request): boolean => {
  const { change = null } = req?.query as Record<string, string>

  if (!change) return false
  if (change?.includes('..')) {
    throw new Error('Invalid change parameter passed through')
  }
  return change.includes('/reschedule')
}
