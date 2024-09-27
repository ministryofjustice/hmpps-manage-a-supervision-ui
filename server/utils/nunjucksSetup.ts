/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks from 'nunjucks'
import express from 'express'
import {
  activityLog,
  activityLogDate,
  addressToList,
  compactActivityLogDate,
  dateWithDayAndWithoutYear,
  dateWithNoDay,
  dateWithYear,
  dateWithYearShortMonth,
  dayOfWeek,
  deliusDateFormat,
  deliusDeepLinkUrl,
  deliusHomepageUrl,
  fullName,
  getAppointmentsToAction,
  getComplianceStatus,
  getCurrentRisksToThemselves,
  getDataValue,
  getDistinctRequirements,
  getPreviousRisksToThemselves,
  getRisksToThemselves,
  getRisksWithScore,
  getTagClass,
  govukTime,
  initialiseName,
  interventionsLink,
  isInThePast,
  isToday,
  lastUpdatedBy,
  lastUpdatedDate,
  monthsOrDaysElapsed,
  oaSysUrl,
  removeEmpty,
  scheduledAppointments,
  sentencePlanLink,
  setSortOrder,
  tierLink,
  timeFromTo,
  toSlug,
  toYesNo,
  yearsSince,
} from './utils'
import { ApplicationInfo } from '../applicationInfo'
import config from '../config'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, applicationInfo: ApplicationInfo): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Manage a Supervision'
  app.locals.environmentName = config.environmentName
  app.locals.environmentNameColour = config.environmentName === 'PRE-PRODUCTION' ? 'govuk-tag--green' : ''

  // Cachebusting version string
  if (production) {
    // Version only changes with new commits
    app.locals.version = applicationInfo.gitShortHash
  } else {
    // Version changes every request
    app.use((req, res, next) => {
      res.locals.version = Date.now().toString()
      return next()
    })
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/dist',
      'node_modules/govuk-frontend/dist/components/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/frontend/moj/components/',
      'node_modules/@ministryofjustice/probation-search-frontend/components',
    ],
    {
      autoescape: true,
      express: app,
    },
  )
  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('dateWithYear', dateWithYear)
  njkEnv.addFilter('dateWithDayAndWithoutYear', dateWithDayAndWithoutYear)
  njkEnv.addFilter('yearsSince', yearsSince)
  njkEnv.addFilter('dateWithNoDay', dateWithNoDay)
  njkEnv.addFilter('dateWithYearShortMonth', dateWithYearShortMonth)
  njkEnv.addFilter('fullName', fullName)
  njkEnv.addFilter('monthsOrDaysElapsed', monthsOrDaysElapsed)
  njkEnv.addFilter('govukTime', govukTime)
  njkEnv.addFilter('lastUpdatedDate', lastUpdatedDate)
  njkEnv.addFilter('deliusDateFormat', deliusDateFormat)
  njkEnv.addFilter('dayOfWeek', dayOfWeek)
  njkEnv.addFilter('toYesNo', toYesNo)
  njkEnv.addFilter('compactActivityLogDate', compactActivityLogDate)
  njkEnv.addFilter('activityLogDate', activityLogDate)
  njkEnv.addFilter('removeEmpty', removeEmpty)
  njkEnv.addFilter('toSlug', toSlug)

  app.use((req, res, next) => {
    /* eslint-disable */
    njkEnv.addFilter('decorateFormAttributes', (obj: any, attributeName: string, sessionObjName: string) => {
      const storedValue = getDataValue(req.session[sessionObjName] as unknown, attributeName)
      if (obj.items !== undefined) {
        obj.items = obj.items.map((item: any) => {
          let checked = storedValue ? '' : item.checked
          let selected = storedValue ? '' : item.selected
          if (typeof item.value === 'undefined') {
            item.value = item.text
          }
          if (storedValue === item.value) {
            checked = 'checked'
            selected = 'selected'
          }
          item.checked = checked
          item.selected = selected
          return item
        })
        obj.idPrefix = attributeName
      } else {
        obj.value = storedValue
      }
      if (typeof obj.id === 'undefined') {
        obj.id = attributeName
      }
      obj.name = `[${attributeName}]`
      return obj
    })
    return next()
  })
  njkEnv.addGlobal('getComplianceStatus', getComplianceStatus)
  njkEnv.addGlobal('timeFromTo', timeFromTo)
  njkEnv.addGlobal('getRisksWithScore', getRisksWithScore)
  njkEnv.addGlobal('activityLog', activityLog)
  njkEnv.addGlobal('getRisksToThemselves', getRisksToThemselves)
  njkEnv.addGlobal('getCurrentRisksToThemselves', getCurrentRisksToThemselves)
  njkEnv.addGlobal('getPreviousRisksToThemselves', getPreviousRisksToThemselves)
  njkEnv.addGlobal('getTagClass', getTagClass)
  njkEnv.addGlobal('addressToList', addressToList)
  njkEnv.addGlobal('lastUpdatedBy', lastUpdatedBy)
  njkEnv.addGlobal('deliusDeepLinkUrl', deliusDeepLinkUrl)
  njkEnv.addGlobal('oaSysUrl', oaSysUrl)
  njkEnv.addGlobal('deliusHomepageUrl', deliusHomepageUrl)
  njkEnv.addGlobal('scheduledAppointments', scheduledAppointments)
  njkEnv.addGlobal('isToday', isToday)
  njkEnv.addGlobal('isInThePast', isInThePast)
  njkEnv.addGlobal('getAppointmentsToAction', getAppointmentsToAction)
  njkEnv.addGlobal('getDistinctRequirements', getDistinctRequirements)
  njkEnv.addGlobal('tierLink', tierLink)
  njkEnv.addGlobal('sentencePlanLink', sentencePlanLink)
  njkEnv.addGlobal('interventionsLink', interventionsLink)
  njkEnv.addGlobal('setSortOrder', setSortOrder)
}
