import { DateTime } from 'luxon'

import {
  activityLog,
  activityLogDate,
  checkRecentlyViewedAccess,
  compactActivityLogDate,
  convertToTitleCase,
  dateForSort,
  dateWithDayAndWithoutYear,
  dateWithYear,
  dateWithYearShortMonth,
  dayOfWeek,
  deliusDeepLinkUrl,
  deliusHomepageUrl,
  fullName,
  getAppointmentsToAction,
  getComplianceStatus,
  getRisksToThemselves,
  getRisksWithScore,
  getTagClass,
  govukTime,
  initialiseName,
  isInThePast,
  isToday,
  monthsOrDaysElapsed,
  oaSysUrl,
  pastAppointments,
  removeEmpty,
  scheduledAppointments,
  sortAppointmentsDescending,
  tierLink,
  timeForSort,
  timeFromTo,
  toYesNo,
  yearsSince,
} from './utils'
import { RiskResponse, RiskScore, RiskToSelf } from '../data/arnsApiClient'
import { Name } from '../data/model/common'
import { Activity } from '../data/model/schedule'
import { RecentlyViewedCase, UserAccess } from '../data/model/caseAccess'

const appointments = [
  {
    startDateTime: DateTime.now().plus({ days: 4 }).toString(),
  },
  {
    startDateTime: DateTime.now().plus({ days: 3 }).toString(),
  },
  {
    startDateTime: DateTime.now().plus({ days: 2 }).toString(),
  },
  {
    startDateTime: DateTime.now().minus({ days: 1 }).toString(),
    isNationalStandard: true,
    isAppointment: true,
    hasOutcome: true,
  },
  {
    startDateTime: DateTime.now().minus({ days: 2 }).toString(),
    isNationalStandard: true,
    absentWaitingEvidence: true,
    isAppointment: true,
  },
  {
    startDateTime: DateTime.now().minus({ days: 3 }).toString(),
    hasOutcome: false,
  },
  {
    startDateTime: DateTime.now().minus({ days: 4 }).toString(),
    hasOutcome: true,
  },
]
describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    ['Null', null, ''],
    ['Not defined', undefined, ''],
    ['Name', { forename: 'Joe', surname: 'Bloggs' }, 'Joe Bloggs'],
  ])('%s fullName(%s, %s)', (_: string, a: Name, expected: string) => {
    expect(fullName(a)).toEqual(expected)
  })
})

describe('date with year', () => {
  it.each([
    [null, null, ''],
    ['Empty string', '', ''],
    ['Date string ', '2023-05-25T09:08:34.123', '25 May 2023'],
  ])('%s dateWithYear(%s, %s)', (_: string, a: string, expected: string) => {
    expect(dateWithYear(a)).toEqual(expected)
  })
})

describe('date with day and withoutYear', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['Date string ', '2023-05-25T09:08:34.123', 'Thursday 25 May'],
  ])('%s dateWithDayAndWithoutYear(%s, %s)', (_: string, a: string, expected: string) => {
    expect(dateWithDayAndWithoutYear(a)).toEqual(expected)
  })
})

describe('years since', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['Date string ', '1998-05-25T09:08:34.123', yearsSince('1998-05-25T09:08:34.123')],
  ])('%s yearsSince(%s, %s)', (_: string, a: string, expected: string) => {
    expect(yearsSince(a)).toEqual(expected)
  })
})

describe('months or days elapsed since', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['Months elapsed ', DateTime.now().minus({ months: 309 }), '309 months'],
    ['Days elapsed ', DateTime.now().minus({ days: 5 }), '5 days'],
  ])('%s monthsOrDaysElapsed(%s, %s)', (_: string, a: string, expected: string) => {
    expect(monthsOrDaysElapsed(a)).toEqual(expected)
  })
})

describe('govuk Time', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['Date String ', '2024-05-25T09:08:34.123', '9:08am'],
  ])('%s govukTime(%s, %s)', (_: string, a: string, expected: string) => {
    expect(govukTime(a)).toEqual(expected)
  })
})

