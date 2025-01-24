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

  const validateDateRanges = () => {
    let dateFromIsValid = true
    let dateToIsValid = true
    if (dateFrom && !isValidFormat(dateFrom as string)) {
      const text = properties.errorMessages['activity-log']['date-from'].errors.isInvalid
      errors = utils.addError(errors, { text, anchor: 'dateFrom' })
      dateFromIsValid = false
    }
    if (dateFromIsValid && dateFrom) {
      const dateFromIso = getIsoDate(dateFrom as string)
      if (!dateFromIso.isValid) {
        const text = properties.errorMessages['activity-log']['date-from'].errors.isNotReal
        errors = utils.addError(errors, { text, anchor: 'dateFrom' })
        dateFromIsValid = false
      }
    }
    if (dateFromIsValid && dateFrom) {
      const dateFromIso = getIsoDate(dateFrom as string)
      const today = DateTime.now()
      if (dateFromIso > today) {
        const text = properties.errorMessages['activity-log']['date-from'].errors.isInFuture
        errors = utils.addError(errors, { text, anchor: 'dateFrom' })
        dateFromIsValid = false
      }
    }
    if (dateTo && !isValidFormat(dateTo as string)) {
      const text = properties.errorMessages['activity-log']['date-to'].errors.isInvalid
      errors = utils.addError(errors, { text, anchor: 'dateTo' })
      dateToIsValid = false
    }
    if (dateToIsValid && dateTo) {
      const dateToIso = getIsoDate(dateTo as string)
      if (!dateToIso.isValid) {
        const text = properties.errorMessages['activity-log']['date-to'].errors.isNotReal
        errors = utils.addError(errors, { text, anchor: 'dateTo' })
        dateToIsValid = false
      }
    }
    if (dateToIsValid && dateTo) {
      const dateToIso = getIsoDate(dateTo as string)
      const today = DateTime.now()
      if (dateToIso > today) {
        const text = properties.errorMessages['activity-log']['date-to'].errors.isInFuture
        errors = utils.addError(errors, { text, anchor: 'dateTo' })
        dateToIsValid = false
      }
    }
    if (!dateFrom && dateTo && dateToIsValid) {
      logger.info(properties.errorMessages['activity-log']['date-from'].log)
      const text = properties.errorMessages['activity-log']['date-from'].errors.isEmpty
      errors = utils.addError(errors, { text, anchor: 'dateFrom' })
      dateFromIsValid = false
    }
    if (!dateTo && dateFrom && dateFromIsValid) {
      logger.info(properties.errorMessages['activity-log']['date-to'].log)
      const text = properties.errorMessages['activity-log']['date-to'].errors.isEmpty
      errors = utils.addError(errors, { text, anchor: 'dateTo' })
      dateToIsValid = false
    }
    if (dateFrom && dateFromIsValid && dateTo && dateToIsValid) {
      const dateFromIso = getIsoDate(dateFrom as string)
      const dateToIso = getIsoDate(dateTo as string)
      if (dateFromIso > dateToIso) {
        const text = properties.errorMessages['activity-log']['date-from'].errors.isAfterTo
        errors = utils.addError(errors, { text, anchor: 'dateFrom' })
        dateFromIsValid = false
      }
    }
    if (dateTo && dateToIsValid && dateFrom && dateFromIsValid) {
      const dateFromIso = getIsoDate(dateFrom as string)
      const dateToIso = getIsoDate(dateTo as string)
      if (dateToIso < dateFromIso) {
        const text = properties.errorMessages['activity-log']['date-to'].errors.isBeforeFrom
        errors = utils.addError(errors, { text, anchor: 'dateTo' })
        dateToIsValid = false
      }
    }
  }

  let errors: Errors = null
  if (submit) {
    if (req?.session?.errors) {
      delete req.session.errors
    }

    validateDateRanges()
    if (errors) {
      req.session.errors = errors
      return res.redirect(url.replace('&submit=true', ''))
    }
  }
  return next()
}

export default activityLog
