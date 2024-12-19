import { Route } from '../@types'

export const getAppointment: Route<void> = (req, res, next): void => {
  const { crn, id } = req.params
  if (req.session?.data?.appointments?.[crn]?.[id]) {
    res.locals.appointment = req.session.data.appointments[crn][id]
  }
  return next()
}
