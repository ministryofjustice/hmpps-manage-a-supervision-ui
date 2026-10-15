import * as cheerio from 'cheerio'
import { createNunjucksTestEnv } from '../../testutils/nunjucksTestEnv'

const render = (input: Record<string, unknown>) => {
  const env = createNunjucksTestEnv()
  return env.render('partials/_fallback_prob_fe_header.njk', input)
}

describe('partials/_fallback_prob_fe_header.njk', () => {
  it('renders the dev tag if dev environment', () => {
    const html = render({ environmentName: 'DEV', environmentNameColour: '' })
    const $ = cheerio.load(html)

    expect($('.govuk-tag').text().trim()).toBe('DEV')
  })

  it('renders the preprod tag if pre-production environment', () => {
    const html = render({ environmentName: 'PRE-PRODUCTION', environmentNameColour: 'govuk_tag--green' })
    const $ = cheerio.load(html)

    expect($('.govuk-tag.govuk_tag--green').length).toBe(1)
    expect($('.govuk-tag.govuk_tag--green').text().trim()).toBe('PRE-PRODUCTION')
  })

  it('no tag appears if prod environment', () => {
    const html = render({ environmentName: 'PRODUCTION', environmentNameColour: '' })
    const $ = cheerio.load(html)

    expect($('.govuk-tag').length).toBe(0)
  })
})