describe('date with year short month', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['Date String ', '2024-08-25T09:08:34.123', '25 Aug 2024'],
  ])('%s dateWithYearShortMonth(%s, %s)', (_: string, a: string, expected: string) => {
    expect(dateWithYearShortMonth(a)).toEqual(expected)
  })
})

describe('get risks to themselves', () => {
  const YES: RiskResponse = 'YES'
  const NO: RiskResponse = 'NO'
  const DK: RiskResponse = 'DK'
  const riskOfSelfHarm1 = {
    suicide: {
      risk: YES,
      previous: YES,
      current: YES,
      currentConcernsText: 'Meaningful content for AssSumm Testing - R8.1.1',
    },
  }
  const riskOfSelfHarm2 = {
    suicide: {
      risk: YES,
      previous: YES,
      current: YES,
      currentConcernsText: 'Meaningful content for AssSumm Testing - R8.1.1',
    },
    selfHarm: {
      risk: YES,
      previous: YES,
      current: YES,
      currentConcernsText: 'Meaningful content for AssSumm Testing - R8.1.1',
    },
    custody: {
      risk: YES,
      previous: YES,
      current: YES,
      currentConcernsText: 'Meaningful content for AssSumm Testing - R8.1.1',
    },
    hostelSetting: {
      risk: YES,
      previous: YES,
      current: DK,
      currentConcernsText: 'Meaningful content for AssSumm Testing - R8.1.1',
    },
    vulnerability: {
      risk: YES,
      previous: YES,
      current: NO,
      currentConcernsText: 'Meaningful content for AssSumm Testing - R8.1.1',
    },
  }

  it.each([
    [null, null, null, []],
    ['Valid Risk to Self no type', riskOfSelfHarm1, null, []],
    ['Valid Risk to Self with type', riskOfSelfHarm2, 'current', ['suicide', 'self harm', 'coping in custody']],
  ])('%s getRisksToThemselves %s %s %s', (_: string, a: RiskToSelf, b: string, expected: string[]) => {
    expect(getRisksToThemselves(a, b)).toEqual(expected)
  })
})

describe('get tag class', () => {
  const HIGH: RiskScore = 'HIGH'
  const LOW: RiskScore = 'LOW'
  const MEDIUM: RiskScore = 'MEDIUM'
  const VERY_HIGH: RiskScore = 'VERY_HIGH'
  it.each([
    [null, null, 'govuk-tag--blue'],
    ['Low', LOW, 'govuk-tag--green'],
    ['Medium', MEDIUM, 'govuk-tag--yellow'],
    ['High', HIGH, 'govuk-tag--red'],
    ['Very High', VERY_HIGH, 'govuk-tag--red'],
  ])('%s getTagClass(%s, %s)', (_: string, a: RiskScore, expected: string) => {
    expect(getTagClass(a)).toEqual(expected)
  })
})

describe('get delius deep link', () => {
  it.each([
    ['null', null, null, ''],
    [
      'present',
      'ContactList',
      '1234',
      'https://ndelius-dummy-url/NDelius-war/delius/JSP/deeplink.xhtml?component=ContactList&CRN=1234',
    ],
  ])('%s deliusDeepLinkUrl(%s, %s)', (_: string, a: string, b: string, expected: string) => {
    expect(deliusDeepLinkUrl(a, b)).toEqual(expected)
  })
})

describe('get delius homepage link', () => {
  it.each([['Get link', 'https://ndelius-dummy-url']])(
    '%s deliusDeepLinkUrl(%s, %s)',
    (_: string, expected: string) => {
      expect(deliusHomepageUrl()).toEqual(expected)
    },
  )
})

describe('get oaSys homepage link', () => {
  it.each([['Get link', 'https://oasys-dummy-url']])('%s oaSysUrl()', (_: string, expected: string) => {
    expect(oaSysUrl()).toEqual(expected)
  })
})

describe('is in the past', () => {
  it.each([
    ['Null', null, null],
    ['False', DateTime.now().plus({ days: 1 }).toString(), false],
    ['True', DateTime.now().minus({ days: 1 }).toString(), true],
  ])('%s isInThePast(%s, %s)', (_: string, a: string, expected: boolean) => {
    expect(isInThePast(a)).toEqual(expected)
  })
})

