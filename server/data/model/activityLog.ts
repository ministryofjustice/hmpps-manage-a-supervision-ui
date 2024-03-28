import { PersonSummary } from './common'
import { Activity } from './schedule'

export interface PersonActivity {
  personSummary: PersonSummary
  activities: Activity[]
}
