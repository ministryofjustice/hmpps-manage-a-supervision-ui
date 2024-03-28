import Page, { PageElement } from './page'

export default class ActivityLogPage extends Page {
  constructor() {
    super('Activity log')
  }

  getActivity = (index: string): PageElement => cy.get(`[data-qa=timeline${index}Card]`)
}
