import Page from '../pages/page'
import PersonalDetailsPage from '../pages/personalDetails'

context('Personal Details', () => {
  it('Overview page is rendered', () => {
    cy.visit('/case/X000001/personal-details')
    const page = Page.verifyOnPage(PersonalDetailsPage)
    page.assertRiskTags()
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
    page.getCardHeader('identityNumber').should('contain.text', 'Identity numbers')
    page.getCardHeader('staffContacts').should('contain.text', 'Staff contacts')
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
    page
      .getRowData('personalDetails', 'criminogenicNeeds', 'Value')
      .should('contain.text', 'Education, Training and Employability')
    page.getRowData('personalDetails', 'documents', 'Value').should('contain.text', 'Eula-Schmeler-X000001-UPW.pdf')

    page.getRowData('identityNumber', 'crn', 'Value').should('contain.text', 'X000001')
    page.getRowData('identityNumber', 'pnc', 'Value').should('contain.text', '1954/0018147W')
    page.getRowData('identityNumber', 'noms', 'Value').should('contain.text', 'G9566GQ')

    page
      .getRowData('staffContacts', 'staffContactRole', 'Label')
      .should('contain.text', 'Prison Offender Manager (POM)')
    page.getRowData('staffContacts', 'staffContactRole', 'Label').should('contain.text', '(responsible officer)')
    page
      .getRowData('staffContacts', 'staffContactLastUpdated', 'Label')
      .should('contain.text', 'Last updated 30 April 2024')
    page.getRowData('staffContacts', 'staffContactName', 'Value').should('contain.text', 'Arhsimna Xolfo')
    page
      .getRowData('staffContacts', 'staffContactRole', 'Label', 1)
      .should('contain.text', 'Community Offender Manager (COM)')
    page
      .getRowData('staffContacts', 'staffContactLastUpdated', 'Label', 1)
      .should('contain.text', 'Last updated 30 April 2024')
    page.getRowData('staffContacts', 'staffContactName', 'Value', 1).should('contain.text', 'Yrhreender Hanandra')
    page.getCardHeader('staffContacts').find('a').should('contain.text', 'View staff contacts')
    page
      .getCardHeader('staffContacts')
      .find('a')
      .should('have.attr', 'href', '/case/X000001/personal-details/staff-contacts')

    page.getRowData('equalityMonitoring', 'religionOrBelief', 'Value').should('contain.text', 'Scientology')
    page.getRowData('equalityMonitoring', 'sex', 'Value').should('contain.text', 'Female')
    page.getRowData('equalityMonitoring', 'genderIdentity', 'Value').should('contain.text', 'Non-Binary')
    page.getRowData('equalityMonitoring', 'sexualOrientation', 'Value').should('contain.text', 'Heterosexual')
  })
})
