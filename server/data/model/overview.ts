import { Name, PersonalCircumstance } from './common'

export interface Overview {
  appointmentsWithoutOutcome: number
  absencesWithoutEvidence: number
  activity?: Activity
  compliance?: Compliance
  personalDetails: PersonalDetails
  previousOrders: PreviousOrders
  schedule: Schedule
  sentences: Sentence[]
  registrations: string[]
}

export interface Offence {
  code: string
  description: string
}

export interface Sentence {
  additionalOffences: Offence[]
  mainOffence: Offence
  order?: Order
  rar?: Rar
}

export interface Rar {
  completed: number
  scheduled: number
  totalDays: number
}

export interface Order {
  status?: string
  mainOffence?: string
  description: string
  endDate?: string
  startDate: string
  breaches?: number
}

export interface PreviousOrders {
  breaches: number
  count: number
  orders?: Order[]
}

export interface Schedule {
  nextAppointment?: NextAppointment
}

export interface NextAppointment {
  date: string
  description: string
}

export interface PersonalDetails {
  name: Name
  preferredGender: string
  preferredName?: string
  telephoneNumber?: string
  mobileNumber?: string
  disabilities: Disability[]
  provisions: Provision[]
  personalCircumstances: PersonalCircumstance[]
  dateOfBirth: string
}
export interface Disability {
  description: string
}

export interface Provision {
  description: string
}

export interface Activity {
  acceptableAbsences: number
  complied: number
  nationalStandardsAppointments: number
  rescheduled: number
}

export interface Compliance {
  currentBreaches: number
  failureToComplyInLast12Months: number
}
