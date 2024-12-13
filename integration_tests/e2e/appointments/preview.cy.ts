import {
  crn,
  uuid,
  completeTypePage,
  completeSentencePage,
  completeLocationPage,
  completeDateTimePage,
  completeRepeatingPage,
} from './imports'
import AppointmentPreviewPage from '../../pages/appointments/preview.page'

describe('Will the appointment repeat?', () => {
  let previewPage: AppointmentPreviewPage
  beforeEach(() => {
    cy.visit(`/case/${crn}/arrange-appointment/${uuid}/type`)
    completeTypePage()
    completeSentencePage()
    completeLocationPage()
    completeDateTimePage()
    completeRepeatingPage()
    previewPage = new AppointmentPreviewPage()
  })
})
