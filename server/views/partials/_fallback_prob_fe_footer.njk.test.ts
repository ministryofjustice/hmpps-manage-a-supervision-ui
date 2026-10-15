import * as cheerio from 'cheerio'
import { createNunjucksTestEnv } from '../../testutils/nunjucksTestEnv'

const render = (input: Record<string, unknown>) => {
  const env = createNunjucksTestEnv()
  return env.render('partials/_fallback_prob_fe_footer.njk', input)
}

describe('partials/_fallback_prob_fe_footer.njk', () => {
  it('renders dev links for dev environment', () => {
    const html = render({
      frontendComponentsUrl: 'https://probation-frontend-components-dev.hmpps.service.justice.gov.uk',
    })
    const $ = cheerio.load(html)

    expect($('a').eq(0).attr('href')).toBe(
      'https://probation-frontend-components-dev.hmpps.service.justice.gov.uk/accessibility',
    )
  })
})
