import Page from '../pages/page'
import PersonalDetailsPage from '../pages/personalDetails'

context('Personal Details', () => {
  it('Overview page is rendered', () => {
    cy.visit('/case/X000001/personal-details')
    const page = Page.verifyOnPage(PersonalDetailsPage)
    page.headerCrn().should('contain.text', 'X000001')
    page.headerName().should('contain.text', 'Eula Schmeler')
    page.pageHeading().should('contain.text', 'Personal Details')
    page.getTab('overview').should('contain.text', 'Overview')
    page.getTab('personalDetails').should('contain.text', 'Personal details')
    page.getTab('risk').should('contain.text', 'Risk')
    page.getTab('sentence').should('contain.text', 'Sentence')
    page.getTab('activityLog').should('contain.text', 'Activity log')
    page.getTab('compliance').should('contain.text', 'Compliance')
    page.getCardHeader('contactDetails').should('contain.text', 'Contact details')
    page.getCardHeader('personalDetails').should('contain.text', 'Personal details')
    page.getCardHeader('equalityMonitoring').should('contain.text', 'Equality monitoring')
    page.getRowData('contactDetails', 'telephoneNumber', 'Value').should('contain.text', '0123456999')
    page.getRowData('contactDetails', 'mobileNumber', 'Value').should('contain.text', '071838893')
    page.getRowData('contactDetails', 'emailAddress', 'Value').should('contain.text', 'address1@gmail.com')
    page.getRowData('contactDetails', 'mainAddress', 'Value').should('contain.text', '32 SCOTLAND STREET')
    page.getRowData('contactDetails', 'otherAddresses', 'Value').should('contain.text', '1 other address')
    page.getRowData('contactDetails', 'contacts', 'Value').should('contain.text', 'Steve Wilson – GP (secondary)')

    page.getRowData('personalDetails', 'name', 'Value').should('contain.text', 'Eula Schmeler')
    page.getRowData('personalDetails', 'dateOfBirth', 'Value').should('contain.text', '18 August 1979')
    page.getRowData('personalDetails', 'aliases', 'Value').should('contain.text', 'Jonny Smith')
    page.getRowData('personalDetails', 'preferredLanguage', 'Value').should('contain.text', 'Urdu')
    page
      .getRowData('personalDetails', 'currentCircumstances', 'Value')
      .should('contain.text', 'Transferred to Crown Court: Is a Primary Carer')
    page
      .getRowData('personalDetails', 'disabilities', 'Value')
      .should('contain.text', 'Mental Health related disabilities')
    page.getRowData('personalDetails', 'adjustments', 'Value').should('contain.text', 'Handrails')
    page.getRowData('personalDetails', 'criminogenicNeeds', 'Value').should('contain.text', 'None')
    page.getRowData('personalDetails', 'crn', 'Value').should('contain.text', 'X000001')
    page.getRowData('personalDetails', 'documents', 'Value').should('contain.text', 'Eula-Schmeler-X000001-UPW.pdf')

    page.getRowData('equalityMonitoring', 'religionOrBelief', 'Value').should('contain.text', 'Scientology')
    page.getRowData('equalityMonitoring', 'sex', 'Value').should('contain.text', 'Female')
    page.getRowData('equalityMonitoring', 'genderIdentity', 'Value').should('contain.text', 'Non-Binary')
    page.getRowData('equalityMonitoring', 'sexualOrientation', 'Value').should('contain.text', 'Heterosexual')
  })
})
