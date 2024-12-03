import { UserLocations } from '../data/model/caseload'
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
    [key: string]: Appointment
  }
  errors?: Errors
  locations?: {
    [userId: string]: UserLocations
  }
}
