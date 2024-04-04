import { Name, PersonSummary } from './common'

export interface PersonRiskFlags {
  personSummary: PersonSummary
  riskFlags: RiskFlag[]
  removedRiskFlags: RiskFlag[]
}

export interface PersonRiskFlag {
  personSummary: PersonSummary
  riskFlag: RiskFlag
}

export interface RemovalHistory {
  notes?: string
  removalDate: string
  removedBy: Name
}

export interface RiskFlag {
  id: number
  description: string
  notes?: string
  nextReviewDate?: string
  mostRecentReviewDate?: string
  createdDate: string
  createdBy: Name
  removed: boolean
  removalHistory: RemovalHistory[]
}
