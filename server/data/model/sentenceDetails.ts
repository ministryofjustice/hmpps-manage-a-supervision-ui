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
  mainOffence: string
  offenceDate: string
  notes: string
  additionalOffences: []
}

export interface Conviction {
  sentencingCourt: string
  responsibleCourt: string
  convictionDate: string
  additionalSentences: string
}
