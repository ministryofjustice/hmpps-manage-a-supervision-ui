import { Name } from './common'

export interface UserCaseload {
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
