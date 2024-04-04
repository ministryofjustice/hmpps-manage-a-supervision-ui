// eslint-disable-next-line import/no-cycle

export interface SentenceDetails {
  crn: string
  sentences: Sentence[]
  order: Order
  requirements: Requirement[]
  courtDocuments: CourtDocument[]
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
  description: string
  codeDescription: string
  length: string
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