describe('is today', () => {
  it.each([
    ['Null', null, null],
    ['False', DateTime.now().plus({ days: 1 }).toString(), false],
    ['True', DateTime.now().toString(), true],
  ])('%s isToday(%s, %s)', (_: string, a: string, expected: boolean) => {
    expect(isToday(a)).toEqual(expected)
  })
})

describe('gets day of week', () => {
  it.each([
    ['Null', null, null],
    ['gets day', DateTime.fromSQL('2020-09-10').toString(), 'Thursday'],
  ])('%s dayOfWeek(%s, %s)', (_: string, a: string, expected: string) => {
    expect(dayOfWeek(a)).toEqual(expected)
  })
})

describe('boolean to yes or no', () => {
  it.each([
    ['Not known', null, 'Not known'],
    ['Yes', true, 'Yes'],
    ['No', false, 'No'],
  ])('%s toYesNo(%s, %s)', (_: string, a: boolean, expected: string) => {
    expect(toYesNo(a)).toEqual(expected)
  })
})

describe('scheduled appointments', () => {
  it.each([['Filters correctly', appointments]])('%s scheduledAppointments(%s, %s)', (_: string, a: Activity[]) => {
    expect(scheduledAppointments(a)[0]).toEqual(appointments[2])
  })
})

describe('past appointments', () => {
  it.each([['Filters correctly', appointments]])('%s pastAppointments(%s, %s)', (_: string, a: Activity[]) => {
    expect(pastAppointments(a)[0]).toEqual(appointments[6])
  })
})

describe('appointments to action', () => {
  it.each([
    ['Filters absent awating evidence', appointments, 'evidence', appointments[4]],
    ['Filters no outcome', appointments, 'outcome', appointments[5]],
  ])('%s getAppointmentsToAction(%s, %s)', (_: string, a: Activity[], b: string, appointment: Activity) => {
    expect(getAppointmentsToAction(a, b)[0]).toEqual(appointment)
  })
})

describe('compact Activity log date', () => {
  it.each([
    ['Null', null, null],
    ['gets day', '2024-05-25T09:08:34.123', 'Sat 25 May 2024'],
  ])('%s compactActivityLogDate(%s, %s)', (_: string, a: string, expected: string) => {
    expect(compactActivityLogDate(a)).toEqual(expected)
  })
})

describe('Activity log date', () => {
  it.each([
    ['Null', null, null],
    ['gets day', '2024-05-25T09:08:34.123', 'Saturday 25 May 2024'],
  ])('%s activityLogDate(%s, %s)', (_: string, a: string, expected: string) => {
    expect(activityLogDate(a)).toEqual(expected)
  })
})

describe('filters activity log', () => {
  it.each([
    ['Filters absent awaiting evidence', appointments, 'waiting-for-evidence', appointments[4]],
    ['Filters no outcome', appointments, 'national-standard-appointments-without-outcome', appointments[3]],
  ])('%s activityLog(%s, %s)', (_: string, a: Activity[], b: string, appointment: Activity) => {
    expect(activityLog(a, b)[0]).toEqual(appointment)
  })
})

describe('removes empty array', () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const arr: never[] = [{ value: 'a value' }, {}]
  it.each([['Filters empty object', arr, 1]])('%s removeEmpty(%s, %s)', (_: string, a: never[], size: number) => {
    expect(removeEmpty(a).length).toEqual(size)
  })
})

describe('gets risks with score', () => {
  const array: string[] = ['Children', 'Staff']
  const risk: Partial<Record<RiskScore, string[]>> = { VERY_HIGH: array }
  it.each([['Filters empty object', risk, 'VERY_HIGH', array]])(
    '%s getRisksWithScore(%s, %s)',
    (_: string, a: Partial<Record<RiskScore, string[]>>, b: RiskScore, expected: string[]) => {
      expect(getRisksWithScore(a, b)).toEqual(expected)
    },
  )
})

