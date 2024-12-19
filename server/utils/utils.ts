/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { DateTime } from 'luxon'
import slugify from 'slugify'
import getKeypath from 'lodash/get'
import setKeypath from 'lodash/set'
import { Request, Response } from 'express'
import { RiskScore, RiskToSelf } from '../data/arnsApiClient'
import { Name } from '../data/model/common'
import { Address } from '../data/model/personalDetails'
import config from '../config'
import { Activity } from '../data/model/schedule'
import { CaseSearchFilter, SelectElement } from '../data/model/caseload'
import { RecentlyViewedCase, UserAccess } from '../data/model/caseAccess'

interface Item {
  checked?: string
  selected?: string
  value: string
  text?: string
  idPrefix?: string
}

const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export const dateWithYear = (datetimeString: string): string | null => {
  if (!datetimeString || isBlank(datetimeString)) return ''
  return DateTime.fromISO(datetimeString).toFormat('d MMMM yyyy')
}

export const dateWithDayAndWithoutYear = (datetimeString: string): string | null => {
  if (!datetimeString || isBlank(datetimeString)) return null
  return DateTime.fromISO(datetimeString).toFormat('cccc d MMMM')
}

export const yearsSince = (datetimeString: string): string | null => {
  if (!datetimeString || isBlank(datetimeString)) return null
  return DateTime.now().diff(DateTime.fromISO(datetimeString), ['years', 'months']).years.toString()
}

export const dateWithNoDay = (datetimeString: string): string | null => {
  if (!datetimeString || isBlank(datetimeString)) return null
  return DateTime.fromISO(datetimeString).toFormat('MMMM yyyy')
}
export const dateForSort = (datetimeString: string): number | null => {
  if (!datetimeString || isBlank(datetimeString)) return null
  return DateTime.fromISO(datetimeString).toMillis()
}

export const timeForSort = (datetimeString: string): number | null => {
  if (!datetimeString || isBlank(datetimeString)) return null
  return Number(DateTime.fromISO(datetimeString).toFormat('HHmm'))
}

export const fullName = (name: Name): string => {
  if (name === undefined || name === null) return ''
  return `${name.forename} ${name.surname}`
}

export const monthsOrDaysElapsed = (datetimeString: string): string => {
  if (!datetimeString || isBlank(datetimeString)) return null
  const months = DateTime.now().diff(DateTime.fromISO(datetimeString), ['months', 'days']).months.toString()
  const days = DateTime.now().diff(DateTime.fromISO(datetimeString), ['days', 'hours']).days.toString()
  if (months === '0') {
    return `${days} days`
  }
  return `${months} months`
}

export const dateWithYearShortMonth = (datetimeString: string): string => {
  if (!datetimeString || isBlank(datetimeString)) return null
  return DateTime.fromISO(datetimeString).toFormat('d MMM yyyy')
}

export const govukTime = (datetimeString: string): string => {
  if (!datetimeString || isBlank(datetimeString)) return null
  const datetime = DateTime.fromISO(datetimeString)
  const hourMinuteFormat = datetime.minute === 0 ? 'ha' : 'h:mma'
  return datetime.toFormat(hourMinuteFormat).toLowerCase()
}

export const getCurrentRisksToThemselves = (riskToSelf: RiskToSelf) => {
  return getRisksToThemselves(riskToSelf, 'current')
}

export const getPreviousRisksToThemselves = (riskToSelf: RiskToSelf) => {
  const currentRisks = getCurrentRisksToThemselves(riskToSelf)
  const previousRisks = getRisksToThemselves(riskToSelf, 'previous')
  return previousRisks.filter(risk => !currentRisks.includes(risk))
}

export const getRisksToThemselves = (riskToSelf: RiskToSelf, type: string) => {
  const risksToThemselves: string[] = []
  if (riskToSelf === undefined) return risksToThemselves
  const typesOfRisk = [
    { key: 'suicide', text: 'suicide' },
    { key: 'selfHarm', text: 'self harm' },
    { key: 'custody', text: 'coping in custody' },
    { key: 'hostelSetting', text: 'coping in a hostel setting' },
    { key: 'vulnerability', text: 'a vulnerability' },
  ]

  typesOfRisk.forEach(risk => {
    if (riskToSelf?.[risk.key]?.[type]) {
      if (riskToSelf[risk.key][type] === 'YES') {
        risksToThemselves.push(risk.text)
      }
    }
  })
  return risksToThemselves
}

