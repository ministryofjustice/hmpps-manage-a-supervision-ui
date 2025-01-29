import { DateTime } from 'luxon'
import logger from '../../../logger'
import { Errors, Route } from '../../@types'
import properties from '../../properties'
import utils from '../../utils'
import { toCamelCase } from '../../utils/utils'

const activityLog: Route<void> = (req, res, next) => {
  const { dateFrom: dateFromQuery, dateTo: dateToQuery } = req.query
  const dateFrom = dateFromQuery as string
  const dateTo = dateToQuery as string
  const { url, query } = req
  const { submit } = query

  const isValid: { [key: string]: boolean } = {
    dateFrom: true,
    dateTo: true,
  }

  const getIsoDate = (date: string): DateTime => {
    const [day, month, year] = date.split('/')
    return DateTime.fromISO(DateTime.local(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10)).toISODate())
  }

  const isValidDateFormat = (nameProp: string, dateVal: string): void => {
    const regex = /^(?:[1-9])?\d\/(?:[1-9])?\d\/\d{4}$/
    if (dateVal && !regex.test(dateVal)) {
      const text = properties.errorMessages['activity-log'][nameProp].errors.isInvalid
      const name = toCamelCase(nameProp)
      errors = utils.addError(errors, { text, anchor: name })
      isValid[name] = false
    }
  }

  const isRealDate = (nameProp: string, dateVal: string): void => {
    const dateToIso = getIsoDate(dateVal as string)
    if (!dateToIso.isValid) {
      const text = properties.errorMessages['activity-log'][nameProp].errors.isNotReal
      const name = toCamelCase(nameProp)
      errors = utils.addError(errors, { text, anchor: name })
      isValid[name] = false
    }
  }

  const isDateInFuture = (nameProp: string, dateVal: string): void => {
    const dateFromIso = getIsoDate(dateVal as string)
    const today = DateTime.now()
    if (dateFromIso > today) {
      const text = properties.errorMessages['activity-log'][nameProp].errors.isInFuture
      const name = toCamelCase(nameProp)
      errors = utils.addError(errors, { text, anchor: name })
      isValid[name] = false
    }
  }

  const validateDateRanges = (): void => {
    isValidDateFormat('date-from', dateFrom)

    if (isValid.dateFrom && dateFrom) {
      isRealDate('date-from', dateFrom)
    }
    if (isValid.dateFrom && dateFrom) {
      isDateInFuture('date-from', dateFrom)
    }

    isValidDateFormat('date-to', dateTo)

    if (isValid.dateTo && dateTo) {
      isRealDate('date-to', dateTo)
    }
    if (isValid.dateTo && dateTo) {
      isDateInFuture('date-to', dateTo)
    }
    if (!dateFrom && dateTo && isValid.dateTo) {
      logger.info(properties.errorMessages['activity-log']['date-from'].log)
      const text = properties.errorMessages['activity-log']['date-from'].errors.isEmpty
      errors = utils.addError(errors, { text, anchor: 'dateFrom' })
      isValid.dateFrom = false
    }
    if (!dateTo && dateFrom && isValid.dateFrom) {
      logger.info(properties.errorMessages['activity-log']['date-to'].log)
      const text = properties.errorMessages['activity-log']['date-to'].errors.isEmpty
      errors = utils.addError(errors, { text, anchor: 'dateTo' })
      isValid.dateTo = false
    }
    if (dateFrom && isValid.dateFrom && dateTo && isValid.dateTo) {
      const dateFromIso = getIsoDate(dateFrom as string)
      const dateToIso = getIsoDate(dateTo as string)
      if (dateFromIso > dateToIso) {
        const text = properties.errorMessages['activity-log']['date-from'].errors.isAfterTo
        errors = utils.addError(errors, { text, anchor: 'dateFrom' })
        isValid.dateFrom = false
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
