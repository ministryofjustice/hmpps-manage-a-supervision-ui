import { Name, PersonSummary } from './common'
import { Document, Address } from './personalDetails'

export interface Schedule {
  personSummary: PersonSummary
  appointments: Appointment[]
}

export interface Appointment {
  id?: string
  type?: string
  startDateTime?: string
  endDateTime?: string
  rarToolKit?: string
  notes?: string
  isSensitive?: boolean
  hasOutcome?: boolean
  wasAbsent?: boolean
  officerName?: Name
  isInitial?: boolean
  isNationalStandard?: boolean
  rescheduled?: boolean
  didTheyComply?: boolean
  absentWaitingEvidence?: boolean
  rearrangeOrCancelReason?: string
  rescheduledBy?: Name
  repeating?: boolean
  nonComplianceReason?: string
  documents?: Document[]
  rarCategory?: string
  acceptableAbsence?: boolean
  acceptableAbsenceReason?: string
  location?: Address
  lastUpdated?: string
  lastUpdatedBy?: Name
}

export interface PersonAppointment {
  personSummary: PersonSummary
  appointment: Appointment
}
