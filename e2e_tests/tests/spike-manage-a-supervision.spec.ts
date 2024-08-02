// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from '@playwright/test'
// eslint-disable-next-line import/no-extraneous-dependencies
import * as dotenv from 'dotenv'
import { login as manageASupervisionLogin } from '../steps/login'
import { data } from '../test-data/test-data'

dotenv.config() // read environment variables into process.env

test('Verify the persons header details in Manage a Supervision', async ({ page }) => {
  const { crn, firstName, lastName } = data.person

  // Login to Manage a Supervision
  await manageASupervisionLogin(page)

  // Search for the CRN
  await page.getByRole('link', { name: 'Search' }).click()
  await page.getByLabel('Find a person on probation').fill(crn)
  await page.getByRole('button', { name: 'Search' }).click()

  // Verify the person appears in the search results and crn, name, dob & tier matches
  await page.locator(`[href$="${crn}"]`).click()
  await expect(page).toHaveTitle('Manage a Supervision - Overview')
  await expect(page.locator('[data-qa="crn"]')).toContainText(crn)
  await expect(page.locator('[data-qa="name"]')).toContainText(`${firstName} ${lastName}`)
  await expect(page.locator('[data-qa="headerDateOfBirthValue"]')).toContainText('27 October 1961')
  await expect(page.locator('[data-qa="tierValue"]').first()).toContainText('D0')
})
