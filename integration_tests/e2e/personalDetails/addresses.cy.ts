import Page from '../../pages/page'
import AddressPage from '../../pages/personalDetails/address'

context('Addresses', () => {
  it('Addresses page is rendered', () => {
    cy.visit('/case/X000001/personal-details/addresses')
    const page = Page.verifyOnPage(AddressPage)

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

    page.getRowData('otherAddress1', 'addressStatus', 'Value').should('contain.text', 'Postal address')
    page.getRowData('otherAddress1', 'address', 'Value').should('contain.text', '32 Other Street')
    page
      .getRowData('otherAddress1', 'addressType', 'Value')
      .should('contain.text', 'Householder (Owner - freehold or leasehold) (not verified)')
    page.getRowData('otherAddress1', 'addressStartDate', 'Value').should('contain.text', '14 March 2023')
    page.getRowData('otherAddress1', 'addressNotes', 'Value').should('contain.text', 'No notes')
    page
      .getRowData('otherAddress1', 'addressLastUpdatedBy', 'Value')
      .should('contain.text', 'Last updated by Joe Bloggs on 20 Mar 2023')

    page.getRowData('previousAddress1', 'addressStatus', 'Value').should('contain.text', 'Previous address')
    page.getRowData('previousAddress1', 'address', 'Value').should('contain.text', '32 Previous Street')
    page
      .getRowData('previousAddress1', 'addressType', 'Value')
      .should('contain.text', 'Householder (Owner - freehold or leasehold) (verified)')
    page.getRowData('previousAddress1', 'addressStartDate', 'Value').should('contain.text', '14 March 2022')
    page.getRowData('previousAddress1', 'addressNotes', 'Value').should('contain.text', 'Left this property')
    page
      .getRowData('previousAddress1', 'addressLastUpdatedBy', 'Value')
      .should('contain.text', 'Last updated by Jim Smith on 20 Mar 2023')
  })
})
