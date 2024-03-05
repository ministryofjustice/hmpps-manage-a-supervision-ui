import Page from '../pages/page'
import OverviewPage from '../pages/overview'

context('Overview', () => {
  it('Overview page is rendered', () => {
    cy.visit('/case/X000001')
    const page = Page.verifyOnPage(OverviewPage)
    page.headerCrn().should('contain.text', 'X000001')
    page.headerName().should('contain.text', 'Caroline Wolff')
    page.pageHeading().should('contain.text', 'Overview')
    page.getTab('overview').should('contain.text', 'Overview')
    page.getTab('personalDetails').should('contain.text', 'Personal details')
    page.getTab('risk').should('contain.text', 'Risk')
    page.getTab('sentence').should('contain.text', 'Sentence')
    page.getTab('activityLog').should('contain.text', 'Activity log')
    page.getTab('compliance').should('contain.text', 'Compliance')
    page.getCardHeader('schedule').should('contain.text', 'Schedule')
    page
      .getRowData('schedule', 'nextAppointment', 'Value')
      .should('contain.text', 'Tuesday 5 March at 4:45pm (Initial Appointment - In office (NS))')
    page.getRowData('personalDetails', 'name', 'Value').should('contain.text', 'Caroline Wolff')
    page.getRowData('personalDetails', 'preferredName', 'Value').should('contain.text', 'Caz')
    page.getRowData('personalDetails', 'preferredGender', 'Value').should('contain.text', 'Female')
    page.getRowData('personalDetails', 'dateOfBirthAndAge', 'Value').should('contain.text', '9 January 2002')
    page.getRowData('personalDetails', 'contactNumber', 'Value').should('contain.text', '07989654824')
    page
      .getRowData('personalDetails', 'currentCircumstances', 'Value')
      .should('contain.text', 'Committed/ Transferred to Crown: Life imprisonment (Adult)')
    page
      .getRowData('personalDetails', 'disabilitiesAndAdjustments', 'Value')
      .should('contain.text', 'Special Furniture')
    page
      .getRowData('sentence2', 'mainOffence', 'Value')
      .should(
        'contain.text',
        '(Having possession a picklock or other implement with intent to break into any premises - 18502)',
      )
    page.getRowData('sentence2', 'order', 'Value').should('contain.text', 'ORA Community Order')
    page.getRowData('sentence2', 'requirements', 'Value').should('contain.text', '10 days RAR, 9 completed')
    page
      .getRowData('sentence3', 'mainOffence', 'Value')
      .should('contain.text', 'Breach of Restraining Order (Protection from Harassment Act 1997) - 00831')
    page.getRowData('sentence3', 'order', 'Value').should('contain.text', '12 month Community order')
    page.getRowData('sentence3', 'requirements', 'Value').should('contain.text', '16 days RAR, 14 completed')
    page
      .getRowData('activityAndCompliance', 'previousOrders', 'Value')
      .should('contain.text', '1 previous orders (No breaches on previous orders)')
    page
      .getRowData('activityAndCompliance', 'compliance', 'Value')
      .should('contain.text', '2 failure to comply within 12 months')
    page
      .getRowData('activityAndCompliance', 'activityLog', 'Value')
      .should('contain.text', '5 national standard appointments')
  })
})
