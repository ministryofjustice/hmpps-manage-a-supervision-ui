import logger from '../../../logger'
import { Route } from '../../@types'
import properties from '../../properties'
import utils from '../../utils'

const appointments: Route<void> = (req, res, next) => {
  const { crn } = req.params
  let errors = null
  if (req.url.includes('/type')) {
    if (!req.body?.appointments?.[crn]?.type) {
      logger.info(properties.errorMessages.appointments.type.log)
      const text = properties.errorMessages.appointments.type.errors.isEmpty
      const anchor = `appointments-${crn}-type`
      errors = utils.addError(errors, { text, anchor })
    }
  }
  if (errors) {
    res.locals.errors = errors
    return res.render(`pages/arrange-appointment/type`, { crn, errors })
  }
  return next()
}

export default appointments
