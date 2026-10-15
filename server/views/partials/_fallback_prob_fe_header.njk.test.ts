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

  it('renders dev links for dev environment', () => {
    const html = render({ environmentName: 'DEV' })
    const $ = cheerio.load(html)

    expect($('a').eq(1).attr('href')).toBe('https://sign-in-dev.hmpps.service.justice.gov.uk/auth/account-details')
    expect($('a').eq(3).attr('href')).toBe('https://sign-in-dev.hmpps.service.justice.gov.uk/auth/account-details')
    expect($('a').eq(4).attr('href')).toBe(
      'https://probation-frontend-components-dev.hmpps.service.justice.gov.uk/services',
    )
    expect($('a').eq(5).attr('href')).toBe('https://approved-premises-dev.hmpps.service.justice.gov.uk')
    expect($('a').eq(6).attr('href')).toBe('https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk')
    expect($('a').eq(7).attr('href')).toBe('https://ndelius.test.probation.service.justice.gov.uk')
    expect($('a').eq(8).attr('href')).toBe('https://t2.oasys.service.justice.gov.uk')
    expect($('a').eq(9).attr('href')).toBe(
      'https://hmpps-interventions-ui-dev.apps.live-1.cloud-platform.service.justice.gov.uk',
    )
    expect($('a').eq(10).attr('href')).toBe('https://transitional-accommodation-dev.hmpps.service.justice.gov.uk')
    expect($('a').eq(11).attr('href')).toBe('https://workload-measurement-dev.hmpps.service.justice.gov.uk')
  })

  it('renders preprod links for pre-prod environment', () => {
    const html = render({ environmentName: 'PRE-PRODUCTION' })
    const $ = cheerio.load(html)

    expect($('a').eq(1).attr('href')).toBe('https://sign-in-preprod.hmpps.service.justice.gov.uk/auth/account-details')
    expect($('a').eq(3).attr('href')).toBe('https://sign-in-preprod.hmpps.service.justice.gov.uk/auth/account-details')
    expect($('a').eq(4).attr('href')).toBe(
      'https://probation-frontend-components-preprod.hmpps.service.justice.gov.uk/services',
    )
    expect($('a').eq(5).attr('href')).toBe('https://approved-premises-preprod.hmpps.service.justice.gov.uk')
    expect($('a').eq(6).attr('href')).toBe('https://manage-people-on-probation-preprod.hmpps.service.justice.gov.uk')
    expect($('a').eq(7).attr('href')).toBe('https://ndelius.pre-prod.probation.service.justice.gov.uk')
    expect($('a').eq(8).attr('href')).toBe('https://pp-int.oasys.service.justice.gov.uk')
    expect($('a').eq(9).attr('href')).toBe(
      'https://hmpps-interventions-ui-preprod.apps.live-1.cloud-platform.service.justice.gov.uk',
    )
    expect($('a').eq(10).attr('href')).toBe('https://transitional-accommodation-preprod.hmpps.service.justice.gov.uk')
    expect($('a').eq(11).attr('href')).toBe('https://workload-measurement-preprod.hmpps.service.justice.gov.uk')
  })

  it('renders prod links for prod environment', () => {
    const html = render({ environmentName: 'PRODUCTION' })
    const $ = cheerio.load(html)

    expect($('a').eq(1).attr('href')).toBe('https://sign-in.hmpps.service.justice.gov.uk/auth/account-details')
    expect($('a').eq(3).attr('href')).toBe('https://sign-in.hmpps.service.justice.gov.uk/auth/account-details')
    expect($('a').eq(4).attr('href')).toBe(
      'https://probation-frontend-components.hmpps.service.justice.gov.uk/services',
    )
    expect($('a').eq(5).attr('href')).toBe('https://approved-premises.hmpps.service.justice.gov.uk')
    expect($('a').eq(6).attr('href')).toBe('https://manage-people-on-probation.hmpps.service.justice.gov.uk')
    expect($('a').eq(7).attr('href')).toBe('https://ndelius.probation.service.justice.gov.uk')
    expect($('a').eq(8).attr('href')).toBe('https://int.oasys.service.justice.gov.uk')
    expect($('a').eq(9).attr('href')).toBe(
      'https://hmpps-interventions-ui.apps.live-1.cloud-platform.service.justice.gov.uk',
    )
    expect($('a').eq(10).attr('href')).toBe('https://transitional-accommodation.hmpps.service.justice.gov.uk')
    expect($('a').eq(11).attr('href')).toBe('https://workload-measurement.hmpps.service.justice.gov.uk')
  })
})
