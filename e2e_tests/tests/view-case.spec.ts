import { expect, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { DateTime } from 'luxon'
import { deliusPerson } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person'
import { createOffender } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/create-offender'
import { login as loginToDelius } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/login'
import { login as loginToManageMySupervision } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/manage-a-supervision/login'

dotenv.config({ path: 'e2e_tests/.env' }) // read environment variables into process.env

test('Verify the header details', async ({ page }) => {
  // Create a person in Delius
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
  await expect(page.locator('[data-qa="headerDateOfBirthValue"]')).toContainText(
    DateTime.fromJSDate(person.dob).toFormat('d MMMM yyyy'),
  )
  await expect(page.locator('[data-qa="tierValue"]').first()).toContainText('D0')
})
