import { PersonSummary } from './common'

export interface LicenceConditionNoteDetails {
  personSummary: PersonSummary
  licenceCondition: LicenceCondition
}

export interface LicenceCondition {
  mainDescription: string
  subTypeDescription: string
  imposedReleasedDate: string
  actualStartDate: string
  licenceNote: LicenceConditionNote
}

export interface LicenceConditionNote {
  id: string
  createdBy: string
  createdByDate: string
  note: string
  hasNotesBeenTruncated: boolean
}
