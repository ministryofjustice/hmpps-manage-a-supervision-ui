// eslint-disable-next-line import/no-cycle

import { PersonSummary } from './common'

export interface SentenceDetails {
  personSummary: PersonSummary
  sentences: Sentence[]
  order: Order
  requirements: Requirement[]
  courtDocuments: CourtDocument[]
  probationHistory: ProbationHistory
}

export interface Sentence {
  eventNumber: string
  offence: OffenceDetails
  conviction: Conviction
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

export interface ProbationHistory {
  numberOfTerminatedEvents: number
  dateOfMostRecentTerminatedEvent: string
  numberOfTerminatedEventBreaches: number
  numberOfProfessionalContacts: number
}
