/* eslint-disable no-param-reassign */

import { DateTime } from 'luxon'
import { Route, ActivityLogFilters, ActivityLogFiltersResponse, SelectedFilterItem, Option } from '../@types'

export const filterActivityLog: Route<void> = (req, res, next) => {
  if (req?.query?.submit) {
    let url = req.url.split('&page=')[0]
    url = url.replace('&submit=true', '')
    return res.redirect(url)
  }
  const { crn } = req.params
  const { keywords = '', dateFrom = '', dateTo = '', clearFilterKey, clearFilterValue } = req.query
  const errors = req?.session?.errors
  const { compliance: complianceQuery = [] } = req.query
  let compliance = complianceQuery as string[] | string
  const baseUrl = `/case/${crn}/activity-log`
  if (!Array.isArray(compliance)) {
    compliance = [compliance]
  }
  if (compliance?.length && clearFilterKey === 'compliance') {
    compliance = compliance.filter(value => value !== clearFilterValue)
  }
  const complianceFilterOptions: Option[] = [
    { text: 'Without an outcome', value: 'no outcome' },
    { text: 'Complied', value: 'complied' },
    { text: 'Not complied', value: 'not complied' },
  ]
  const filters: ActivityLogFilters = {
    keywords: keywords && clearFilterKey !== 'keywords' ? (keywords as string) : '',
    dateFrom:
      dateFrom && dateTo && !errors?.errorMessages?.dateFrom && clearFilterKey !== 'dateRange'
        ? (dateFrom as string)
        : '',
    dateTo:
      dateTo && dateFrom && !errors?.errorMessages?.dateTo && clearFilterKey !== 'dateRange' ? (dateTo as string) : '',
    compliance,
  }

  const getQueryString = (values: ActivityLogFilters | Record<string, string>): string => {
    const keys = [...Object.keys(filters)]
    const queryStr: string = Object.entries(values)
      .filter(([key, _value]) => keys.includes(key))
      .reduce((acc, [key, value]: [string, string | string[]], i) => {
        if (value) {
          if (Array.isArray(value)) {
            for (const val of value) {
              acc = `${acc}${acc ? '&' : ''}${key}=${encodeURI(val)}`
            }
          } else {
            acc = `${acc}${i > 0 ? '&' : ''}${key}=${encodeURI(value)}`
          }
        }
        return acc
      }, '')
    return queryStr
  }

  const queryStr = getQueryString(req.query as Record<string, string>)
  const queryStrPrefix = queryStr ? '?' : ''
  const queryStrSuffix = queryStr ? '&' : '?'
  const redirectQueryStr = getQueryString(filters)

  if (clearFilterKey) {
    let redirectUrl = baseUrl
    if (redirectQueryStr) redirectUrl = `${redirectUrl}?${redirectQueryStr}`
    return res.redirect(redirectUrl)
  }

  const filterHref = (key: string, value: string): string =>
    queryStr
      ? `${baseUrl}?${queryStr}&clearFilterKey=${key}&clearFilterValue=${encodeURI(value)}`
      : `${baseUrl}?clearFilterKey=${key}&clearFilterValue=${encodeURI(value)}`

  const selectedFilterItems: SelectedFilterItem[] = Object.entries(filters)
    .filter(([_key, value]) => value)
    .reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        for (const text of value) {
          acc = [
            ...acc,
            {
              text: complianceFilterOptions.find(option => option.value === text).text,
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

  const complianceOptions: Option[] = complianceFilterOptions.map(({ text, value }) => ({
    text,
    value,
    checked: filters.compliance.includes(value),
  }))

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
    keywords: filters.keywords,
    compliance: filters.compliance,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    maxDate,
  }
  res.locals.filters = filtersResponse

  return next()
}
