// eslint-disable-next-line import/no-cycle

import { PersonSummary } from './common'

export interface SentenceDetails {
  personSummary: PersonSummary
  sentences: Sentence[]
  probationHistory: ProbationHistory
}

export interface Sentence {
  offenceDetails: OffenceDetails
  conviction: Conviction
  order: Order
  requirements: Requirement[]
  courtDocuments: CourtDocument[]
  unpaidWorkProgress: string
  licenceConditions: LicenceCondition[]
}
export interface OffenceDetails {
  mainOffence: Offence
  offenceDate: string
  notes: string
  additionalOffences: Offence[]
}

export interface Conviction {
  sentencingCourt: string
  responsibleCourt: string
  convictionDate: string
  additionalSentences: string
}

export interface Offence {
  code: string
  description: string
}

export interface Order {
  description: string
  length: string
  startDate: string
}

export interface Requirement {
  code: string
  expectedStartDate: string
  actualStartDate: string
  expectedEndDate: string
  actualEndDate: string
  terminationReason: string
  description: string
  codeDescription: string
  length: string
  notes: string
  rar: Rar
}

export interface Rar {
  completed: string
  scheduled: string
  totalDays: string
}

export interface CourtDocument {
  id: string
  lastSaved: string
  documentName: string
}

export interface LicenceCondition {
  mainDescription: string
  subTypeDescription: string
  imposedReleasedDate: string
  actualStartDate: string
  notes: string
  hasNotesBeenTruncated: boolean
}

export interface ProbationHistory {
  numberOfTerminatedEvents: number
  dateOfMostRecentTerminatedEvent: string
  numberOfTerminatedEventBreaches: number
  numberOfProfessionalContacts: number
}
