import Page from '../../pages/page'
import EditContactDetails from '../../pages/personalDetails/editContactDetails'

context('Edit contact details', () => {
  it('Edit contact details page is rendered based on non fixed address', () => {
    cy.visit('/case/X000001/personal-details/edit-contact-details')
    const page = Page.verifyOnPage(EditContactDetails)
    page.getElement('phoneNumber').should('be.visible')
    page.getElement('mobileNumber').should('be.visible')
    page.getElement('emailAddress').should('be.visible')
    page.getElement('buildingName').should('not.be.visible')
    page.getElement('buildingNumber').should('not.be.visible')
    page.getElement('streetName').should('not.be.visible')
    page.getElement('district').should('not.be.visible')
    page.getElement('town').should('not.be.visible')
    page.getElement('county').should('not.be.visible')
    page.getElement('postcode').should('not.be.visible')
    page.getElement('startDate').should('be.visible')
    page.getElement('endDate').should('be.visible')
    page.getElement('notes').should('be.visible')
    page.getCheckboxField('noFixedAddress').click()
    page.getElement('buildingName').should('be.visible')
    page.getElement('buildingNumber').should('be.visible')
    page.getElement('streetName').should('be.visible')
    page.getElement('district').should('be.visible')
    page.getElement('town').should('be.visible')
    page.getElement('county').should('be.visible')
    page.getElement('postcode').should('be.visible')
  })
  it('Submitting successfully should redirect to Personal details screen with update banner', () => {
    cy.visit('/case/X000001/personal-details/edit-contact-details')
    const page = Page.verifyOnPage(EditContactDetails)
    page.getElement('submit-btn').click()
    page.getElement('updateBanner').should('contain.text', 'Contact details updated')
  })
  it('Submitting with an end date should stay on edit page with warning banner, then second submit will redirect to Personal details screen with update banner', () => {
    cy.visit('/case/X000001/personal-details/edit-contact-details')
    const page = Page.verifyOnPage(EditContactDetails)
    page.getElementInput('endDate').type('03/02/2025')
    page.getElement('submit-btn').click()
    page
      .getElement('infoBanner')
      .should(
        'contain.text',
        'An end date will change this to a previous address and you will need to add a new main address.',
      )
    page.getElement('submit-btn').click()
    page.getElement('updateBanner').should('contain.text', 'Contact details updated')
  })

  it('Submitting with invalid data with over 35 chars should show error messages', () => {
    cy.visit('/case/X000001/personal-details/edit-contact-details')
    const page = Page.verifyOnPage(EditContactDetails)
    page.getElementInput('phoneNumber').clear().type('1'.repeat(36))
    page.getElementInput('mobileNumber').clear().type('1'.repeat(36))
    page.getElementInput('emailAddress').clear().type('1'.repeat(36))
    page.getCheckboxField('noFixedAddress').click()
    page.getElementInput('buildingName').clear().type('1'.repeat(36))
    page.getElementInput('buildingNumber').clear().type('1'.repeat(36))
    page.getElementInput('streetName').clear().type('1'.repeat(36))
    page.getElementInput('district').clear().type('1'.repeat(36))
    page.getElementInput('town').clear().type('1'.repeat(36))
    page.getElementInput('county').clear().type('1'.repeat(36))
    page.getElementInput('postcode').clear().type('1'.repeat(36))

    page.getElement('submit-btn').click()
    page.getElement('phoneNumberError').should('contain.text', 'Phone number must be 35 characters or less.')
    page.getElement('mobileNumberError').should('contain.text', 'Mobile number must be 35 characters or less.')
    page.getElement('emailAddress').should('contain.text', 'Enter an email address in the correct format.')

    page.getElement('buildingName').should('contain.text', 'Building name must be 35 characters or less.')
    page.getElement('buildingNumber').should('contain.text', 'House number must be 35 characters or less.')
    page.getElement('streetName').should('contain.text', 'Street name must be 35 characters or less.')
    page.getElement('district').should('contain.text', 'District must be 35 characters or less.')
    page.getElement('town').should('contain.text', 'Town or city must be 35 characters or less.')
    page.getElement('county').should('contain.text', 'County must be 35 characters or less.')
    page.getElement('postcode').should('contain.text', 'Enter a full UK postcode.')

    page.getElement('errorList').should('contain.text', 'Enter a full UK postcode.')
  })

  it('Submitting with a dates later than today should show error messages', () => {
    cy.visit('/case/X000001/personal-details/edit-contact-details')
    const page = Page.verifyOnPage(EditContactDetails)
    page.getElementInput('endDate').type('03/02/2099')
    page.getElementInput('startDate').clear().type('03/02/2099')
    page.getElement('submit-btn').click()
    page.getElement('endDateError').should('contain.text', 'End date can not be later than today.')
    page.getElement('startDateError').should('contain.text', 'Start date can not be later than today.')
  })
})
