import { PersonSummary } from './common'
import { ActivityCount, Compliance, Offence, Order, PreviousOrders, Rar } from './overview'

export interface PersonCompliance {
  personSummary: PersonSummary
  previousOrders: PreviousOrders
  currentSentences: SentenceCompliance[]
}

export interface SentenceCompliance {
  activity: ActivityCount
  compliance: Compliance
  mainOffence: Offence
  order: Order
  activeBreach?: Breach
  rar?: Rar
}

export interface Breach {
  startDate: string
  status: string
}