export const getTagClass = (score: RiskScore) => {
  switch (score) {
    case 'LOW':
      return 'govuk-tag--green'
    case 'MEDIUM':
      return 'govuk-tag--yellow'
    case 'HIGH':
      return 'govuk-tag--red'
    case 'VERY_HIGH':
      return 'govuk-tag--red'
    default:
      return 'govuk-tag--blue'
  }
}

export const addressToList = (address: Address): string[] => {
  const addressArray: string[] = []
  let buildingNumber = ''
  if (address?.officeName) {
    addressArray.push(address?.officeName)
  }
  if (address?.buildingName) {
    addressArray.push(address?.buildingName)
  }
  if (address?.buildingNumber) {
    buildingNumber = `${address?.buildingNumber} `
  }
  if (address?.streetName) {
    addressArray.push(`${buildingNumber}${address?.streetName}`)
  }
  if (address?.town) {
    addressArray.push(address?.town)
  }
  if (address?.district) {
    addressArray.push(address?.district)
  }
  if (address?.ldu) {
    addressArray.push(address?.ldu)
  }
  if (address?.county) {
    addressArray.push(address?.county)
  }
  if (address?.postcode) {
    addressArray.push(address?.postcode)
  }

  return addressArray
}

export const lastUpdatedDate = (datetime: string) => {
  return datetime ? `Last updated ${dateWithYearShortMonth(datetime)}` : ''
}

export const lastUpdatedBy = (datetime: string, name: Name) => {
  return datetime ? `Last updated by ${fullName(name)} on ${dateWithYearShortMonth(datetime)}` : ''
}

export const deliusDateFormat = (datetime: string) => {
  return DateTime.fromISO(datetime).toFormat('dd/MM/yyyy')
}

export const deliusDeepLinkUrl = (component: string, offenderId: string) => {
  if (!component || !offenderId) {
    return ''
  }
  return `${config.delius.link}/NDelius-war/delius/JSP/deeplink.xhtml?component=${component}&offenderId=${offenderId}`
}

export const tierLink = (crn: string) => {
  if (!crn) {
    return ''
  }
  return `${config.tier.link}/${crn}`
}

export const interventionsLink = (referralId: string) => {
  if (!referralId) {
    return ''
  }
  return `${config.interventions.link}/probation-practitioner/referrals/${referralId}/progress`
}

export const oaSysUrl = () => {
  return `${config.oaSys.link}`
}

export const deliusHomepageUrl = () => {
  return `${config.delius.link}`
}

export const sentencePlanLink = () => {
  return `${config.sentencePlan.link}`
}

export const isInThePast = (datetimeString: string) => {
  if (!datetimeString || isBlank(datetimeString)) return null
  return DateTime.now() > DateTime.fromISO(datetimeString)
}

export const isToday = (datetimeString: string) => {
  if (!datetimeString || isBlank(datetimeString)) return null
  return DateTime.fromISO(datetimeString).hasSame(DateTime.now(), 'day')
}

export const dayOfWeek = (datetimeString: string) => {
  if (!datetimeString || isBlank(datetimeString)) return null
  return DateTime.fromISO(datetimeString).toFormat('cccc')
}

export const sortAppointmentsDescending = (appointments: Activity[], limit?: number): Activity[] => {
  return [...appointments]
    .sort((a, b) => (a.startDateTime < b.startDateTime ? 1 : -1))
    .filter((_, index) => (limit && index < limit) || !limit)
}

export const scheduledAppointments = (appointments: Activity[]): Activity[] => {
  return (
    // Show future appointments and any appointments that are today
    appointments
      .filter(entry => !isInThePast(entry.startDateTime))
      .sort((a, b) => (a.startDateTime > b.startDateTime ? 1 : -1))
  )
}

export const pastAppointments = (appointments: Activity[]): Activity[] => {
  return (
    // Show future appointments and any appointments that are today
    appointments
      .filter(entry => isInThePast(entry.startDateTime))
      .sort((a, b) => (a.startDateTime > b.startDateTime ? 1 : -1))
  )
}

export const getAppointmentsToAction = (appointments: Activity[], type: string): Activity[] => {
  if (type === 'evidence') {
    return pastAppointments(appointments).filter(entry => entry.absentWaitingEvidence === true)
  }
  return pastAppointments(appointments).filter(
    entry =>
      entry.hasOutcome === false &&
      (entry.absentWaitingEvidence === false || entry.absentWaitingEvidence === undefined),
  )
}

