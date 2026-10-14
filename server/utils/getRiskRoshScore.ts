import { RiskFlag, RoshBadgeLevel } from '../data/model/risk'

export const getRiskRoshScore = (
  riskFlags: RiskFlag[],
): { score: RoshBadgeLevel | null | undefined; assessedOn: string | null | undefined } => {
  let score = null
  let assessedOn = null
  if (riskFlags?.length) {
    const roshRiskFlag = riskFlags
      ?.filter(riskFlag => !riskFlag.removed)
      ?.find(riskFlag => riskFlag?.description?.toLowerCase()?.includes('rosh'))
    if (roshRiskFlag) {
      score = roshRiskFlag.description.toLowerCase().replace('rosh', '').trim().toUpperCase() as RoshBadgeLevel
      assessedOn = roshRiskFlag?.mostRecentReviewDate ?? null
    }
  }
  return { score, assessedOn }
}
