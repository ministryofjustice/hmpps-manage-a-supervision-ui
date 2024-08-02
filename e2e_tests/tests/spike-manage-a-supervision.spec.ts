import { expect, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { login as manageASupervisionLogin } from '../steps/login'

dotenv.config() // read environment variables into process.env

const person = {
  crn: 'X791152',
  firstName: 'Tony',
  lastName: 'Runolfsson',
  sex: 'Male',
  dob: '1961-10-27T17:42:08.079Z',
  pnc: '1961/1755756H',
}

test('Verify the persons header details in Manage a Supervision', async ({ page }) => {
  const { crn, firstName, lastName } = person

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
