import { Name, PersonSummary } from './common'

export interface TimelineItem {
  date: string
  scores: Scores
}

export interface Scores {
  RSR: Score
  OSPC: Score
  OSPI: Score
  OGRS: ScoreTwoYears
  OVP: ScoreTwoYears
  OGP: ScoreTwoYears
}

export interface Score {
  type: string
  level: string
  score: number
}

export interface ScoreTwoYears {
  type: string
  level: string
  oneYear: number
  twoYears: number
}

export interface RsrPredictorDto {
  rsrPercentageScore?: number
  rsrScoreLevel?: ScoreLevelEnum
  ospcPercentageScore?: number
  ospcScoreLevel?: ScoreLevelEnum
  ospiPercentageScore?: number
  ospiScoreLevel?: ScoreLevelEnum
  ospiiPercentageScore?: number
  ospdcPercentageScore?: number
  ospiiScoreLevel?: ScoreLevelEnum
  ospdcScoreLevel?: ScoreLevelEnum
  calculatedDate?: string
  completedDate?: string
  signedDate?: string
  staticOrDynamic?: StaticOrDynamicEnum
  source: SourceEnum
  status: StatusEnum
  algorithmVersion?: string
}

export interface RoshRiskWidgetDto {
  overallRisk?: string
  assessedOn?: string
  riskInCommunity: { [key: string]: string }
  riskInCustody: { [key: string]: string }
}

export interface RiskScoresDto {
  completedDate?: string
  assessmentStatus?: string
  groupReconvictionScore?: OgrScoreDto
  violencePredictorScore?: OvpScoreDto
  generalPredictorScore?: OgpScoreDto
  riskOfSeriousRecidivismScore?: RsrScoreDto
  sexualPredictorScore?: OspScoreDto
}

export interface Mappa {
  level?: number
  category?: number
  categoryDescription?: string
  startDate?: string
  reviewDate?: string
}

export interface Opd {
  eligible?: boolean
  date?: string
}

export interface OgrScoreDto {
  oneYear?: number
  twoYears?: number
  scoreLevel?: ScoreLevelEnum
}

export interface OspScoreDto {
  ospIndecentPercentageScore?: number
  ospContactPercentageScore?: number
  ospIndecentScoreLevel?: ScoreLevelEnum
  ospContactScoreLevel?: ScoreLevelEnum
  ospIndirectImagePercentageScore?: number
  ospDirectContactPercentageScore?: number
  ospIndirectImageScoreLevel?: ScoreLevelEnum
  ospDirectContactScoreLevel?: ScoreLevelEnum
}

export interface OvpScoreDto {
  ovpStaticWeightedScore?: number
  ovpDynamicWeightedScore?: number
  ovpTotalWeightedScore?: number
  oneYear?: number
  twoYears?: number
  ovpRisk?: RiskEnum
}

export interface OgpScoreDto {
  ogpStaticWeightedScore?: number
  ogpDynamicWeightedScore?: number
  ogpTotalWeightedScore?: number
  ogp1Year?: number
  ogp2Year?: number
  ogpRisk?: RiskEnum
}

export interface RsrScoreDto {
  percentageScore?: number
  staticOrDynamic?: StaticOrDynamicEnum
  source: SourceEnum
  algorithmVersion?: string
  scoreLevel?: ScoreLevelEnum
}

export type RiskEnum = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' | 'NOT_APPLICABLE'
export const RiskEnum = {
  LOW: 'LOW' as RiskEnum,
  MEDIUM: 'MEDIUM' as RiskEnum,
  HIGH: 'HIGH' as RiskEnum,
  VERYHIGH: 'VERY_HIGH' as RiskEnum,
  NOTAPPLICABLE: 'NOT_APPLICABLE' as RiskEnum,
}

export type ScoreLevelEnum = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' | 'NOT_APPLICABLE'
export const RsrScoreLevelEnum = {
  LOW: 'LOW' as ScoreLevelEnum,
  MEDIUM: 'MEDIUM' as ScoreLevelEnum,
  HIGH: 'HIGH' as ScoreLevelEnum,
  VERYHIGH: 'VERY_HIGH' as ScoreLevelEnum,
  NOTAPPLICABLE: 'NOT_APPLICABLE' as ScoreLevelEnum,
}

export type StaticOrDynamicEnum = 'STATIC' | 'DYNAMIC'
export const StaticOrDynamicEnum = {
  STATIC: 'STATIC' as StaticOrDynamicEnum,
  DYNAMIC: 'DYNAMIC' as StaticOrDynamicEnum,
}

export type SourceEnum = 'OASYS'
export const SourceEnum = {
  OASYS: 'OASYS' as SourceEnum,
}
export type StatusEnum = 'COMPLETE' | 'LOCKED_INCOMPLETE'
export const StatusEnum = {
  COMPLETE: 'COMPLETE' as StatusEnum,
  LOCKEDINCOMPLETE: 'LOCKED_INCOMPLETE' as StatusEnum,
}

export interface PersonRiskFlags {
  personSummary: PersonSummary
  opd: Opd
  mappa: Mappa
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
  level: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATION_ONLY'
  description: string
  level: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATION_ONLY'
  notes?: string
  nextReviewDate?: string
  mostRecentReviewDate?: string
  createdDate: string
  createdBy: Name
  removed: boolean
  removalHistory: RemovalHistory[]
}
