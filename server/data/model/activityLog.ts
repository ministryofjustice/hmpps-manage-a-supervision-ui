import { Activity } from './overview'
import { PersonSummary } from './common'

export interface PersonActivity {
  personSummary: PersonSummary
  activities: Activity[]
}
