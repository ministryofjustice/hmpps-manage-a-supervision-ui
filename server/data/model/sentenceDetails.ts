// eslint-disable-next-line import/no-cycle
import { Name } from './common'
import { Sentence } from './overview'

export interface SentenceDetails {
  crn: string
  sentences: Sentence[]
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
