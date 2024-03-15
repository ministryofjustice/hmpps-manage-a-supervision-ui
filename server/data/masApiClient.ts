import config from '../config'
import RestClient from './restClient'
import { Overview } from './model/overview'
import { PersonalDetails } from './model/personalDetails'

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

  async getPersonalContact(crn: string, id: string): Promise<PersonalDetails | null> {
    return this.get({ path: `/personal-details/${crn}/personal-contact/${id}`, handle404: true })
  }

  async getPersonalAddresses(crn: string): Promise<PersonalDetails | null> {
    return this.get({ path: `/personal-details/${crn}/addresses`, handle404: true })
  }

  async getPersonSummary(crn: string): Promise<PersonalDetails | null> {
    return this.get({ path: `/personal-details/${crn}/summary`, handle404: true })
  }

  async downloadDocument(crn: string, documentId: string) {
    return this.stream({ path: `/personal-details/${crn}/document/${documentId}` })
  }
}
