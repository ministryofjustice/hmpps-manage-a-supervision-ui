import { DateTime } from 'luxon'
import logger from '../../../logger'
import { Errors, Route } from '../../@types'
import properties from '../../properties'
import utils from '../../utils'

const activityLog: Route<void> = (req, res, next) => {
  const { dateFrom, dateTo } = req.query
  const { url, query } = req
  const { submit } = query

  const isValidFormat = (date: string): boolean => {
    const regex = /^(?:[1-9]?)?[0-9]\/(?:[1-9]?)?[0-9]\/\d{4}$/
    return regex.test(date)
  }

  const getIsoDate = (date: string): DateTime => {
    const [day, month, year] = date.split('/')
    return DateTime.fromISO(DateTime.local(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10)).toISODate())
  }

  const validateDateFrom = () => {
    let isValid = true
    const anchor = 'dateFrom'
    if (!dateFrom && dateTo) {
      logger.info(properties.errorMessages['activity-log']['date-from'].log)
      const text = properties.errorMessages['activity-log']['date-from'].errors.isEmpty
      errors = utils.addError(errors, { text, anchor })
      isValid = false
    }
    if (isValid && dateFrom && !isValidFormat(dateFrom as string)) {
      const text = properties.errorMessages['activity-log']['date-from'].errors.isInvalid
      errors = utils.addError(errors, { text, anchor })
      isValid = false
    }
    if (isValid && dateFrom) {
      const dateFromIso = getIsoDate(dateFrom as string)
      if (!dateFromIso.isValid) {
        const text = properties.errorMessages['activity-log']['date-from'].errors.isNotReal
        errors = utils.addError(errors, { text, anchor })
        isValid = false
      }
    }
    if (isValid && dateFrom) {
      const dateFromIso = getIsoDate(dateFrom as string)
      const today = DateTime.now()
      if (dateFromIso > today) {
        const text = properties.errorMessages['activity-log']['date-from'].errors.isInFuture
        errors = utils.addError(errors, { text, anchor })
        isValid = false
      }
    }
  }

  const validateDateTo = () => {
    let isValid = true
    const anchor = 'dateTo'
    if (!dateTo && dateFrom) {
      logger.info(properties.errorMessages['activity-log']['date-to'].log)
      const text = properties.errorMessages['activity-log']['date-to'].errors.isEmpty
      errors = utils.addError(errors, { text, anchor })
      isValid = false
    }
    if (isValid && dateTo && !isValidFormat(dateTo as string)) {
      if (isValid && !isValidFormat(dateTo as string)) {
        const text = properties.errorMessages['activity-log']['date-to'].errors.isInvalid
        errors = utils.addError(errors, { text, anchor })
        isValid = false
      }
    }
    if (isValid && dateTo) {
      const dateToIso = getIsoDate(dateTo as string)
      if (!dateToIso.isValid) {
        const text = properties.errorMessages['activity-log']['date-to'].errors.isNotReal
        errors = utils.addError(errors, { text, anchor })
        isValid = false
      }
    }
    if (isValid && dateTo) {
      const dateToIso = getIsoDate(dateTo as string)
      const today = DateTime.now()
      if (dateToIso > today) {
        const text = properties.errorMessages['activity-log']['date-to'].errors.isInFuture
        errors = utils.addError(errors, { text, anchor })
        isValid = false
      }
    }
  }
  let errors: Errors = null
  if (submit) {
    if (req?.session?.errors) {
      delete req.session.errors
    }

    validateDateFrom()
    validateDateTo()

    if (errors) {
      req.session.errors = errors
      return res.redirect(url.replace('&submit=true', ''))
    }
  }
  return next()
}

export default activityLog
