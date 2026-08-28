import { test, expect } from '../fixtures/IntegrationTest'

/**
 * Integration test for a native Contena Administration plugin installed
 * alongside the CLI-generated Meteor extension.
 */
test.describe('Generated Meteor Extension', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.route(
      '*/**/_action/update/check',
      async (route) => {
        await route.fulfill({ json: null })
      },
    )
  })

  test('native dashboard override is visible', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto(
      `${process.env.ADMIN_URL || 'http://localhost:8000/admin/'}#/ct/dashboard/index`,
    )

    await expect(
      authenticatedPage.locator('.ct-dashboard-index').first(),
    ).toBeVisible({ timeout: 10000 })

    await expect(
      authenticatedPage.getByTestId('meteor-native-dashboard-block'),
    ).toBeVisible({ timeout: 10000 })
  })
})
