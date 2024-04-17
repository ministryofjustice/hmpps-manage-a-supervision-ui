import Page from '../pages/page'
import AppointmentPage from '../pages/appointment'
import SchedulePage from '../pages/schedule'

context('Appointment', () => {
  it('Appointment page with outcome is rendered', () => {
    cy.visit('/case/X000001/schedule/appointment/4')
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
  it('Schedule page with appointments is rendered', () => {
    cy.visit('/case/X000001/schedule')
    const page = Page.verifyOnPage(SchedulePage)
    page.headerCrn().should('contain.text', 'X000001')
    page.headerName().should('contain.text', 'Eula Schmeler')
    page.pageHeading().should('contain.text', 'Schedule')
    page.appointmentRow(1).should('contain.text', 'Thursday 22 December 2044')
    page.appointmentRow(1).should('contain.text', '9:15am')
    page.appointmentRow(1).should('contain.text', 'Phone call with Terry Jones')
    page.appointmentRow(2).should('contain.text', 'Wednesday 22 March 2045')
    page.appointmentRow(2).should('contain.text', '10:15am to 10:30am')
    page.appointmentRow(2).should('contain.text', 'Video call with William Philips')
  })
})
