import { Page, expect, Locator } from '@playwright/test'
import { login as loginToManageMySupervision } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/manage-a-supervision/login'

export const loginMasAndGoToPersonalDetails = async (page: Page, crn: string) => {
  await loginToManageMySupervision(page)
  await searchForCrn(page, crn)
  await page.getByRole('link', { name: 'Personal details' }).first().click()
  await expect(page.locator('h1.govuk-heading-l')).toContainText('Personal Details')
}

export const searchForCrn = async (page: Page, crn: string) => {
  await page.getByRole('link', { name: 'Search' }).click()
  await page.getByLabel('Find a person on probation').fill(crn)
  await page.getByRole('button', { name: 'Search' }).click()
  await page.locator(`[href$="${crn}"]`).click()
  await expect(page).toHaveTitle('Manage a Supervision - Overview')
}

export const assertAddressDetails = async (
  page: Page,
  locator: Locator,
  address: { buildingNumber: string; street: string; cityName: string; county: string; zipCode: string },
) => {
  await expect(locator).toContainText(`${address.buildingNumber} ${address.street}`)
  await expect(locator).toContainText(address.cityName)
  await expect(locator).toContainText(address.county)
  await expect(locator).toContainText(address.zipCode)
}
