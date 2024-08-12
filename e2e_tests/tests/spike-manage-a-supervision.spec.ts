import { expect, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { deliusPerson } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person'
import { createOffender } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/create-offender'
import { login as loginToDelius } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/login'
import loginToManageMySupervision from '../steps/login'

dotenv.config() // read environment variables into process.env

test('Verify the persons header details in Manage a Supervision', async ({ page }) => {
  await loginToDelius(page)
  const person = deliusPerson()
  const crn = await createOffender(page, { person })

  // Search for the CRN
  await loginToManageMySupervision(page)
  await page.getByRole('link', { name: 'Search' }).click()
  await page.getByLabel('Find a person on probation').fill(crn)
  await page.getByRole('button', { name: 'Search' }).click()

  // Verify the person appears in the search results and crn, name, dob & tier matches
  await page.locator(`[href$="${crn}"]`).click()
  await expect(page).toHaveTitle('Manage a Supervision - Overview')
  await expect(page.locator('[data-qa="crn"]')).toContainText(crn)
  await expect(page.locator('[data-qa="name"]')).toContainText(`${person.firstName} ${person.lastName}`)
  await expect(page.locator('[data-qa="headerDateOfBirthValue"]')).toContainText('27 October 1961')
  await expect(page.locator('[data-qa="tierValue"]').first()).toContainText('D0')
})
