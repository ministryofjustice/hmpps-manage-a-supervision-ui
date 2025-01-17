import { DateTime } from 'luxon'
import logger from '../../../logger'
import { Errors, Route } from '../../@types'
import properties from '../../properties'
import utils from '../../utils'

const activityLog: Route<void> = (req, res, next) => {
  const { dateFrom, dateTo } = req.query
  const { url, query } = req
  const { submit } = query

  const validateDateFrom = () => {
    let isValid = true
    if (!dateFrom) {
      logger.info(properties.errorMessages['activity-log']['date-from'].log)
      const text = properties.errorMessages['activity-log']['date-from'].errors.isEmpty
      const anchor = `dateFrom`
      errors = utils.addError(errors, { text, anchor })
      isValid = false
    }
    if (isValid && dateFrom) {
      const [day, month, year] = (dateFrom as string).split('/')
      const fromDate = DateTime.fromISO(
        DateTime.local(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10)).toISODate(),
      )
      const today = DateTime.now()
      if (fromDate > today) {
        const text = properties.errorMessages['activity-log']['date-from'].errors.isInFuture
        const anchor = `dateFrom`
        errors = utils.addError(errors, { text, anchor })
        isValid = false
      }
    }
    if (isValid && dateFrom) {
      const [day, month, year] = (dateFrom as string).split('/')
      const fromDate = DateTime.fromISO(
        DateTime.local(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10)).toISODate(),
      )
      if (!fromDate.isValid) {
        const text = properties.errorMessages['activity-log']['date-from'].errors.isNotReal
        const anchor = `dateFrom`
        errors = utils.addError(errors, { text, anchor })
        isValid = false
      }
    }
  }

  const validateDateTo = () => {
    let isValid = true
    if (!dateTo) {
      logger.info(properties.errorMessages['activity-log']['date-to'].log)
      const text = properties.errorMessages['activity-log']['date-to'].errors.isEmpty
      const anchor = `dateTo`
      errors = utils.addError(errors, { text, anchor })
      isValid = false
    }
    if (isValid && dateTo) {
      const [day, month, year] = (dateTo as string).split('/')
      const toDate = DateTime.fromISO(
        DateTime.local(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10)).toISODate(),
      )
      const today = DateTime.now()
      if (toDate > today) {
        const text = properties.errorMessages['activity-log']['date-to'].errors.isInFuture
        const anchor = `dateTo`
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