describe('renders time from and to', () => {
  it.each([
    ['Time from to', '2024-05-25T09:08:34.123', '2024-05-25T10:08:34.123', '9:08am to 10:08am'],
    ['Time from only', '2024-05-25T09:08:34.123', null, '9:08am'],
    ['Time to undefined', '2024-05-25T09:08:34.123', undefined, '9:08am'],
    ['Time to blank', '2024-05-25T09:08:34.123', '', '9:08am'],
  ])('%s timeFromTo(%s, %s)', (_: string, a: string, b: string, expected: string) => {
    expect(timeFromTo(a, b)).toEqual(expected)
  })
})

describe('Gets compliance status', () => {
  it.each([
    ['Returns breach in progress', 2, true, { text: 'Breach in progress', panelClass: 'app-compliance-panel--red' }],
    [
      'Returns failure to comply',
      2,
      false,
      {
        text: '2 failures to comply within 12 months. No breach in progress yet.',
        panelClass: 'app-compliance-panel--red',
      },
    ],
  ])('%s timeFromTo(%s, %s)', (_: string, a: number, b: boolean, expected: { text: string; panelClass: string }) => {
    expect(getComplianceStatus(a, b)).toEqual(expected)
  })
})

describe('get past Appointments', () => {
  it.each([['Filters correctly', appointments]])('%s pastAppointments(%s, %s)', (_: string, a: Activity[]) => {
    expect(pastAppointments(a)[0]).toEqual(appointments[6])
  })
})

describe('tier link', () => {
  it.each([
    ['Returns empty', null, ''],
    ['Returns link', 'X000001', 'https://tier-dummy-url/X000001'],
  ])('%s tierLink(%s, %s)', (_: string, a: string, expected: string) => {
    expect(tierLink(a)).toEqual(expected)
  })
})

describe('Sort appointments descending', () => {
  it.each([
    ['sorts and limits correctly', appointments, 3, 3],
    ['sorts and does not limit', appointments, undefined, 7],
  ])('%s sortAppointmentsDescending(%s, %s)', (_: string, a: Activity[], limit: number, expectedSize: number) => {
    const result = sortAppointmentsDescending(a, limit)
    expect(result[0]).toEqual(appointments[0])
    expect(result.length).toEqual(expectedSize)
  })
})

describe('convert date to sortable number', () => {
  it.each([
    ['converts correctly', DateTime.fromSQL('2020-09-10', { zone: 'utc' }).toString(), 1599696000000],
    ['returns null', undefined, null],
  ])('%s dateForSort(%s)', (_: string, a: string, expected: number) => {
    expect(dateForSort(a)).toEqual(expected)
  })
})

describe('convert time to sortable number', () => {
  it.each([
    ['converts correctly', DateTime.fromSQL('2017-05-15 09:24:15').toString(), 924],
    ['converts correctly', DateTime.fromSQL('2017-05-15 19:24:15').toString(), 1924],
    ['returns null', undefined, null],
  ])('%s timeForSort(%s)', (_: string, a: string, expected: number) => {
    expect(timeForSort(a)).toEqual(expected)
  })
})

describe('update lao access in local storage', () => {
  it.each([
    [
      'sets limited access to true for exclusion',
      [{ crn: 'X123456' }],
      { access: [{ crn: 'X123456', userExcluded: true }] },
      true,
    ],
    [
      'sets limited access to true for restriction',
      [{ crn: 'X123456' }],
      { access: [{ crn: 'X123456', userRestricted: true }] },
      true,
    ],
    [
      'sets limited access to false for false restriction',
      [{ crn: 'X123456' }],
      { access: [{ crn: 'X123456', userRestricted: false }] },
      false,
    ],
    [
      'sets limited access to false for false exclusion',
      [{ crn: 'X123456' }],
      { access: [{ crn: 'X123456', userExcluded: false }] },
      false,
    ],
    [
      'sets limited access to false for no restriction or exclusion',
      [{ crn: 'X123456' }],
      { access: [{ crn: 'X123456' }] },
      false,
    ],
  ])('%s checkRecentlyViewedAccess(%s, %s)', (_: string, a: RecentlyViewedCase[], b: UserAccess, expected: boolean) => {
    const result = checkRecentlyViewedAccess(a, b)
    expect(result[0].limitedAccess).toEqual(expected)
  })
})
