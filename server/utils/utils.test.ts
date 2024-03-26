// eslint-disable-next-line import/no-extraneous-dependencies
import { DateTime } from 'luxon'

import {
  convertToTitleCase,
  dateWithDayAndWithoutYear,
  dateWithYear,
  dateWithYearShortMonth,
  dayOfWeek,
  deliusDeepLinkUrl,
  deliusHomepageUrl,
  fullName,
  getAppointmentsToAction,
  getRisksToThemselves,
  getTagClass,
  govukTime,
  initialiseName,
  isInThePast,
  isToday,
  monthsOrDaysElapsed,
  pastAppointments,
  scheduledAppointments,
  toYesNo,
  yearsSince,
} from './utils'
import { RiskResponse, RiskScore, RiskToSelf } from '../data/arnsApiClient'
import { Name } from '../data/model/common'
import { Activity } from '../data/model/schedule'

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
    hasOutcome: true,
  },
  {
    startDateTime: DateTime.now().minus({ days: 2 }).toString(),
    absentWaitingEvidence: true,
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
    [null, null, null],
    ['Empty string', '', null],
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
    ['Date string ', '1998-05-25T09:08:34.123', '25'],
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
      'https://ndelius-dummy-url/NDelius-war/delius/JSP/deeplink.xhtml?component=ContactList&offenderId=1234',
    ],
  ])('%s deliusDeepLinkUrl(%s, %s)', (_: string, a: string, b: string, expected: string) => {
    expect(deliusDeepLinkUrl(a, b)).toEqual(expected)
  })
})

describe('get deliuus homepage link', () => {
  it.each([['Get link', 'https://ndelius-dummy-url']])(
    '%s deliusDeepLinkUrl(%s, %s)',
    (_: string, expected: string) => {
      expect(deliusHomepageUrl()).toEqual(expected)
    },
  )
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
