import { UserLocations } from '../data/model/caseload'
import { PersonalDetails } from '../data/model/personalDetails'
import { Sentence } from '../data/model/sentenceDetails'
import { Errors } from './Errors.type'

interface Appointment {
  type?: string
  location?: string
  date?: string
  'start-time'?: string
  'end-time'?: string
}

export interface Data {
  appointments?: {
    [crn: string]: {
      [id: string]: Appointment
    }
  }
  sentences?: {
    [crn: string]: Sentence[]
  }
  personalDetails?: {
    [crn: string]: PersonalDetails
  }
  errors?: Errors
  locations?: {
    [userId: string]: UserLocations
  }
}
