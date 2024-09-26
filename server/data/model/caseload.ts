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

export interface UserTeam {
  provider: string
  teams: Team[]
}

export interface ErrorMessages {
  [key: string]: { text: string }
}
