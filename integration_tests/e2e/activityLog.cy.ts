import Page from '../pages/page'
import ActivityLogPage from '../pages/activityLog'

context('Appointment', () => {
  it('Activity log page is rendered in default view', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getRowData('timeline1', 'enforcement', 'Value').should('contain.text', 'Warning letter sent')
    page.getRowData('timeline2', 'rarActivity', 'Value').should('contain.text', 'Stepping Stones')
    page.getCardHeader('timeline3').should('contain.text', 'Waiting for evidence')
    page.getRowData('timeline4', 'reschedule', 'Value').should('contain.text', 'Requested by Terry Jones')
    page.getCardHeader('timeline5').should('contain.text', 'Office appointment at 10:15am')
    page.getCardHeader('timeline6').should('contain.text', 'Phone call at 8:15am')
    page.getCardHeader('timeline7').should('contain.text', 'Office appointment at 10:15am')
    page.getCardHeader('timeline8').should('contain.text', 'Video call at 10:15am')
  })
  it('Activity log page is rendered in compact view', () => {
    cy.visit('/case/X000001/activity-log?view=compact')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getActivity('1').should('contain.text', 'Video call')
    page.getActivity('2').should('contain.text', 'Phone call from Eula Schmeler')
    page.getActivity('3').should('contain.text', 'Planned appointment')
    page.getActivity('4').should('contain.text', 'Initial appointment')
    page.getActivity('5').should('contain.text', 'Office appointment')
    page.getActivity('6').should('contain.text', 'Phone call')
    page.getActivity('7').should('contain.text', 'Office appointment')
    page.getActivity('8').should('contain.text', 'Video call')
  })
})
