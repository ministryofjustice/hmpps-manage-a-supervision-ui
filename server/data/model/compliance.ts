import { PersonSummary } from './common'
import { Offence, Order, PreviousOrders, Rar } from './overview'
import { PersonActivity } from './activityLog'

export interface PersonCompliance {
  personSummary: PersonSummary
  previousOrders: PreviousOrders
  currentSentences: Compliance[]
}

export interface Compliance {
  breachStarted: boolean
  breachesOnCurrentOrderCount: boolean
  failureToComplyCount: boolean
  unacceptableAbsenceCount: boolean
  attendedButDidNotComplyCount: boolean
  outcomeNotRecordedCount: boolean
  waitingForEvidenceCount: boolean
  rescheduledCount: boolean
  absentCount: boolean
  rescheduledByStaffCount: boolean
  rescheduledByPersonOnProbationCount: boolean
  lettersCount: boolean
  nationalStandardAppointmentsCount: boolean
  compliedAppointmentsCount: boolean
  mainOffence: Offence
  order: Order
  activeBreach?: Breach
  rar?: Rar
  activities: PersonActivity[]
}

export interface Breach {
  startDate: string
  status: string
}
