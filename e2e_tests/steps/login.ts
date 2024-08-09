import { expect, type Page } from '@playwright/test'

export const login = async (page: Page) => {
  await page.goto(process.env.MANAGE_A_SUPERVISION_URL)
  await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
  await page.fill('#username', process.env.DELIUS_USERNAME!)
  await page.fill('#password', process.env.DELIUS_PASSWORD!)
  await page.click('#submit')
  await expect(page).toHaveTitle('Your cases')
}
