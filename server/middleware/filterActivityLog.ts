import { DateTime } from 'luxon'
import { Route, ActivityLogFilters, ActivityLogFiltersResponse, SelectedFilterItem, Option } from '../@types'

/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */

export const filterActivityLog: Route<void> = (req, res, next) => {
  if (req?.query?.submit) {
    return res.redirect(req.url.replace('&submit=true', ''))
  }
  const { crn } = req.params
  const { keywords = '', dateFrom = '', dateTo = '', clearFilterKey, clearFilterValue, page = '1' } = req.query
  const errors = req?.session?.errors
  let { compliance } = req.query
  const baseUrl = `/case/${crn}/activity-log`
  compliance = compliance ? (Array.isArray(compliance) ? compliance : [compliance]) : []
  if (compliance?.length && clearFilterKey === 'compliance') {
    compliance = compliance.filter(value => value !== clearFilterValue)
  }

  const filters: ActivityLogFilters = {
    keywords: keywords && clearFilterKey !== 'keywords' ? (keywords as string) : '',
    dateFrom:
      dateFrom && !errors?.errorMessages?.dateFrom && clearFilterKey !== 'dateRange' ? (dateFrom as string) : '',
    dateTo: dateTo && !errors?.errorMessages?.dateTo && clearFilterKey !== 'dateRange' ? (dateTo as string) : '',
    compliance: compliance as string[],
  }

  const queryStr = Object.entries(filters).reduce((acc, [key, value], i) => {
    if (value) {
      if (Array.isArray(value)) {
        for (let j = 0; j < value.length; j += 1) {
          acc = `${acc}${acc ? '&' : ''}${key}=${encodeURI(value[j])}`
        }
      } else {
        acc = `${acc}${i > 0 ? '&' : ''}${key}=${encodeURI(value)}`
      }
    }
    return acc
  }, '')

  if (clearFilterKey) {
    return res.redirect(`${baseUrl}${queryStr ? `?${queryStr}` : ''}`)
  }

  const filterHref = (key: string, value: string): string =>
    `${baseUrl}${queryStr ? `?${queryStr}&` : '?'}&clearFilterKey=${key}&clearFilterValue=${encodeURI(value)}`

  const selectedFilterItems: SelectedFilterItem[] = Object.entries(filters)
    .filter(([_key, value]) => value)
    .reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        for (const text of value) {
          acc = [
            ...acc,
            {
              text,
              href: filterHref(key, text),
            },
          ]
        }
      } else if (key !== 'dateTo') {
        let text = value
        let cfKey = key
        if (key === 'dateFrom') {
          text = value && filters.dateTo ? `${value} - ${filters.dateTo}` : ''
          cfKey = 'dateRange'
        }
        if (text) {
          acc = [
            ...acc,
            {
              text,
              href: filterHref(cfKey, value),
            },
          ]
        }
      }
      return acc
    }, [])

  const complianceOptions: Option[] = ['Absences waiting for evidence', 'Acceptable absences', 'Appointments'].map(
    option => ({
      text: option,
      value: option,
      checked: filters.compliance.includes(option),
    }),
  )

  const today = new Date()
  const maxDate = DateTime.fromJSDate(today).toFormat('dd/MM/yyyy')

  const filtersResponse: ActivityLogFiltersResponse = {
    errors,
    selectedFilterItems,
    complianceOptions,
    baseUrl,
    keywords: req.query.keywords as string,
    compliance: req.query.compliance as string[],
    dateFrom: req.query.dateFrom as string,
    dateTo: req.query.dateTo as string,
    maxDate,
  }
  res.locals.filters = filtersResponse

  return next()
}
