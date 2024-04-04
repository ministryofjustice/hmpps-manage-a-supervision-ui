import Page from '../pages/page'
import RiskPage from '../pages/risk'
import RemovedRiskPage from '../pages/removedRisk'
import RemovedRiskDetailPage from '../pages/removedRiskDetail'
import RiskDetailPage from '../pages/riskDetail'

context('Risk', () => {
  it('Risk overview page is rendered', () => {
    cy.visit('/case/X000001/risk')
    const page = Page.verifyOnPage(RiskPage)
    page.getRowData('riskOfHarmInCommunity', 'overall', 'Value').should('contain.text', 'HIGH')
    page.getRowData('riskOfHarmInCommunity', 'veryHigh', 'Value').should('contain.text', 'Staff')
    page.getRowData('riskOfHarmInCommunity', 'high', 'Value').should('contain.text', 'Public')
    page.getRowData('riskOfHarmInCommunity', 'medium', 'Value').should('contain.text', 'Known Adult')
    page.getRowData('riskOfHarmInCommunity', 'low', 'Value').should('contain.text', 'Children')
    page
      .getRowData('riskOfHarmInCommunity', 'who', 'Value')
      .should('contain.text', 'NOD-849Meaningful content for AssSumm Testing')
    page
      .getRowData('riskOfHarmInCommunity', 'nature', 'Value')
      .should('contain.text', 'NOD-849 Meaningful content for AssSumm Testing')
    page
      .getRowData('riskOfHarmInCommunity', 'imminence', 'Value')
      .should('contain.text', 'NOD-849 R10.3Meaningful content for AssSumm Testing')
    page
      .getRowData('riskOfHarmToThemselves', 'riskOfSuicideOrSelfHarm', 'Value')
      .should('contain.text', 'Immediate concerns about suicide and self-harm')
    page
      .getRowData('riskOfHarmToThemselves', 'copingInCustody', 'Value')
      .should(
        'contain.text',
        'Immediate concerns about coping in custody and previous concerns about coping in a hostel',
      )
    page
      .getRowData('riskOfHarmToThemselves', 'vulnerability', 'Value')
      .should('contain.text', 'Immediate concerns about a vulnerability')
    page.getRowData('riskFlags', 'risk1Description', 'Value').should('contain.text', 'Restraining Order')
    page.getRowData('riskFlags', 'risk2Description', 'Value').should('contain.text', 'Domestic Abuse Perpetrator')
    page.getRowData('riskFlags', 'risk3Description', 'Value').should('contain.text', 'Risk to Known Adult')
  })
  it('Removed risk page is rendered', () => {
    cy.visit('/case/X000001/risk/removed-risk-flags')
    const page = Page.verifyOnPage(RemovedRiskPage)
    page.getRowData('removedRisks', 'removedRisk1', 'Value').should('contain.text', 'Restraining Order')
    page.getRowData('removedRisks', 'removedRisk2', 'Value').should('contain.text', 'Domestic Abuse Perpetrator')
    page.getRowData('removedRisks', 'removedRisk3', 'Value').should('contain.text', 'Risk to Known Adult')
  })
  it('Removed Risk Detail page is rendered', () => {
    cy.visit('/case/X000001/risk/flag/4')
    const page = Page.verifyOnPage(RemovedRiskDetailPage)
    page.getRowData('riskFlagRemoved', 'removalDate', 'Value').should('contain.text', '18 November 2022 by Paul Smith')
    page.getRowData('riskFlagRemoved', 'removalNotes', 'Value').should('contain.text', 'Some removal notes')
    page.getCardHeader('riskFlag').should('contain.text', 'Before it was removed')
    page.getRowData('riskFlag', 'riskFlagNotes', 'Value').should('contain.text', 'Some notes')
    page
      .getRowData('riskFlag', 'mostRecentReviewDate', 'Value')
      .should('contain.text', '12 December 2023 by Paul Smith')
    page.getRowData('riskFlag', 'createdDate', 'Value').should('contain.text', '12 December 2023 by Paul Smith')
  })
  it('Risk Detail page is rendered', () => {
    cy.visit('/case/X000001/risk/flag/2')
    const page = Page.verifyOnPage(RiskDetailPage)
    page.getCardHeader('riskFlag').should('contain.text', 'About this flag')
    page.getRowData('riskFlag', 'riskFlagNotes', 'Value').should('contain.text', 'Some notes')
    page.getRowData('riskFlag', 'nextReviewDate', 'Value').should('contain.text', '18 August 2025')
    page
      .getRowData('riskFlag', 'mostRecentReviewDate', 'Value')
      .should('contain.text', '18 December 2023 by Paul Smith')
    page.getRowData('riskFlag', 'createdDate', 'Value').should('contain.text', '18 December 2022 by Paul Smith')
  })
})
