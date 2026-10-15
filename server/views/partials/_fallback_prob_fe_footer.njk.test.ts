import * as cheerio from 'cheerio'
import { createNunjucksTestEnv } from '../../testutils/nunjucksTestEnv'

const render = (input: Record<string, unknown>) => {
  const env = createNunjucksTestEnv()
  return env.render('partials/_fallback_prob_fe_footer.njk', input)
}

describe('partials/_fallback_prob_fe_footer.njk', () => {
  it('renders dev links for dev environment', () => {
    const html = render({ environmentName: 'DEV' })
    const $ = cheerio.load(html)

    expect($('a').eq(0).attr('href')).toBe(
      'https://probation-frontend-components-dev.hmpps.service.justice.gov.uk/accessibility',
    )
  })

  it('renders preprod links for pre-prod environment', () => {
    const html = render({ environmentName: 'PRE-PRODUCTION' })
    const $ = cheerio.load(html)

    expect($('a').eq(0).attr('href')).toBe(
      'https://probation-frontend-components-preprod.hmpps.service.justice.gov.uk/accessibility',
    )
  })

  it('renders prod links for prod environment', () => {
    const html = render({ environmentName: 'PRODUCTION' })
    const $ = cheerio.load(html)

    expect($('a').eq(0).attr('href')).toBe(
      'https://probation-frontend-components.hmpps.service.justice.gov.uk/accessibility',
    )
  })
})