export const toYesNo = (value: boolean) => {
  if (value == null) return 'Not known'
  if (!value) {
    return 'No'
  }
  return 'Yes'
}

export const getRisksWithScore = (risk: Partial<Record<RiskScore, string[]>>, score: RiskScore): string[] => {
  const risks: string[] = []
  if (risk[score]) {
    return risk[score]
  }
  return risks
}

export const filterEntriesByCategory = (category: string) => {
  return function filterActivity(activity: Activity) {
    const { isAppointment } = activity
    const isPastAppointment = isAppointment && isInThePast(activity.startDateTime)
    const { isNationalStandard } = activity
    const isRescheduled = activity.rescheduled && isNationalStandard
    const hasOutcome = activity.didTheyComply !== undefined || isRescheduled
    const { wasAbsent } = activity
    const acceptableAbsence = wasAbsent && activity.acceptableAbsence === true
    const unacceptableAbsence = wasAbsent && activity.acceptableAbsence === false
    const waitingForEvidence = activity.absentWaitingEvidence === true
    const complied = activity.didTheyComply === true
    const attendedDidNotComply = activity.didTheyComply === false

    switch (category) {
      case 'all-appointments':
        return isAppointment
      case 'other-communication':
        return !isAppointment
      case 'previous-appointments':
        return isPastAppointment
      case 'national-standard-appointments':
        return isPastAppointment && isNationalStandard
      case 'national-standard-appointments-without-outcome':
        return isPastAppointment && isNationalStandard && !hasOutcome
      case 'complied-appointments':
        return isPastAppointment && complied && isNationalStandard
      case 'acceptable-absence-appointments':
        return isPastAppointment && acceptableAbsence && isNationalStandard
      case 'unacceptable-absence-appointments':
        return isPastAppointment && unacceptableAbsence && isNationalStandard
      case 'waiting-for-evidence':
        return isPastAppointment && waitingForEvidence && isNationalStandard
      case 'attended-but-did-not-comply-appointments':
        return isPastAppointment && attendedDidNotComply && isNationalStandard
      case 'all-failure-to-comply-appointments':
        return isPastAppointment && (attendedDidNotComply || unacceptableAbsence) && isNationalStandard
      case 'upcoming-appointments':
        return isAppointment && !isPastAppointment
      case 'warning-letters':
        return activity.action != null
      case 'all-previous-activity':
        return isPastAppointment || !isAppointment
      case 'all-rescheduled':
        return isRescheduled
      case 'rescheduled-by-staff':
        return isRescheduled && activity.rescheduledStaff === true
      case 'rescheduled-by-person-on-probation':
        return isRescheduled && activity.rescheduledPop === true
      default:
        return true
    }
  }
}

export const activityLogDate = (datetimeString: string) => {
  if (!datetimeString || isBlank(datetimeString)) return null
  const date = DateTime.fromISO(datetimeString)
  if (date.hasSame(DateTime.local(), 'day')) {
    return 'Today'
  }
  if (date.hasSame(DateTime.local().minus({ days: 1 }), 'day')) {
    return 'Yesterday'
  }
  return date.toFormat('cccc d MMMM yyyy')
}

export const compactActivityLogDate = (datetimeString: string) => {
  if (!datetimeString || isBlank(datetimeString)) return null
  const date = DateTime.fromISO(datetimeString)
  if (date.hasSame(DateTime.local(), 'day')) {
    return 'Today'
  }

  if (date.hasSame(DateTime.local().minus({ days: 1 }), 'day')) {
    return 'Yesterday'
  }

  return date.toFormat('ccc d MMM yyyy')
}

export const removeEmpty = (array: never[]) => {
  return array.filter((value: NonNullable<unknown>) => Object.keys(value).length !== 0)
}

export const activityLog = (contacts: Activity[], category: string, requirement?: string) => {
  let ret = contacts
    .filter(filterEntriesByCategory(category))
    .sort((a, b) => (a.startDateTime < b.startDateTime ? 1 : -1))
  if (requirement) {
    ret = ret.filter(entry => entry.rarCategory && toSlug(entry.rarCategory) === toSlug(requirement))
  }
  return ret
}

export const timeFromTo = (from: string, to: string) => {
  const timeFrom = govukTime(from)
  const timeTo = govukTime(to)
  if (timeTo === null) {
    return timeFrom
  }
  return `${timeFrom} to ${timeTo}`
}

