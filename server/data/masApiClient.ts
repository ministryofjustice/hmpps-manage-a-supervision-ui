import config from '../config'
import RestClient from './restClient'
import { Overview } from './model/overview'
import { PersonAppointment, Schedule } from './model/schedule'
import {
  CircumstanceOverview,
  DisabilityOverview,
  PersonalContact,
  PersonalDetails,
  ProvisionOverview,
} from './model/personalDetails'
import { AddressOverview, ErrorSummary, PersonSummary } from './model/common'
import { SentenceDetails } from './model/sentenceDetails'

export default class MasApiClient extends RestClient {
  constructor(token: string) {
    super('Manage a Supervision API', config.apis.masApi, token)
  }

  async getOverview(crn: string): Promise<Overview | ErrorSummary | null> {
    return this.get({ path: `/overview/${crn}`, handle404: false })
  }

  async getSentenceDetails(crn: string): Promise<SentenceDetails | ErrorSummary | null> {
    return this.get({ path: `/sentence/${crn}`, handle404: false })
  }

  async getPersonalDetails(crn: string): Promise<PersonalDetails | ErrorSummary | null> {
    return this.get({ path: `/personal-details/${crn}`, handle404: false })
  }

  async getPersonalContact(crn: string, id: string): Promise<PersonalContact | ErrorSummary | null> {
    return this.get({ path: `/personal-details/${crn}/personal-contact/${id}`, handle404: false })
  }

  async getPersonalAddresses(crn: string): Promise<AddressOverview | ErrorSummary | null> {
    return this.get({ path: `/personal-details/${crn}/addresses`, handle404: false })
  }

  async getPersonSummary(crn: string): Promise<PersonSummary | ErrorSummary | null> {
    return this.get({ path: `/personal-details/${crn}/summary`, handle404: false })
  }

  async getPersonDisabilities(crn: string): Promise<DisabilityOverview | null> {
    return this.get({ path: `/personal-details/${crn}/disabilities`, handle404: false })
  }

  async getPersonAdjustments(crn: string): Promise<ProvisionOverview | null> {
    return this.get({ path: `/personal-details/${crn}/provisions`, handle404: false })
  }

  async getPersonCircumstances(crn: string): Promise<CircumstanceOverview | null> {
    return this.get({ path: `/personal-details/${crn}/circumstances`, handle404: false })
  }

  async downloadDocument(crn: string, documentId: string): Promise<Response> {
    return this.get({ path: `/personal-details/${crn}/document/${documentId}`, raw: true, responseType: 'arrayBuffer' })
  }

  async getPersonSchedule(crn: string, type: string): Promise<Schedule> {
    return this.get({ path: `/schedule/${crn}/${type}`, handle404: false })
  }

  async getPersonAppointment(crn: string, appointmentId: string): Promise<PersonAppointment | ErrorSummary | null> {
    return this.get({ path: `/schedule/${crn}/appointment/${appointmentId}`, handle404: false })
  }
}
