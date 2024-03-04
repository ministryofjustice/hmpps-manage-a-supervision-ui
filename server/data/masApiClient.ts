import config from '../config'
import RestClient from './restClient'

export default class MasApiClient extends RestClient {
  constructor(token: string) {
    super('Manage a Supervision API', config.apis.masApi, token)
  }

  async getOverview(crn: string): Promise<Overview | null> {
    return this.get({ path: `/overview/${crn}`, handle404: true })
  }
}

export interface Overview {
  activity?: Activity
  compliance?: Compliance
  personalDetails: PersonalDetails
  previousOrders: PreviousOrders
  schedule: Schedule
  sentences: Sentence[]
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
  description: string
  endDate?: string
  startDate: string
}

export interface PreviousOrders {
  breaches: number
  count: number
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

export interface PersonalCircumstance {
  subType: string
  type: string
}

export interface Name {
  forename: string
  middleName?: string
  surname: string
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
