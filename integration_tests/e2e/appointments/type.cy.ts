import Page from '../../pages/page'
import AppointmentTypePage from '../../pages/appointments/type.page'
import properties from '../../../server/properties'

describe('Appointment type', () => {
  let page: AppointmentTypePage
  const crn = 'X778160'
  const uuid = '19a88188-6013-43a7-bb4d-6e338516818f'
  beforeEach(() => {
    cy.visit(`/case/${crn}/arrange-appointment/${uuid}/type`)
    page = Page.verifyOnPage(AppointmentTypePage)
  })
  it('Page is rendered', () => {
    page.backLink().should($backLink => {
      expect($backLink.text()).to.eq('Back')
    })
    page.backLink().should('have.attr', 'href', '/')
    for (let i = 1; i < properties.appointmentTypes.length; i += 1) {
      page.getRadioLabel(i).should('contain.text', properties.appointmentTypes[i - 1].text)
      page.getRadio(i).should('not.be.checked')
    }
    page.submitBtn().should('contain.text', 'Continue')
  })

  describe('Continue is clicked without first selecting a type', () => {
    beforeEach(() => {
      page.submitBtn().click()
    })
    it('should display the summary box', () => {
      page.getErrorSummaryBox().should('be.visible')
      page.getAllErrorSummaryLinks().should('have.length', 1)
      page.getErrorSummaryLink(1).should($link => {
        expect($link.text()).to.eq('Select an appointment type')
      })
    })
    it('should display the error message', () => {
      page.getElement(`#appointments-${crn}-${uuid}-type-error`).should($error => {
        expect($error.text()).to.include('Select an appointment type')
      })
    })
    describe('The error summary link is clicked', () => {
      beforeEach(() => {
        page.getErrorSummaryLink(1).click()
      })
      it('should focus the first radio button', () => {
        page.getRadio(1).should('be.focused')
      })
    })
  })
})
