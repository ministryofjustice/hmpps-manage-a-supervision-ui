import logger from '../../../logger'
import { Errors, Route } from '../../@types'
import properties from '../../properties'
import utils from '../../utils'

interface LocalParams {
  crn: string
  id: string
  errors?: Errors
  minDate?: string
}
const appointments: Route<void> = (req, res, next) => {
  const { url, params } = req
  const { crn, id } = params
  const localParams: LocalParams = { crn, id }
  const render = `pages/${[
    url
      .split('/')
      .filter(item => item)
      .filter((item, i) => ![0, 1, 3].includes(i))
      .join('/'),
  ]}`
  let errors = null
  if (req.url.includes('/type')) {
    if (!req.body?.appointments?.[crn]?.[id]?.type) {
      logger.info(properties.errorMessages.appointments.type.log)
      const text = properties.errorMessages.appointments.type.errors.isEmpty
      const anchor = `appointments-${crn}-${id}-type`
      errors = utils.addError(errors, { text, anchor })
    }
  }
  if (req.url.includes('/location')) {
    if (!req.body?.appointments?.[crn]?.[id]?.location) {
      logger.info(properties.errorMessages.appointments.location.log)
      const text = properties.errorMessages.appointments.location.errors.isEmpty
      const anchor = `appointments-${crn}-location`
      errors = utils.addError(errors, { text, anchor })
    }
  }
  if (req.url.includes('/date-time')) {
    // eslint-disable-next-line no-underscore-dangle
    localParams.minDate = req.body._minDate
    if (!req.body?.appointments?.[crn]?.[id]?.date) {
      logger.info(properties.errorMessages.appointments.date.log)
      const text = properties.errorMessages.appointments.date.errors.isEmpty
      const anchor = `appointments-${crn}-${id}-date`
      errors = utils.addError(errors, { text, anchor })
    }
    if (!req.body?.appointments?.[crn]?.[id]?.['start-time']) {
      logger.info(properties.errorMessages.appointments['start-time'].log)
      const text = properties.errorMessages.appointments['start-time'].errors.isEmpty
      const anchor = `appointments-${crn}-${id}-start-time`
      errors = utils.addError(errors, { text, anchor })
    }
    if (!req.body?.appointments?.[crn]?.[id]?.['end-time']) {
      logger.info(properties.errorMessages.appointments['end-time'].log)
      const text = properties.errorMessages.appointments['end-time'].errors.isEmpty
      const anchor = `appointments-${crn}-${id}-end-time`
      errors = utils.addError(errors, { text, anchor })
    }
  }

  if (errors) {
    console.dir(errors, { depth: null })
    res.locals.errors = errors
    return res.render(render, { errors, ...localParams })
  }
  return next()
}

export default appointments
