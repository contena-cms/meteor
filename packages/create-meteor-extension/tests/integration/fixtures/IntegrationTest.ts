import { test as base } from '@playwright/test'
import type { Page } from '@playwright/test'
import { loginToContena } from '../helpers/login'

/**
 * Extend Playwright test with custom fixtures for Contena integration tests
 */
export const test = base.extend<{
  authenticatedPage: Page
}>({
  authenticatedPage: async ({ page }, use) => {
    await loginToContena(page)
    await use(page)
  },
})

export { expect } from '@playwright/test'