export const getComplianceStatus = (failureToComplyCount: number, breachStarted: boolean) => {
  const status: { text: string; panelClass: string } = {
    text: '',
    panelClass: '',
  }

  if (breachStarted) {
    status.text = 'Breach in progress'
    status.panelClass = 'app-compliance-panel--red'
  } else {
    switch (failureToComplyCount) {
      case 0:
        status.text = 'No failures to comply within 12 months'
        status.panelClass = 'app-compliance-panel--green'
        break
      case 1:
        status.text = '1 failure to comply within 12 months'
        status.panelClass = ''
        break
      default:
        status.text = `${failureToComplyCount} failures to comply within 12 months. No breach in progress yet.`
        status.panelClass = 'app-compliance-panel--red'
        break
    }
  }

  return status
}

export const getDistinctRequirements = (appointments: Activity[]): string[] => {
  const rqmts = appointments.flatMap(entry => (entry.rarCategory ? [entry.rarCategory] : []))
  return rqmts.filter((n, i) => rqmts.indexOf(n) === i)
}

export const toSlug = (string: string) => {
  return slugify(string, { lower: true })
}

export const setSortOrder = (columnName: string, sortBy: string) => {
  const colName = sortBy.split('.')[0]
  const sortOrder = sortBy.split('.')[1]
  if (colName === columnName) {
    if (sortOrder === 'desc') {
      return 'descending'
    }
    return 'ascending'
  }
  return 'none'
}
export const defaultFormInputValues = (
  object: HTMLInputElement,
  data: CaseSearchFilter,
  id: string,
): HTMLInputElement => {
  const obj = object
  if (data !== undefined) {
    obj.id = id
    obj.name = id
    obj.value = data[id]
  }
  return obj
}

export const defaultFormSelectValues = (object: SelectElement, data: CaseSearchFilter, id: string): SelectElement => {
  const obj = object
  if (data !== undefined) {
    obj.id = id
    obj.name = id

    obj.items.forEach(item => {
      if (item.value === data[id]) {
        // eslint-disable-next-line no-param-reassign
        item.selected = 'selected'
      }
    })
  }
  return obj
}

export const checkRecentlyViewedAccess = (
  recentlyViewed: RecentlyViewedCase[],
  userAccess: UserAccess,
): RecentlyViewedCase[] => {
  return recentlyViewed.map(rv => {
    const ua = userAccess?.access?.find(u => u.crn === rv.crn)
    return { ...rv, limitedAccess: ua?.userExcluded === true || ua?.userRestricted === true }
  })
}

export const makePageTitle = ({ pageHeading, hasErrors }: { pageHeading: string; hasErrors: boolean }) =>
  `${hasErrors ? 'Error: ' : ''}${pageHeading} - ${config.applicationName}`

export const getDataValue = (data: any, sections: any) => {
  const path = Array.isArray(sections) ? sections : [sections]
  return getKeypath(data, path.map((s: any) => `["${s}"]`).join(''))
}

export const setDataValue = (data: any, sections: any, value: any) => {
  const path = Array.isArray(sections) ? sections : [sections]
  return setKeypath(data, path.map((s: any) => `["${s}"]`).join(''), value)
}

export const decorateFormAttributes = (req: Request, res: Response) => (obj: any, sections?: string[]) => {
  const newObj = obj
  const { data } = req.session as any
  let storedValue = getDataValue(data, sections)
  if (storedValue && config.dateFields.includes(sections[sections.length - 1]) && storedValue.includes('-')) {
    const [year, month, day] = storedValue.split('-')
    storedValue = [day.padStart(2, '0'), month.padStart(2, '0'), year].join('/')
  }
  if (newObj.items !== undefined) {
    newObj.items = newObj.items.map((item: Item) => {
      if (typeof item.value === 'undefined') {
        item.value = item.text
      }
      if (storedValue) {
        if ((Array.isArray(storedValue) && storedValue.includes(item.value)) || storedValue === item.value) {
          if (storedValue.indexOf(item.value) !== -1) {
            item.checked = 'checked'
            item.selected = 'selected'
          }
        }
      }
      return item
    })
    if (sections?.length) {
      newObj.idPrefix = sections.join('-')
    }
  } else {
    newObj.value = storedValue
  }
  if (sections?.length) {
    const id = sections.join('-')
    if (typeof newObj.id === 'undefined') {
      newObj.id = id
    }
    newObj.name = sections.map((s: string) => `[${s}]`).join('')
    if (res?.locals?.errors?.errorMessages?.[id]?.text) {
      newObj.errorMessage = { text: res.locals.errors.errorMessages[id].text }
    }
  }
  return newObj
}
