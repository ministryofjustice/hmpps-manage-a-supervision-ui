import logger from '../../../logger'
import { Errors, Route } from '../../@types'
import properties from '../../properties'
import utils from '../../utils'
import { getDataValue } from '../../utils/utils'

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
      .filter((_item, i) => ![0, 1, 3].includes(i))
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
  if (req.url.includes('/sentence')) {
    const { data } = req.session
    const type = getDataValue(data, ['appointments', crn, id, 'type'])
    const showReveal = ['Home visit', 'Planned office visit'].includes(type)
    const sentences = req.session.data.sentences[crn]

    if (!req.body?.appointments?.[crn]?.[id]?.sentence) {
      logger.info(properties.errorMessages.appointments.sentence.log)
      const text = properties.errorMessages.appointments.sentence.errors.isEmpty
      const anchor = `appointments-${crn}-${id}-sentence`
      errors = utils.addError(errors, { text, anchor })
    } else {
      const sentence = sentences.find((s: any) => s.order.description === req.body.appointments[crn][id].sentence)

      if (
        showReveal &&
        sentence?.requirements?.length &&
        !req?.body?.appointments?.[crn]?.[id]?.['sentence-requirement']
      ) {
        logger.info(properties.errorMessages.appointments['sentence-requirement'].log)
        const text = properties.errorMessages.appointments['sentence-requirement'].errors.isEmpty
        const anchor = `appointments-${crn}-${id}-sentence-requirement`
        errors = utils.addError(errors, { text, anchor })
      }
      if (
        showReveal &&
        sentence?.licenceConditions?.length &&
        !req?.body?.appointments?.[crn]?.[id]?.['sentence-licence-condition']
      ) {
        logger.info(properties.errorMessages.appointments['sentence-licence-condition'].log)
        const text = properties.errorMessages.appointments['sentence-licence-condition'].errors.isEmpty
        const anchor = `appointments-${crn}-${id}-sentence-licence-condition`
        errors = utils.addError(errors, { text, anchor })
      }
    }
  }
  if (req.url.includes('/location')) {
    if (!req.body?.appointments?.[crn]?.[id]?.location) {
      logger.info(properties.errorMessages.appointments.location.log)
      const text = properties.errorMessages.appointments.location.errors.isEmpty
      const anchor = `appointments-${crn}-${id}-location`
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
  if (req.url.includes('/repeating')) {
    const repeatingValue = req.body?.appointments?.[crn]?.[id]?.repeating
    const { data } = req.session
    const repeatingCountValue = getDataValue(data, ['appointments', crn, id, 'repeating-count'])
    const validRepeatingCount = !Number.isNaN(parseInt(repeatingCountValue, 10))
    const appointmentDate = getDataValue(data, ['appointments', crn, id, 'date'])
    const appointmentRepeatingDates = getDataValue(data, ['appointments', crn, id, 'repeating-dates'])
    const oneYearFromDate = new Date(appointmentDate)
    oneYearFromDate.setFullYear(oneYearFromDate.getFullYear() + 1)
    let finalAppointmentDate = null
    let isMoreThanAYear = false
    if (appointmentRepeatingDates) {
      finalAppointmentDate = appointmentRepeatingDates[appointmentRepeatingDates.length - 1]
      isMoreThanAYear = new Date(finalAppointmentDate) > oneYearFromDate
    }
    if (!repeatingValue) {
      logger.info(properties.errorMessages.appointments.repeating.log)
      const text = properties.errorMessages.appointments.repeating.errors.isEmpty
      const anchor = `appointments-${crn}-${id}-repeating`
      errors = utils.addError(errors, { text, anchor })
    }
    if (repeatingValue === 'Yes' && !req.body?.appointments?.[crn]?.[id]?.['repeating-frequency']) {
      logger.info(properties.errorMessages.appointments['repeating-frequency'].log)
      const text = properties.errorMessages.appointments['repeating-frequency'].errors.isEmpty
      const anchor = `appointments-${crn}-${id}-repeating-frequency`
      errors = utils.addError(errors, { text, anchor })
    }
    if (repeatingValue === 'Yes' && !req.body?.appointments?.[crn]?.[id]?.['repeating-count']) {
      logger.info(properties.errorMessages.appointments['repeating-count'].log)
      const text = properties.errorMessages.appointments['repeating-count'].errors.isEmpty
      const anchor = `appointments-${crn}-${id}-repeating-count`
      errors = utils.addError(errors, { text, anchor })
    }
    if (repeatingCountValue && !validRepeatingCount) {
      logger.info(properties.errorMessages.appointments['repeating-count'].log)
      const text = properties.errorMessages.appointments['repeating-count'].errors.isInvalid
      const anchor = `appointments-${crn}-${id}-repeating-count`
      errors = utils.addError(errors, { text, anchor })
    }
    if (isMoreThanAYear) {
      const textFrequency = properties.errorMessages.appointments['repeating-frequency'].errors.isMoreThanAYear
      const anchor = `appointments-${crn}-${id}-repeating-frequency`
      errors = utils.addError(errors, { text: textFrequency, anchor })
    }
  }

  if (errors) {
    res.locals.errors = errors
    return res.render(render, { errors, ...localParams })
  }
  return next()
}

export default appointments
