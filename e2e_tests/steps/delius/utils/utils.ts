import { Page } from '@playwright/test'
import { DateTime } from 'luxon'

export const retryOnError = async <T>(
  fn: (page: Page) => Promise<T>,
  page: Page,
  retryOnErrorPage = true,
): Promise<T> => {
  try {
    return await fn(page)
  } catch (error) {
    if (retryOnErrorPage && (await page.title()) === 'Error Page') {
      return fn(page)
    }
    throw error
  }
}

export const formatDate = date => DateTime.fromJSDate(date).toFormat('d MMMM yyyy')
