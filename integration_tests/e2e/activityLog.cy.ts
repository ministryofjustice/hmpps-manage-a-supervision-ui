import Page from '../pages/page'
import ActivityLogPage from '../pages/activityLog'
import errorMessages from '../../server/properties/errorMessages'

const keywords = 'Phone call'
const dateFrom = '11/1/2025'
const dateTo = '12/1/2025'

const fillFilters = (page: ActivityLogPage) => {
  page.getKeywordsInput().type(keywords)
  page.getDateFromInput().type(dateFrom)
  page.getDateToInput().type(dateTo)
  page.getComplianceFilter(1).click()
  page.getComplianceFilter(2).click()
  page.getComplianceFilter(3).click()
}

const filtersAreFilled = (page: ActivityLogPage) => {
  page.getKeywordsInput().should('have.value', keywords)
  page.getDateFromInput().should('have.value', dateFrom)
  page.getDateToInput().should('have.value', dateTo)
  page.getComplianceFilter(1).should('be.checked')
  page.getComplianceFilter(2).should('be.checked')
  page.getComplianceFilter(3).should('be.checked')
}

context('Activity log', () => {
  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth() + 1
  const year = today.getFullYear()
  const date = `${day}/${month}/${year}`

  it('should render the filter menu', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    cy.get('.toggle-menu .toggle-menu__list-item:nth-of-type(1)').should('contain.text', 'Default view')
    cy.get('.toggle-menu .toggle-menu__list-item:nth-of-type(2) a').should('contain.text', 'Compact view')
    cy.get('[data-qa="filter-form"]').within(() => cy.get('h2').should('contain.text', 'Filter activity log'))
    page.getApplyFiltersButton().should('contain.text', 'Apply filters')
    cy.get('[data-qa="keywords"]').within(() => cy.get('label').should('contain.text', 'Keywords'))
    page.getKeywordsInput().should('exist').should('have.value', '')
    cy.get('[data-qa="date-from"]').within(() => cy.get('label').should('contain.text', 'Date from'))
    cy.get('[data-qa="date-from"]').within(() => cy.get('input').should('exist').should('have.value', ''))
    cy.get('[data-qa="date-to"]').within(() => cy.get('label').should('contain.text', 'Date to'))
    cy.get('[data-qa="date-to"]').within(() => cy.get('input').should('exist').should('have.value', ''))
    cy.get('[data-qa="compliance"]').within(() =>
      cy.get('legend').should('exist').should('contain.text', 'Compliance filters'),
    )
    const filters = ['Without an outcome', 'Complied', 'Not complied']
    cy.get('[data-qa="compliance"] .govuk-checkboxes__item').each(($el, i) => {
      cy.wrap($el).find('input').should('not.be.checked')
      cy.wrap($el).find('label').should('contain.text', filters[i])
    })
  })
  it('should show the correct validation if date to is selected, but no date from is selected', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getDateToToggle().click()
    page.getDateToDialog().should('be.visible').find(`button[data-testid="${date}"]`).click()
    page.getDateToInput().should('have.value', date)
    page.getDateToDialog().should('not.be.visible')
    page.getApplyFiltersButton().click()
    page.getSelectedFilterTag(1).should('not.exist')
    page.getErrorSummaryBox().should('be.visible')
    page.getAllErrorSummaryLinks().should('have.length', 1)
    page.getErrorSummaryLink(1).should('contain.text', errorMessages['activity-log']['date-from'].errors.isEmpty)
    page.getErrorSummaryLink(1).click()
    page.getDateFromInput().should('be.focused')
  })
  it('should show the correct validation if date from is selected, but no date to is selected', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getDateFromToggle().click()
    page.getDateFromDialog().should('be.visible').find(`button[data-testid="${date}"]`).click()
    page.getDateFromInput().should('have.value', date)
    page.getDateFromDialog().should('not.be.visible')
    page.getApplyFiltersButton().click()
    page.getSelectedFilterTag(1).should('not.exist')
    page.getErrorSummaryBox().should('be.visible')
    page.getAllErrorSummaryLinks().should('have.length', 1)
    page.getErrorSummaryLink(1).should('contain.text', errorMessages['activity-log']['date-to'].errors.isEmpty)
    page.getErrorSummaryLink(1).click()
    page.getDateToInput().should('be.focused')
  })
  it('should show the correct validation if an invalid date from is entered', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getDateFromInput().type('01/04/2025')
    page.getApplyFiltersButton().click()
    page.getSelectedFilterTag(1).should('not.exist')
    page.getErrorSummaryBox().should('be.visible')
    page.getAllErrorSummaryLinks().should('have.length', 1)
    page.getErrorSummaryLink(1).should('contain.text', errorMessages['activity-log']['date-from'].errors.isInvalid)
  })
  it('should show the correct validation if an invalid date to is entered', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getDateToInput().type('01/04/')
    page.getApplyFiltersButton().click()
    page.getSelectedFilterTag(1).should('not.exist')
    page.getErrorSummaryBox().should('be.visible')
    page.getAllErrorSummaryLinks().should('have.length', 1)
    page.getErrorSummaryLink(1).should('contain.text', errorMessages['activity-log']['date-to'].errors.isInvalid)
  })
  it('should show the correct validation if date from doesnt exist', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getDateFromInput().type('30/2/2025')
    page.getApplyFiltersButton().click()
    page.getSelectedFilterTag(1).should('not.exist')
    page.getErrorSummaryBox().should('be.visible')
    page.getAllErrorSummaryLinks().should('have.length', 1)
    page.getErrorSummaryLink(1).should('contain.text', errorMessages['activity-log']['date-from'].errors.isNotReal)
  })
  it('should show the correct validation if date to doesnt exist', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getDateToInput().type('30/2/2025')
    page.getApplyFiltersButton().click()
    page.getSelectedFilterTag(1).should('not.exist')
    page.getErrorSummaryBox().should('be.visible')
    page.getAllErrorSummaryLinks().should('have.length', 1)
    page.getErrorSummaryLink(1).should('contain.text', errorMessages['activity-log']['date-to'].errors.isNotReal)
  })
  it('should show the correct validation if date from is after date to', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getDateFromInput().type('12/1/2025')
    page.getDateToInput().type('11/1/2025')
    page.getApplyFiltersButton().click()
    page.getSelectedFilterTag(1).should('not.exist')
    page.getErrorSummaryBox().should('be.visible')
    page.getAllErrorSummaryLinks().should('have.length', 1)
    page.getErrorSummaryLink(1).should('contain.text', errorMessages['activity-log']['date-from'].errors.isAfterTo)
  })

  it('should show the correct validation if date from is in the future', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getDateFromInput().type(`${day}/${month}/${year + 1}`)
    page.getApplyFiltersButton().click()
    page.getErrorSummaryBox().should('be.visible')
    page.getAllErrorSummaryLinks().should('have.length', 1)
    page.getErrorSummaryLink(1).should('contain.text', errorMessages['activity-log']['date-from'].errors.isInFuture)
  })
  it('should show the correct validation if date to is in the future', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getDateToInput().type(`${day}/${month}/${year + 1}`)
    page.getApplyFiltersButton().click()
    page.getErrorSummaryBox().should('be.visible')
    page.getAllErrorSummaryLinks().should('have.length', 1)
    page.getErrorSummaryLink(1).should('contain.text', errorMessages['activity-log']['date-to'].errors.isInFuture)
  })
  it('should display the filter tag and filter the list if a keyword value is submitted', () => {
    cy.visit('/case/X000001/activity-log')
    const value = 'Phone call'
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getKeywordsInput().type(value)
    page.getApplyFiltersButton().click()
    page.getSelectedFilterTags().should('have.length', 1)
    page.getSelectedFilterTag(1).should('contain.text', value)
    page.getCardHeader('timeline1').should('contain.text', 'Phone call from Eula Schmeler')
    page.getKeywordsInput().should('have.value', value)
  })
  it('should remove the tag, clear the keyword field and reset the list if the keyword tag is clicked', () => {
    cy.visit('/case/X000001/activity-log')
    const value = 'Phone call'
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getKeywordsInput().type(value)
    page.getApplyFiltersButton().click()
    page.getSelectedFilterTag(1).click()
    page.getSelectedFilterTag(1).should('not.exist')
    page.getKeywordsInput().should('have.value', '')
    page.getCardHeader('timeline1').should('contain.text', 'Video call')
  })
  it('should display the filter tag and filter the list if a date from and date to are submitted', () => {
    cy.visit('/case/X000001/activity-log')
    const fromDate = '20/1/2025'
    const toDate = '27/1/2025'
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getDateFromInput().type(fromDate)
    page.getDateToInput().type(toDate)
    page.getApplyFiltersButton().click()
    page.getDateFromInput().should('have.value', fromDate)
    page.getDateToInput().should('have.value', toDate)
    page.getSelectedFilterTags().should('have.length', 1)
    page.getSelectedFilterTag(1).should('contain.text', `${fromDate} - ${toDate}`)
    page.getCardHeader('timeline1').should('contain.text', 'Phone call from Eula Schmeler')
    cy.get('[data-qa="results-count-start"]').should('contain.text', '1')
    cy.get('[data-qa="results-count-end"]').should('contain.text', '1')
    cy.get('[data-qa="results-count-total"]').should('contain.text', '1')
  })
  it('should remove the tag, clear both date fields and reset the list if the date range tag is clicked', () => {
    cy.visit('/case/X000001/activity-log')
    const fromDate = '20/1/2025'
    const toDate = '27/1/2025'
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getDateFromInput().type(fromDate)
    page.getDateToInput().type(toDate)
    page.getApplyFiltersButton().click()
    page.getSelectedFilterTag(1).click()
    page.getSelectedFilterTag(1).should('not.exist')
    page.getDateFromInput().should('have.value', '')
    page.getDateToInput().should('have.value', '')
    page.getCardHeader('timeline1').should('contain.text', 'Video call')
    cy.get('[data-qa="results-count-start"]').should('contain.text', '1')
    cy.get('[data-qa="results-count-end"]').should('contain.text', '10')
    cy.get('[data-qa="results-count-total"]').should('contain.text', '54')
  })
  it('should display the 3 filter tags and filter the list if all compliance filters as clicked and submitted', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getComplianceFilter(1).click()
    page.getComplianceFilter(2).click()
    page.getComplianceFilter(3).click()
    page.getApplyFiltersButton().click()
    page.getComplianceFilter(1).should('be.checked')
    page.getComplianceFilter(2).should('be.checked')
    page.getComplianceFilter(3).should('be.checked')
    page.getSelectedFilterTags().should('have.length', 3)
    page.getSelectedFilterTag(1).should('contain.text', 'Without an outcome')
    page.getSelectedFilterTag(2).should('contain.text', 'Complied')
    page.getSelectedFilterTag(3).should('contain.text', 'Not complied')
    page.getCardHeader('timeline1').should('contain.text', 'AP PA - Attitudes, thinking & behaviours at 9:15am')
    page.getCardHeader('timeline2').should('contain.text', 'Pre-Intervention Session 1 at 9:15am')
    page.getCardHeader('timeline3').should('contain.text', 'Initial Appointment - Home Visit (NS) at 9:15am')
    cy.get('[data-qa="results-count-start"]').should('contain.text', '1')
    cy.get('[data-qa="results-count-end"]').should('contain.text', '3')
    cy.get('[data-qa="results-count-total"]').should('contain.text', '3')
  })
  it(`should display 2 filter tags, uncheck the filter option and filter the list when 'Not complied' tag is clicked`, () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getComplianceFilter(1).click()
    page.getComplianceFilter(2).click()
    page.getComplianceFilter(3).click()
    page.getApplyFiltersButton().click()
    page.getSelectedFilterTag(3).click()
    page.getSelectedFilterTags().should('have.length', 2)
    page.getSelectedFilterTag(1).should('contain.text', 'Without an outcome')
    page.getSelectedFilterTag(2).should('contain.text', 'Complied')
    page.getSelectedFilterTag(3).should('not.exist')
    page.getComplianceFilter(1).should('be.checked')
    page.getComplianceFilter(2).should('be.checked')
    page.getComplianceFilter(3).should('not.be.checked')
    page.getCardHeader('timeline1').should('contain.text', 'AP PA - Attitudes, thinking & behaviours at 9:15am')
    page.getCardHeader('timeline2').should('contain.text', 'Pre-Intervention Session 1 at 9:15am')
    cy.get('[data-qa="results-count-start"]').should('contain.text', '1')
    cy.get('[data-qa="results-count-end"]').should('contain.text', '2')
    cy.get('[data-qa="results-count-total"]').should('contain.text', '2')
  })
  it(`should display 1 filter tag, uncheck the deselected filter options and filter the list when 'complied' and 'Not complied' tags are clicked`, () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getComplianceFilter(1).click()
    page.getComplianceFilter(2).click()
    page.getComplianceFilter(3).click()
    page.getApplyFiltersButton().click()
    page.getSelectedFilterTag(3).click()
    page.getSelectedFilterTag(2).click()
    page.getSelectedFilterTags().should('have.length', 1)
    page.getSelectedFilterTag(1).should('contain.text', 'Without an outcome')
    page.getSelectedFilterTag(2).should('not.exist')
    page.getSelectedFilterTag(3).should('not.exist')
    page.getComplianceFilter(1).should('be.checked')
    page.getComplianceFilter(2).should('not.be.checked')
    page.getComplianceFilter(3).should('not.be.checked')
  })
  it(`should clear all selected filters when 'Clear filters' link is clicked`, () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getKeywordsInput().type('Phone call')
    page.getDateFromInput().type('20/1/2025')
    page.getDateToInput().type('27/1/2025')
    page.getComplianceFilter(1).click()
    page.getComplianceFilter(2).click()
    page.getComplianceFilter(3).click()
    page.getApplyFiltersButton().click()
    page.getSelectedFilterTags().should('have.length', 5)
    page.getCardHeader('timeline1').should('contain.text', 'Phone call from Eula Schmeler')
    cy.get('[data-qa="results-count-start"]').should('contain.text', '1')
    cy.get('[data-qa="results-count-end"]').should('contain.text', '1')
    cy.get('[data-qa="results-count-total"]').should('contain.text', '1')
    cy.get('.govuk-pagination').should('not.exist')
    cy.get('.moj-filter__heading-action a').click()
    page.getSelectedFilterTags().should('not.exist')
    page.getKeywordsInput().should('have.value', '')
    page.getDateFromInput().should('have.value', '')
    page.getDateToInput().should('have.value', '')
    page.getComplianceFilter(1).should('not.be.checked')
    page.getComplianceFilter(2).should('not.be.checked')
    page.getComplianceFilter(3).should('not.be.checked')
    page.getCardHeader('timeline1').should('contain.text', 'Video call')
    cy.get('[data-qa="results-count-start"]').should('contain.text', '1')
    cy.get('[data-qa="results-count-end"]').should('contain.text', '10')
    cy.get('[data-qa="results-count-total"]').should('contain.text', '54')
    cy.get('.govuk-pagination').should('exist')
  })
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
    page.getCardHeader('timeline8').should('contain.text', 'Initial appointment at 10:15am')
    page.getCardHeader('timeline9').should('contain.text', 'Initial appointment at 10:15am')
    page.getCardHeader('timeline10').should('contain.text', 'Video call at 10:15am')
  })
  it('should display the pagination navigation', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    cy.get('.govuk-pagination').should('exist')
    cy.get('.govuk-pagination__link[rel="prev"]').should('not.exist')
    cy.get('.govuk-pagination__link[rel="next"]').should('exist')
    page.getPaginationLink(1).should('have.attr', 'aria-current')
    page.getPaginationLink(1).should('contain.text', '1')
    page.getPaginationLink(2).should('contain.text', '2')
    page.getPaginationLink(3).should('contain.text', '3')
    page.getPaginationItem(4).should('contain.text', '⋯')
    page.getPaginationLink(5).should('contain.text', '6')
    cy.get('.govuk-pagination__item').should('have.length', 5)
  })
  it('should link to the next page when link 2 is clicked', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getPaginationLink(2).click()
    page.getPaginationLink(2).should('have.attr', 'aria-current')
    page.getPaginationLink(1).should('not.have.attr', 'aria-current')
    cy.get('.govuk-pagination__link[rel="prev"]').should('exist')
    cy.get('.govuk-pagination__link[rel="next"]').should('exist')
    cy.get('.govuk-pagination__item').should('have.length', 5)
    page.getPaginationLink(1).should('contain.text', '1')
    page.getPaginationLink(2).should('contain.text', '2')
    page.getPaginationLink(3).should('contain.text', '3')
    page.getPaginationItem(4).should('contain.text', '⋯')
    page.getPaginationLink(5).should('contain.text', '6')
  })
  it('should link to the next page when link 3 is clicked', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getPaginationLink(3).click()
    page.getPaginationLink(3).should('not.have.attr', 'aria-current')
    page.getPaginationLink(4).should('have.attr', 'aria-current')
    cy.get('.govuk-pagination__link[rel="prev"]').should('exist')
    cy.get('.govuk-pagination__link[rel="next"]').should('exist')
    cy.get('.govuk-pagination__item').should('have.length', 7)
    page.getPaginationLink(1).should('contain.text', '1')
    page.getPaginationItem(2).should('contain.text', '⋯')
    page.getPaginationLink(3).should('contain.text', '2')
    page.getPaginationItem(4).should('contain.text', '3')
    page.getPaginationLink(5).should('contain.text', '4')
    page.getPaginationItem(6).should('contain.text', '⋯')
    page.getPaginationLink(7).should('contain.text', '6')
  })
  it('should link to page 2 when the previous link is clicked', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getPaginationLink(3).click()
    cy.get('.govuk-pagination__link[rel="prev"]').click()
    page.getPaginationLink(2).should('have.attr', 'aria-current')
    page.getPaginationLink(1).should('not.have.attr', 'aria-current')
    cy.get('.govuk-pagination__link[rel="prev"]').should('exist')
    cy.get('.govuk-pagination__link[rel="next"]').should('exist')
    cy.get('.govuk-pagination__item').should('have.length', 5)
    page.getPaginationLink(1).should('contain.text', '1')
    page.getPaginationLink(2).should('contain.text', '2')
    page.getPaginationLink(3).should('contain.text', '3')
    page.getPaginationItem(4).should('contain.text', '⋯')
    page.getPaginationLink(5).should('contain.text', '6')
  })
  it('should link to page 4 when the next link is clicked', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getPaginationLink(3).click()
    // cy.pause()
    cy.get('.govuk-pagination__link[rel="next"]').click()
    page.getPaginationLink(3).should('not.have.attr', 'aria-current')
    page.getPaginationLink(4).should('have.attr', 'aria-current')
    cy.get('.govuk-pagination__link[rel="prev"]').should('exist')
    cy.get('.govuk-pagination__link[rel="next"]').should('exist')
    cy.get('.govuk-pagination__item').should('have.length', 7)
    page.getPaginationLink(1).should('contain.text', '1')
    page.getPaginationItem(2).should('contain.text', '⋯')
    page.getPaginationLink(3).should('contain.text', '3')
    page.getPaginationLink(4).should('contain.text', '4')
    page.getPaginationLink(5).should('contain.text', '5')
    page.getPaginationItem(6).should('contain.text', '⋯')
    page.getPaginationLink(7).should('contain.text', '6')
  })
  it('should link to the next page when the link 5 is clicked', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getPaginationLink(3).click()
    page.getPaginationLink(5).click()
    page.getPaginationLink(5).click()
    page.getPaginationLink(3).should('not.have.attr', 'aria-current')
    page.getPaginationLink(4).should('have.attr', 'aria-current')
    cy.get('.govuk-pagination__link[rel="prev"]').should('exist')
    cy.get('.govuk-pagination__link[rel="next"]').should('exist')
    cy.get('.govuk-pagination__item').should('have.length', 5)
    page.getPaginationLink(1).should('contain.text', '1')
    page.getPaginationItem(2).should('contain.text', '⋯')
    page.getPaginationLink(3).should('contain.text', '4')
    page.getPaginationLink(4).should('contain.text', '5')
    page.getPaginationLink(5).should('contain.text', '6')
  })
  it('should link to the next page when the link 6 is clicked', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getPaginationLink(3).click()
    page.getPaginationLink(5).click()
    page.getPaginationLink(5).click()
    page.getPaginationLink(5).click()
    page.getPaginationLink(4).should('not.have.attr', 'aria-current')
    page.getPaginationLink(5).should('have.attr', 'aria-current')
    cy.get('.govuk-pagination__link[rel="prev"]').should('exist')
    cy.get('.govuk-pagination__link[rel="next"]').should('not.exist')
    cy.get('.govuk-pagination__item').should('have.length', 5)
    page.getPaginationLink(1).should('contain.text', '1')
    page.getPaginationItem(2).should('contain.text', '⋯')
    page.getPaginationLink(3).should('contain.text', '4')
    page.getPaginationLink(4).should('contain.text', '5')
    page.getPaginationLink(5).should('contain.text', '6')
  })
  it('Activity log page is rendered in compact view', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    cy.get('.toggle-menu__list-item:nth-of-type(2) a').click()
    page.getActivity('1').should('contain.text', 'Video call')
    page.getActivity('2').should('contain.text', 'Phone call from Eula Schmeler')
    page.getActivity('3').should('contain.text', 'Planned appointment')
    page.getActivity('4').should('contain.text', 'Initial appointment')
    page.getActivity('5').should('contain.text', 'Office appointment')
    page.getActivity('6').should('contain.text', 'Phone call')
    page.getActivity('7').should('contain.text', 'Office appointment')
    page.getActivity('8').should('contain.text', 'Initial appointment')
    page.getActivity('9').should('contain.text', 'Initial appointment')
    page.getActivity('10').should('contain.text', 'Video call')
  })
  it('should display the no results message when no results are returned', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    page.getKeywordsInput().type('No results')
    page.getApplyFiltersButton().click()
    cy.get('.toggle-menu').should('not.exist')
    cy.get('[data-qa="results-count"]').should('not.exist')
    cy.get('.govuk-pagination').should('not.exist')
    page.getNoResults().find('h3').should('contain.text', '0 search results found')
    page.getNoResults().find('p').should('contain.text', 'Improve your search by:')
    page.getNoResults().find('li:nth-of-type(1)').should('contain.text', 'removing filters')
    page.getNoResults().find('li:nth-of-type(2)').should('contain.text', 'double-checking the spelling')
    page
      .getNoResults()
      .find('li:nth-of-type(3)')
      .should('contain.text', 'removing special characters like characters and accent letters')
  })
  it('should persist the selected filters when a pagination link is clicked', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    fillFilters(page)
    page.getApplyFiltersButton().click()
    page.getPaginationItem(2).click()
    filtersAreFilled(page)
  })
  it('should persist the selected filters when a view link is clicked', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    fillFilters(page)
    page.getApplyFiltersButton().click()
    cy.get('.toggle-menu__list-item:nth-of-type(2) a').click()
    filtersAreFilled(page)
  })
  it('should persist the selected filters when user clicks on record detail link, then returns to the page via the breadcrumb', () => {
    cy.visit('/case/X000001/activity-log')
    const page = Page.verifyOnPage(ActivityLogPage)
    fillFilters(page)
    page.getApplyFiltersButton().click()
    page.getActivity('1').find('h2 a').click()
    cy.get('.govuk-breadcrumbs__list .govuk-breadcrumbs__list-item:nth-of-type(3) a').click()
    filtersAreFilled(page)
  })
})
