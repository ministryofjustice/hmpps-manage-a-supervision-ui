import { Name } from './common'
import { Appointment } from './overview'

export interface UserCaseload {
  totalPages: number
  totalElements: number
  pageSize: number
  provider: string
  staff: Name
  caseload: Caseload[]
}
export interface TeamCaseload {
  totalPages: number
  totalElements: number
  pageSize: number
  provider: string
  team: Team
  caseload: Caseload[]
}
export interface Caseload {
  caseName: Name
  crn: string
  dob?: string
  nextAppointment?: Appointment
  previousAppointment?: Appointment
  latestSentence?: string
}

export interface CaseloadResponse {
  caseName: Name
  crn: string
}

export interface Team {
  description: string
  code: string
}

export interface Location {
  id: number
  name: string
}

export interface UserLocation {
  id: number
  description: string
  address: {
    buildingNumber?: string
    streetName: string
    town?: string
    county?: string
    postcode?: string
  }
}

export interface UserTeam {
  provider: string
  teams: Team[]
}

export interface UserLocations {
  name: {
    forename: string
    middleName: string
    surname: string
  }
  locations: Location[]
}

export interface CaseSearchFilter {
  [key: string]: string | undefined
  nameOrCrn?: string
  sentenceCode?: string
  nextContactCode?: string
}

export interface SelectElement {
  id?: string
  name?: string
  items?: SelectItem[]
}

export interface SelectItem {
  text?: string
  value?: string
  selected?: string
}

export interface ErrorMessages {
  [key: string]: { text: string }
}
