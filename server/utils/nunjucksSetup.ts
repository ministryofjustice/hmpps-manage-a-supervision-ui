/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks from 'nunjucks'
import express, { Request, NextFunction } from 'express'
import {
  activityLog,
  activityLogDate,
  addressToList,
  compactActivityLogDate,
  dateForSort,
  dateWithDayAndWithoutYear,
  dateWithNoDay,
  dateWithYear,
  dateWithYearShortMonth,
  dateWithYearShortMonthAndTime,
  dayOfWeek,
  decorateFormAttributes,
  defaultFormInputValues,
  defaultFormSelectValues,
  deliusDateFormat,
  deliusDeepLinkUrl,
  deliusHomepageUrl,
  fromIsoDateToPicker,
  fullName,
  getAppointmentsToAction,
  getComplianceStatus,
  getCurrentRisksToThemselves,
  getDistinctRequirements,
  getPreviousRisksToThemselves,
  getRisksToThemselves,
  getRisksWithScore,
  getTagClass,
  govukTime,
  groupNeeds,
  groupByLevel,
  hasValue,
  initialiseName,
  interventionsLink,
  isDefined,
  isInThePast,
  isNotNull,
  isToday,
  lastUpdatedBy,
  lastUpdatedDate,
  monthsOrDaysElapsed,
  oaSysUrl,
  removeEmpty,
  riskLevelLabel,
  scheduledAppointments,
  sentencePlanLink,
  setSortOrder,
  sortAppointmentsDescending,
  tierLink,
  timeForSort,
  timeFromTo,
  toErrorList,
  toIsoDateFromPicker,
  toSlug,
  toYesNo,
  yearsSince,
} from './utils'
import { ApplicationInfo } from '../applicationInfo'
import config from '../config'
import { AppResponse } from '../@types'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, applicationInfo: ApplicationInfo): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Manage people on probation'
  app.locals.environmentName = config.environmentName
  app.locals.environmentNameColour = config.environmentName === 'PRE-PRODUCTION' ? 'govuk-tag--green' : ''

  // Cachebusting version string
  if (production) {
    // Version only changes with new commits
    app.locals.version = applicationInfo.gitShortHash
  } else {
    // Version changes every request
    app.use((_req, res: AppResponse, next) => {
      res.locals.version = Date.now().toString()
      return next()
    })
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, 'server/views'),
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
  njkEnv.addFilter('defaultFormInputValues', defaultFormInputValues)
  njkEnv.addFilter('defaultFormSelectValues', defaultFormSelectValues)
  njkEnv.addFilter('dateForSort', dateForSort)
  njkEnv.addFilter('timeForSort', timeForSort)
  njkEnv.addFilter('toErrorList', toErrorList)

  app.use((req: Request, res: AppResponse, next: NextFunction) => {
    njkEnv.addFilter('decorateFormAttributes', decorateFormAttributes(req, res))
    return next()
  })

  njkEnv.addFilter('dateWithYearShortMonthAndTime', dateWithYearShortMonthAndTime)
  njkEnv.addGlobal('groupNeeds', groupNeeds)
  njkEnv.addGlobal('groupByLevel', groupByLevel)
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
  njkEnv.addGlobal('sortAppointmentsDescending', sortAppointmentsDescending)
  njkEnv.addGlobal('isNotNull', isNotNull)
  njkEnv.addGlobal('isDefined', isDefined)
  njkEnv.addGlobal('hasValue', hasValue)
  njkEnv.addGlobal('riskLevelLabel', riskLevelLabel)
  njkEnv.addGlobal('toIsoDateFromPicker', toIsoDateFromPicker)
  njkEnv.addGlobal('fromIsoDateToPicker', fromIsoDateToPicker)
}
