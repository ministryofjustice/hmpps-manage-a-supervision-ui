import Page, { PageElement } from './page'

export default class SentencePage extends Page {
  constructor() {
    super('Sentence')
  }

  activeSideNavItem = (): PageElement => cy.get('.moj-side-navigation__item--active a')

  noActiveSentence = (): PageElement => cy.get('[data-qa="no-active-sentence"]')
}
