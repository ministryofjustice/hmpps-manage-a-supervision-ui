import Page from '../pages/page'
import RiskPage from '../pages/risk'
import RemovedRiskPage from '../pages/removedRisk'
import RemovedRiskDetailPage from '../pages/removedRiskDetail'
import RiskDetailPage from '../pages/riskDetail'

context('Risk', () => {
  it('Risk overview page is rendered', () => {
    cy.visit('/case/X000001/risk')
    const page = Page.verifyOnPage(RiskPage)
    page.getElementData('severeScoringNeedsLabel').should('contain.text', 'Severe-scoring areas from the assessment')
    page.getElementData('severeScoringNeedsValue').should('contain.text', 'Relationships')
    page
      .getElementData('standardScoringNeedsLabel')
      .should('contain.text', 'Standard-scoring areas from the assessment')
    page.getElementData('standardScoringNeedsValue').should('contain.text', 'Accommodation')
    page.getElementData('noScoreNeedsLabel').should('contain.text', 'Areas without a need score')
    page.getElementData('noScoreNeedsValue').should('contain.text', 'Emotional wellbeing')
    page.getElementData('mappa-heading').should('contain.text', 'Cat 0/Level 2')
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
