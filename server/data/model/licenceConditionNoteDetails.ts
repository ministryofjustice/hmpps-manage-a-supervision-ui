import { PersonSummary } from './common'

export interface LicenceConditionNoteDetails {
  personSummary: PersonSummary
  licenceConditionNote: LicenceConditionNote
}

export interface LicenceConditionNote {
  id: string
  createdBy: string
  createdByDate: string
  note: string
  hasNotesBeenTruncated: boolean
}
