// eslint-disable-next-line import/no-extraneous-dependencies
import { DateTime } from 'luxon'
import { RiskScore, RiskToSelf } from '../data/arnsApiClient'
import { Name } from '../data/model/common'
import { Address } from '../data/model/personalDetails'
import config from '../config'

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
  if (!datetimeString || isBlank(datetimeString)) return null
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

export const deliusHomepageUrl = () => {
  return `${config.delius.link}`
}
