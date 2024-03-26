// eslint-disable-next-line import/no-cycle

export interface SentenceDetails {
  crn: string
  sentences: Sentence[]
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
