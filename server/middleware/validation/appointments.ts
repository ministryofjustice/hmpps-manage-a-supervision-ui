import logger from '../../../logger'
import { Route } from '../../@types'
import properties from '../../properties'
import utils from '../../utils'

const appointments: Route<void> = (req, res, next) => {
  const { url, params } = req
  const { crn } = params
  const render = `pages/${url.split('/').slice(3).join('/')}`
  let errors = null
  if (req.url.includes('/type')) {
    if (!req.body?.appointments?.[crn]?.type) {
      logger.info(properties.errorMessages.appointments.type.log)
      const text = properties.errorMessages.appointments.type.errors.isEmpty
      const anchor = `appointments-${crn}-type`
      errors = utils.addError(errors, { text, anchor })
    }
  }
  if (req.url.includes('/location')) {
    if (!req.body?.appointments?.[crn]?.location) {
      logger.info(properties.errorMessages.appointments.location.log)
      const text = properties.errorMessages.appointments.location.errors.isEmpty
      const anchor = `appointments-${crn}-location`
      errors = utils.addError(errors, { text, anchor })
    }
  }
  if (errors) {
    res.locals.errors = errors
    return res.render(render, { crn, errors })
  }
  return next()
}

export default appointments
