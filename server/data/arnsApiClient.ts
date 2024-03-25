import config from '../config'
// eslint-disable-next-line import/no-cycle
import RestClient from './restClient'
import { ErrorSummary, ErrorSummaryItem } from './model/common'

export default class ArnsApiClient extends RestClient {
  constructor(token: string) {
    super('Assess Risks and Needs API', config.apis.arnsApi, token)
  }

  async getRisks(crn: string): Promise<RiskSummary | ErrorSummary | null> {
    return this.get({
      path: `/risks/crn/${crn}`,
      handle404: true,
      handle500: true,
      errorMessageFor500:
        'OAsys is experiencing technical difficulties. It has not been possible to provide the Risk information held in OASys',
    })
  }
}

export type RiskScore = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'

export type RiskResponse = 'YES' | 'NO' | 'DK'

export interface Risk {
  [index: string]: string
  risk: RiskResponse | null
  current: RiskResponse | null
  currentConcernsText: string | null
  previous?: RiskResponse | null
  previousConcernsText?: string | null
}

export interface RiskToSelf {
  [index: string]: Risk
  suicide?: Risk | null
  selfHarm?: Risk | null
  custody?: Risk | null
  hostelSetting?: Risk | null
  vulnerability?: Risk | null
}

export interface RiskSummary {
  errors?: ErrorSummaryItem[]
  riskToSelf?: RiskToSelf
  summary?: {
    whoIsAtRisk?: string | null
    natureOfRisk?: string | null
    riskImminence?: string | null
    riskIncreaseFactors?: string | null
    riskMitigationFactors?: string | null
    riskInCommunity: Partial<Record<RiskScore, string[]>>
    riskInCustody: Partial<Record<RiskScore, string[]>>
    overallRiskLevel: RiskScore
  }
  assessedOn?: string | null
}
