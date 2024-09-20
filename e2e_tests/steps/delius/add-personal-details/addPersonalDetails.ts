import { faker } from '@faker-js/faker/locale/en_GB'
import { Page, expect } from '@playwright/test'
import { findOffenderByCRN } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/find-offender'
import { retryOnError } from '../utils/utils'

interface PersonalDetails {
  mobileNumber: string
  telephoneNumber: string
  email: string
}

const addPersonalDetails = async (page: Page, crn: string): Promise<PersonalDetails> => {
  return retryOnError(async innerPage => {
    await findOffenderByCRN(innerPage, crn)
    await innerPage.locator('#navigation-include\\:linkNavigation2OffenderIndex').click()
    await innerPage.getByRole('link', { name: 'Personal Details' }).click()
    await innerPage.getByRole('button', { name: 'Update' }).click()
    await expect(innerPage.locator('#content > h1')).toContainText('Update Personal Details')
    await innerPage.getByLabel('Mobile Number:').fill(`07${faker.string.numeric(9)}`)
    await innerPage.getByLabel('Telephone Number:').fill(faker.phone.number())
    await innerPage.getByLabel('Email address:').fill(faker.internet.email())
    await innerPage.getByRole('button', { name: 'Save' }).click()
    await expect(innerPage.locator('#content > h1')).toContainText('Personal Details')
    const mobileNumber = await innerPage.locator('#Mobile\\:outputText').textContent()
    const telephoneNumber = await innerPage.locator('#Telephone\\:outputText').textContent()
    const email = await innerPage.locator('#Email\\:outputText').textContent()
    return { mobileNumber, telephoneNumber, email }
  }, page)
}

export default addPersonalDetails
