import config from '../config'
import RestClient from './restClient'
import { Overview } from './model/overview'
import {
  CircumstanceOverview,
  DisabilityOverview,
  PersonalContact,
  PersonalDetails,
  ProvisionOverview,
} from './model/personalDetails'
import { AddressOverview, PersonSummary } from './model/common'

export default class MasApiClient extends RestClient {
  constructor(token: string) {
    super('Manage a Supervision API', config.apis.masApi, token)
  }

  async getOverview(crn: string): Promise<Overview | null> {
    return this.get({ path: `/overview/${crn}`, handle404: true })
  }

  async getPersonalDetails(crn: string): Promise<PersonalDetails | null> {
    return this.get({ path: `/personal-details/${crn}`, handle404: true })
  }

  async getPersonalContact(crn: string, id: string): Promise<PersonalContact | null> {
    return this.get({ path: `/personal-details/${crn}/personal-contact/${id}`, handle404: true })
  }

  async getPersonalAddresses(crn: string): Promise<AddressOverview | null> {
    return this.get({ path: `/personal-details/${crn}/addresses`, handle404: true })
  }

  async getPersonSummary(crn: string): Promise<PersonSummary | null> {
    return this.get({ path: `/personal-details/${crn}/summary`, handle404: true })
  }

  async getPersonDisabilities(crn: string): Promise<DisabilityOverview | null> {
    return this.get({ path: `/personal-details/${crn}/disabilities`, handle404: true })
  }

  async getPersonAdjustments(crn: string): Promise<ProvisionOverview | null> {
    return this.get({ path: `/personal-details/${crn}/provisions`, handle404: true })
  }

  async getPersonCircumstances(crn: string): Promise<CircumstanceOverview | null> {
    return this.get({ path: `/personal-details/${crn}/circumstances`, handle404: true })
  }

  async downloadDocument(crn: string, documentId: string) {
    return this.stream({ path: `/personal-details/${crn}/document/${documentId}` })
  }
}
