import Page from '../../pages/page'
import AddressPage from '../../pages/personalDetails/address'

context('Addresses', () => {
  it('Addresses page is rendered', () => {
    cy.visit('/case/X000001/personal-details/addresses')
    const page = Page.verifyOnPage(AddressPage)
    cy.get('p')
      .eq(0)
      .within(() =>
        cy
          .get('a')
          .invoke('attr', 'href')
          .should(
            'equal',
            'https://ndelius-dummy-url/NDelius-war/delius/JSP/deeplink.xhtml?component=AddressandAccommodation&CRN=X000001',
          ),
      )
    page.getTableHeader('mainAddress').should('contain.text', 'Main address – Since 14 Mar 2023')
    page.getTableHeader('otherAddress1').should('contain.text', 'Postal address – Since 14 Mar 2023')
    page.getTableHeader('previousAddress1').should('contain.text', 'Previous address – 14 Mar 2022 to 17 Jan 2023')

    page.getRowData('mainAddress', 'addressStatus', 'Value').should('contain.text', 'Main address')
    page.getRowData('mainAddress', 'address', 'Value').should('contain.text', '32 SCOTLAND STREET')
    page.getRowData('mainAddress', 'addressTelephone', 'Value').should('contain.text', '0191765438')
    page
      .getRowData('mainAddress', 'addressType', 'Value')
      .should('contain.text', 'Householder (Owner - freehold or leasehold) (verified)')
    page.getRowData('mainAddress', 'addressStartDate', 'Value').should('contain.text', '14 March 2023')
    page.getRowData('mainAddress', 'addressNotes', 'Value').should('contain.text', 'Some Notes')
    page
      .getRowData('mainAddress', 'addressLastUpdatedBy', 'Value')
      .should('contain.text', 'Last updated by Paul Smith on 20 Mar 2023')

    page.getRowData('otherAddress1', 'otherAddressStatus', 'Value1').should('contain.text', 'Postal address')
    page.getRowData('otherAddress1', 'otherAddress', 'Value1').should('contain.text', '32 Other Street')
    page
      .getRowData('otherAddress1', 'otherAddressType', 'Value1')
      .should('contain.text', 'Householder (Owner - freehold or leasehold) (not verified)')
    page.getRowData('otherAddress1', 'otherAddressStartDate', 'Value1').should('contain.text', '14 March 2023')
    page.getRowData('otherAddress1', 'otherAddressNotes', 'Value1').should('contain.text', 'No notes')
    page
      .getRowData('otherAddress1', 'otherAddressLastUpdatedBy', 'Value1')
      .should('contain.text', 'Last updated by Joe Bloggs on 20 Mar 2023')

    page.getRowData('previousAddress1', 'previousAddressStatus', 'Value1').should('contain.text', 'Previous address')
    page.getRowData('previousAddress1', 'previousAddress', 'Value1').should('contain.text', '32 Previous Street')
    page
      .getRowData('previousAddress1', 'previousAddressType', 'Value1')
      .should('contain.text', 'Householder (Owner - freehold or leasehold) (verified)')
    page.getRowData('previousAddress1', 'previousAddressStartDate', 'Value1').should('contain.text', '14 March 2022')
    page.getRowData('previousAddress1', 'previousAddressNotes', 'Value1').should('contain.text', 'Left this property')
    page
      .getRowData('previousAddress1', 'previousAddressLastUpdatedBy', 'Value1')
      .should('contain.text', 'Last updated by Jim Smith on 20 Mar 2023')
  })
})
