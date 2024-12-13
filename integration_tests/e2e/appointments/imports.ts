import AppointmentDateTimePage from '../../pages/appointments/date-time.page'
import AppointmentLocationPage from '../../pages/appointments/location.page'
import AppointmentSentencePage from '../../pages/appointments/sentence.page'
import AppointmentTypePage from '../../pages/appointments/type.page'
import AppointmentRepeatingPage from '../../pages/appointments/repeating.page'

export const crn = 'X778160'
export const uuid = '19a88188-6013-43a7-bb4d-6e338516818f'

export const completeTypePage = () => {
  const typePage = new AppointmentTypePage()
  typePage.getRadio('type', 1).click()
  typePage.getSubmitBtn().click()
}

export const completeSentencePage = () => {
  const sentencePage = new AppointmentSentencePage()
  sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence`).click()
  sentencePage.getElement(`#appointments-${crn}-${uuid}-sentence-licence-condition`).click()
  sentencePage.getSubmitBtn().click()
}

export const completeLocationPage = () => {
  const locationPage = new AppointmentLocationPage()
  locationPage.getElement(`#appointments-${crn}-${uuid}-location`).click()
  locationPage.getSubmitBtn().click()
}

export const completeDateTimePage = () => {
  const dateTimePage = new AppointmentDateTimePage()
  dateTimePage.getDatePickerToggle().click()
  dateTimePage.getActiveDayButton().click()
  dateTimePage.getElement(`#appointments-${crn}-${uuid}-start-time`).type('9:00am')
  dateTimePage.getElement(`#appointments-${crn}-${uuid}-end-time`).focus().type('9:30am').tab()
  dateTimePage.getSubmitBtn().click()
}

export const completeRepeatingPage = () => {
  const repeatingPage = new AppointmentRepeatingPage()
  repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating`).click()
  repeatingPage.getElement(`#appointments-${crn}-${uuid}-repeating-frequency`).click()
  repeatingPage.getSubmitBtn().click()
}
