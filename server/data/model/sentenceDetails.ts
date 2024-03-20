// eslint-disable-next-line import/no-cycle
import { Name } from './common'

export interface SentenceDetails {
  crn: string
}

export interface Offence {
  mainOffence: string
  offenceDate: string
  notes: string
  additionalOffences: string
}

export interface Conviction {
  sentencingCourt: string
  responsibleCourt: string
  convictionDate: string
  additionalSentences: string
}
