import 'cypress-plugin-tab'
import { DateTime } from 'luxon'
import AppointmentDateTimePage from '../../pages/appointments/date-time.page'
import AppointmentLocationPage from '../../pages/appointments/location.page'
import AppointmentSentencePage from '../../pages/appointments/sentence.page'
import AppointmentTypePage from '../../pages/appointments/type.page'
import AppointmentRepeatingPage from '../../pages/appointments/repeating.page'
import AppointmentPreviewPage from '../../pages/appointments/preview.page'
import AppointmentCheckYourAnswersPage from '../../pages/appointments/check-your-answers.page'

export const crn = 'X778160'
export const uuid = '19a88188-6013-43a7-bb4d-6e338516818f'
export const date = DateTime.now()
export const startTime = '9:00am'
export const endTime = '9:30am'
export const dateRegex: RegExp =
  /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) \d{1,2} (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/

export const completeTypePage = (index = 1, query = '') => {
  cy.visit(`/case/${crn}/arrange-appointment/${uuid}/type${query}`)
  const typePage = new AppointmentTypePage()
  typePage.getRadio('type', index).click()
  typePage.getSubmitBtn().click()
}

export const completeSentencePage = () => {
  const sentencePage = new AppointmentSentencePage()
  sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence`).click()
  sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence-licence-condition`).click()
  sentencePage.getSubmitBtn().click()
}

export const completeLocationPage = (index = 1) => {
  const suffix = index > 1 ? `-${index}` : ''
  const locationPage = new AppointmentLocationPage()
  locationPage.getElement(`#appointments-${crn}-${uuid}-location${suffix}`).click()
  locationPage.getSubmitBtn().click()
}

export const completeDateTimePage = () => {
  const dateTimePage = new AppointmentDateTimePage()
  dateTimePage.getDatePickerToggle().click()
  dateTimePage.getActiveDayButton().click()
  dateTimePage.getElement(`#appointments-${crn}-${uuid}-start-time`).select(startTime)
  dateTimePage.getElement(`#appointments-${crn}-${uuid}-end-time`).focus().select(endTime).tab()
  dateTimePage.getSubmitBtn().click()
}

export const completeRepeatingPage = (repeat = 2) => {
  const repeatingPage = new AppointmentRepeatingPage()
  if (repeat) {
    repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating`).click()
    repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating-frequency`).click()
    repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating-count`).clear().type(repeat.toString())
  } else {
    repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating-2`).click()
    cy.debug()
  }
  repeatingPage.getSubmitBtn().click()
}

export const completePreviewPage = () => {
  const previewPage = new AppointmentPreviewPage()
  previewPage.getSubmitBtn().click()
}
export const completeCYAPage = () => {
  const cyaPage = new AppointmentCheckYourAnswersPage()
  cyaPage.getSubmitBtn().click()
}
