/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */

import { DateTime } from 'luxon'
import { Route, ActivityLogFilters, ActivityLogFiltersResponse, SelectedFilterItem, Option } from '../@types'

export const filterActivityLog: Route<void> = (req, res, next) => {
  if (req?.query?.submit) {
    let url = req.url.split('&page=')[0]
    url = url.replace('&submit=true', '')
    return res.redirect(url)
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
      dateFrom && dateTo && !errors?.errorMessages?.dateFrom && clearFilterKey !== 'dateRange'
        ? (dateFrom as string)
        : '',
    dateTo:
      dateTo && dateFrom && !errors?.errorMessages?.dateTo && clearFilterKey !== 'dateRange' ? (dateTo as string) : '',
    compliance: compliance as string[],
  }

  const getQueryString = (values: ActivityLogFilters | Record<string, string>): string => {
    const keys = [...Object.keys(filters)]
    const queryStr = Object.entries(values)
      .filter(([key, _value]) => keys.includes(key))
      .reduce((acc, [key, value], i) => {
        if (value) {
          if (Array.isArray(value)) {
            for (let j = 0; j < value.length; j += 1) {
              acc = `${acc}${acc ? '&' : ''}${key}=${encodeURI(value[j] as string)}`
            }
          } else {
            acc = `${acc}${i > 0 ? '&' : ''}${key}=${encodeURI(value as string)}`
          }
        }
        return acc
      }, '')
    return queryStr
  }

  const queryStr = getQueryString(req.query as Record<string, string>)
  const queryStrPrefix = queryStr ? '?' : ''
  const queryStrSuffix = queryStr ? '&' : '?'

  if (clearFilterKey) {
    const redirectQueryStr = getQueryString(filters)
    return res.redirect(`${baseUrl}${redirectQueryStr ? `?${redirectQueryStr}` : ''}`)
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
    queryStr,
    queryStrPrefix,
    queryStrSuffix,
    keywords: filters.keywords as string,
    compliance: filters.compliance as string[],
    dateFrom: filters.dateFrom as string,
    dateTo: filters.dateTo as string,
    maxDate,
  }
  res.locals.filters = filtersResponse

  return next()
}
