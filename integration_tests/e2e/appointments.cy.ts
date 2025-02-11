import Page from '../pages/page'
import AppointmentPage from '../pages/appointment'
import AppointmentsPage from '../pages/appointments'

context('Appointment', () => {
  it('Appointment page with outcome is rendered', () => {
    cy.visit('/case/X000001/appointments/appointment/4')
    const page = Page.verifyOnPage(AppointmentPage)
    page.appointmentType().should('contain.text', 'Initial appointment')
    page.appointmentTitle().should('contain.text', 'Phone call with Steve Bruce')
    page.complianceTag().should('contain.text', 'Acceptable absence')
    page.getCardHeader('appointmentDetails').should('contain.text', 'Appointment details')
    page.getRowData('appointmentDetails', 'type', 'Value').should('contain.text', 'Previous')
    page.getRowData('appointmentDetails', 'date', 'Value').should('contain.text', 'Friday 22 March')
    page.getRowData('appointmentDetails', 'time', 'Value').should('contain.text', '8:15am to 8:30am')
    page.getRowData('appointmentDetails', 'repeating', 'Value').should('contain.text', 'Yes')
    page.getRowData('appointmentDetails', 'rar', 'Value').should('contain.text', 'Choices and Changes')

    page.getCardHeader('outcomeDetails').should('contain.text', 'Outcome details')
    page.getRowData('outcomeDetails', 'complied', 'Value').should('contain.text', 'No')
    page.getRowData('outcomeDetails', 'nonComplianceReason', 'Value').should('contain.text', 'Some reason')
    page.getRowData('outcomeDetails', 'enforcementAction', 'Value').should('contain.text', 'Enforcement Action')
    page.getRowData('outcomeDetails', 'documents', 'Value').should('contain.text', 'Eula-Schmeler-X000001-UPW.pdf')
    page.getRowData('outcomeDetails', 'sensitive', 'Value').should('contain.text', 'No')
    page.getRowData('outcomeDetails', 'notes', 'Value').should('contain.text', 'Some notes')
  })
  it('Appointments page with upcoming and past appointments is rendered', () => {
    cy.visit('/case/X000001/appointments')
    const page = Page.verifyOnPage(AppointmentsPage)
    const url = 'https://ndelius-dummy-url/NDelius-war/delius/JSP/deeplink.xhtml?component=ContactList&CRN=X000001'

    page.headerCrn().should('contain.text', 'X000001')
    page.headerName().should('contain.text', 'Eula Schmeler')
    page.assertRiskTags()
    page.upcomingAppointmentDate(1).should('contain.text', '22 March 2045')
    page.upcomingAppointmentTime(1).should('contain.text', '10:15am to 10:30am')
    page.upcomingAppointmentType(1).should('contain.text', 'Video call')
    page
      .upcomingAppointmentAction(1)
      .find('a')
      .should('contain.text', 'Manage on NDelius')
      .should('have.attr', 'aria-label', 'Manage video call appointment on NDelius')
      .should('have.attr', 'target', '_blank')
      .should(
        'have.attr',
        'href',
        'https://ndelius-dummy-url/NDelius-war/delius/JSP/deeplink.xhtml?component=ContactList&CRN=X000001',
      )
    page.upcomingAppointmentDate(2).should('contain.text', '22 December 2044')
    page.upcomingAppointmentTime(2).should('contain.text', '9:15am')
    page.upcomingAppointmentType(2).should('contain.text', 'Phone call')

    page.pastAppointmentDate(1).should('contain.text', '22 March 2024')
    page.pastAppointmentTime(1).should('contain.text', '8:15am to 8:30am')
    page.pastAppointmentType(1).should('contain.text', 'Phone call')
    page.pastAppointmentDate(2).should('contain.text', '21 March 2024')
    page.pastAppointmentTime(2).should('contain.text', '10:15am to 10:30am')
    page.pastAppointmentType(2).should('contain.text', 'Phone call')

    page.assertAnchorElementAtIndexWithin('[class="govuk-table__row"]', 1, 1, url)
    page.assertAnchorElementAtIndexWithin('[class="govuk-table__row"]', 2, 1, url)
    page.assertAnchorElementAtIndexWithin('[class="govuk-table__row"]', 4, 1, url)
    page.assertAnchorElementAtIndexWithin('[class="govuk-table__row"]', 5, 1, url)
    page.assertAnchorElementAtIndexWithin('[class="govuk-table__row"]', 6, 1, url)
    page.assertAnchorElementAtIndexWithin('[class="govuk-table__row"]', 7, 1, url)
  })
})
