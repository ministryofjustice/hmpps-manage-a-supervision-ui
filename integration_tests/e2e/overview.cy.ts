import Page from '../pages/page'
import OverviewPage from '../pages/overview'

context('Overview', () => {
  it('Overview page is rendered', () => {
    cy.visit('/case/X000001')
    const page = Page.verifyOnPage(OverviewPage)
    page.headerCrn().should('contain.text', 'X000001')
    page.headerName().should('contain.text', 'Caroline Wolff')
    page.pageHeading().should('contain.text', 'Overview')
    page.assertRiskTags()
    page.getTab('overview').should('contain.text', 'Overview')
    page.getTab('personalDetails').should('contain.text', 'Personal details')
    page.getTab('risk').should('contain.text', 'Risk')
    page.getTab('sentence').should('contain.text', 'Sentence')
    page.getTab('activityLog').should('contain.text', 'Activity log')
    page.getTab('compliance').should('contain.text', 'Compliance')
    page.getCardHeader('schedule').should('contain.text', 'Appointments')
    page
      .getRowData('schedule', 'nextAppointment', 'Value')
      .should('contain.text', 'Saturday 9 March at 2:59pm (Initial Appointment - In office (NS))')
    page.getRowData('personalDetails', 'name', 'Value').should('contain.text', 'Caroline Wolff')
    page.getRowData('personalDetails', 'preferredName', 'Value').should('contain.text', 'Caz')
    page.getRowData('personalDetails', 'preferredGender', 'Value').should('contain.text', 'Female')
    page.getRowData('personalDetails', 'dateOfBirthAndAge', 'Value').should('contain.text', '9 January 2002')
    page.getRowData('personalDetails', 'contactNumber', 'Value').should('contain.text', '07989654824')
    page
      .getRowData('personalDetails', 'currentCircumstances', 'Value')
      .should('contain.text', 'Committed/ Transferred to Crown: Life imprisonment (Adult)')
    page.getRowData('personalDetails', 'disabilities', 'Value').should('contain.text', 'Dyslexia')
    page.getRowData('personalDetails', 'adjustments', 'Value').should('contain.text', 'Special Furniture')
    page.getCardHeader('sentence2').should('contain.text', 'ORA Community Order')
    page
      .getRowData('sentence2', 'mainOffence', 'Value')
      .should(
        'contain.text',
        '(Having possession a picklock or other implement with intent to break into any premises - 18502)',
      )
    page.getRowData('sentence2', 'order', 'Value').should('contain.text', 'ORA Community Order')
    page.getRowData('sentence2', 'requirements', 'Value').should('contain.text', '9 of 10 RAR days completed')
    page.getCardHeader('sentence3').should('contain.text', '12 month Community order')
    page
      .getRowData('sentence3', 'mainOffence', 'Value')
      .should('contain.text', 'Breach of Restraining Order (Protection from Harassment Act 1997) - 00831')
    page.getRowData('sentence3', 'order', 'Value').should('contain.text', '12 month Community order')
    page.getRowData('sentence3', 'requirements', 'Value').should('contain.text', '14 of 16 RAR days completed')
    page
      .getRowData('activityAndCompliance', 'previousOrders', 'Value')
      .should('contain.text', '1 previous orders (No breaches on previous orders)')
    page
      .getRowData('activityAndCompliance', 'compliance', 'Value')
      .should('contain.text', '2 without a recorded outcome')
    page
      .getRowData('activityAndCompliance', 'activityLog', 'Value')
      .should('contain.text', '2 national standard appointments')
    page.getRowData('risk', 'rosh', 'Value').should('contain.text', 'HIGH')
    page
      .getRowData('risk', 'harmToSelf', 'Value')
      .should('contain.text', 'Previous concerns about coping in a hostel setting')
    page.getRowData('risk', 'riskFlags', 'Value').should('contain.text', 'Risk to Known Adult')
    page.getRowData('miscellaneous', 'tier', 'Value').should('contain.text', 'B2')

    const expected =
      '{"name":"Wolff,Caroline","crn":"X000001","dob":"9 January 2002","age":"22","tierScore":"B2","sentence":"12 month Community order"}'

    cy.window()
      .its('localStorage')
      .invoke('getItem', 'recentCases')
      .then(result => {
        const recentCase = JSON.parse(JSON.stringify(result))
        expect(expected, recentCase)
      })
  })
  it('Risk information and tier is not provided due to 500 from ARNS and TIER', () => {
    cy.visit('/case/X000002')
    const page = Page.verifyOnPage(OverviewPage)
    page.headerCrn().should('contain.text', 'X000002')
    page.headerName().should('contain.text', 'Caroline Wolff')
    page.pageHeading().should('contain.text', 'Overview')
    page.getTab('overview').should('contain.text', 'Overview')
    page.getTab('personalDetails').should('contain.text', 'Personal details')
    page.getTab('risk').should('contain.text', 'Risk')
    page.getTab('sentence').should('contain.text', 'Sentence')
    page.getTab('activityLog').should('contain.text', 'Activity log')
    page.getTab('compliance').should('contain.text', 'Compliance')
    page.getCardHeader('schedule').should('contain.text', 'Appointments')
    cy.get(`[data-qa=errors]`).should(
      'contain.text',
      'OASys is experiencing technical difficulties. It has not been possible to provide the Risk information held in OASys',
    )
    cy.get(`[data-qa=errors]`).should(
      'contain.text',
      'The tier service is experiencing technical difficulties. It has not been possible to provide tier information',
    )
  })
})
