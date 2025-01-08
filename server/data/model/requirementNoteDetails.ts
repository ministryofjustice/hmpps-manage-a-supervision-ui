import { PersonSummary } from './common'

export interface RequirementNoteDetails {
  personSummary: PersonSummary
  requirement: Requirement
}

export interface Requirement {
  code: string
  expectedStartDate?: string
  actualStartDate: string
  expectedEndDate?: string
  actualEndDate?: string
  terminationReason?: string
  description: string
  length: number
  lengthUnitValue: string
  requirementNote: RequirementNote
  rar?: {
    completed: number
    scheduled: number
    totalDays: number
  }
}

export interface RequirementNote {
  id: string
  createdBy: string
  createdByDate: string
  note: string
  hasNotesBeenTruncated: boolean
}
