import CaseSearchService from '@ministryofjustice/probation-search-frontend/service/caseSearchService'
import { dataAccess } from '../data'
import UserService from './userService'
import FlagService from './flagService'
import config from '../config'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, manageUsersApiClient } = dataAccess()

  const userService = new UserService(manageUsersApiClient)

  const searchService = new CaseSearchService({
    oauthClient: hmppsAuthClient,
    environment: config.env,
    extraColumns: [],
  })

  const flagService = new FlagService()
  return {
    applicationInfo,
    hmppsAuthClient,
    userService,
    searchService,
    flagService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService, FlagService }
