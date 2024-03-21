// eslint-disable-next-line import/no-cycle
import { Sentence } from './overview'

export interface SentenceDetails {
  crn: string
  sentences: Sentence[]
}

export interface Sentence {
  offence: OffenceDetails
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
