// eslint-disable-next-line import/no-cycle

import { Name } from './common'

export interface OffenceDetails {
  name: Name
  mainOffence: Offence
  mainOffenceNotes: string
  additionalOffences: Offence[]
}

export interface Offence {
  description: string
  category: string
  code: string
  dateOfOffence: string
}
