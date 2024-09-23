import { Page, expect } from '@playwright/test'
import { faker } from '@faker-js/faker/locale/en_GB'
import { selectOption } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/inputs'
import { Address } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/address/create-address'
import { findOffenderByCRN } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/find-offender'
import { formatDate, retryOnError } from '../utils/utils'

export const createPersonalContact = async (page: Page, crn: string, options: Address) => {
  return retryOnError(async innerPage => {
    await findOffenderByCRN(innerPage, crn) // Use innerPage instead of page
    await innerPage.locator('#navigation-include\\:linkNavigation2OffenderIndex').click()
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const contactName = `${firstName} ${lastName}`
    const contactPhoneNumber = `07${faker.string.numeric(9)}`
    const contactEmail = faker.internet.email()
    const notes = `Added Emergency contact on ${formatDate(new Date())}`
    await innerPage.locator('#navigation-include\\:linkNavigation3PersonalContact').click()
    await expect(innerPage).toHaveTitle('Personal Contacts')
    await innerPage.locator('[value="Add Personal Contact"]').click()
    await expect(innerPage).toHaveTitle('Add Personal Contact')
    await selectOption(innerPage, '#Relationship\\:selectOneMenu', 'Emergency Contact')
    await innerPage.locator('#RelationshipToOffender\\:inputText').fill('Friend')
    await innerPage.locator('#FirstName\\:inputText').fill(firstName)
    await innerPage.locator('#Surname\\:inputText').fill(lastName)
    await innerPage.locator('#MobileNumber\\:inputText').fill(contactPhoneNumber)
    await innerPage.locator('#EmailAddress\\:inputText').fill(contactEmail)
    await innerPage.locator('#Notes\\:notesField').fill(notes)
    await innerPage.locator('#HouseNumber\\:inputText').fill(options.buildingNumber)
    await innerPage.locator('#StreetName\\:inputText').fill(options.street)
    await innerPage.locator('#TownCity\\:inputText').fill(options.cityName)
    await innerPage.locator('#County\\:inputText').fill(options.county)
    await innerPage.locator('#Postcode\\:inputText').fill(options.zipCode)
    await innerPage.locator('[value="Save"]').click()
    await expect(innerPage).toHaveTitle('Personal Contacts')

    return {
      contactName,
      contactPhoneNumber,
      contactEmail,
    }
  }, page) // Pass the page object to retryOnError
}

export default createPersonalContact
