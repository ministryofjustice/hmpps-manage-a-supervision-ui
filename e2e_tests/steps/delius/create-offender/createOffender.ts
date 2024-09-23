import { Page } from '@playwright/test'
import { login as loginToDelius } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/login'
import {
  deliusPerson,
  Person,
} from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person'
import { createOffender } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/create-offender'

const loginDeliusAndCreateOffender = async (page: Page): Promise<[Person, string]> => {
  await loginToDelius(page)
  const person = deliusPerson()
  const crn = await createOffender(page, { person })
  return [person, crn]
}

export default loginDeliusAndCreateOffender
