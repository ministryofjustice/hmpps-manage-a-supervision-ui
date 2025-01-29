import Page from '../../../pages'
import PreviousOrderPage from '../../../pages/sentence/previous-orders/previous-order'

context('Sentence', () => {
  it('Previous order page is rendered', () => {
    cy.visit('/case/X000001/sentence/previous-orders/sentence/3')

    const page = Page.verifyOnPage(PreviousOrderPage)
    const breadCrumbElement = '.govuk-breadcrumbs__list-item'

    cy.get('h2').contains('Previous orders')

    page.assertAnchorElementAtIndex(breadCrumbElement, 0, '/case')
    page.assertTextAtAnchorElementAtIndex(breadCrumbElement, 0, 'My cases')

    page.assertAnchorElementAtIndex(breadCrumbElement, 1, '/case/X000001')
    page.assertTextAtAnchorElementAtIndex(breadCrumbElement, 1, 'Caroline Wolff')

    page.assertAnchorElementAtIndex(breadCrumbElement, 2, '/case/X000001/sentence')
    page.assertTextAtAnchorElementAtIndex(breadCrumbElement, 2, 'Sentence')

    page.assertAnchorElementAtIndex(breadCrumbElement, 3, '/case/X000001/sentence/previous-orders')
    page.assertTextAtAnchorElementAtIndex(breadCrumbElement, 3, 'Previous orders')
  })
})
