import { test, expect } from '@playwright/test';
import {
  collectErrors,
  expectAxeClean,
  expectNoErrors,
  expectNoHorizontalOverflow,
  gotoHash,
  applyTheme,
} from './helpers';
import { COMPONENT_SLUGS, DOC_PAGES, GUIDE_SLUGS, THEMES, VIEWPORTS } from './routes';

/* -----------------------------------------------------------------------------
 *  Every docs page (home, indexes, component docs, guides, template docs) at
 *  desktop + mobile, light + dark: loads, error-free, no horizontal overflow,
 *  axe serious/critical = 0.
 * --------------------------------------------------------------------------- */

test.describe('route inventory matches the live registries', () => {
  test('components index lists exactly the slugs under test', async ({ page }) => {
    await gotoHash(page, 'components');
    const hrefs = await page
      .locator('main a[href^="#components/"]')
      .evaluateAll((as) =>
        Array.from(
          new Set(
            as.map((a) =>
              (a as HTMLAnchorElement).getAttribute('href')!.replace('#components/', ''),
            ),
          ),
        ).sort(),
      );
    expect(hrefs).toEqual([...COMPONENT_SLUGS].sort());
  });

  test('guides index lists exactly the slugs under test', async ({ page }) => {
    await gotoHash(page, 'guides');
    const hrefs = await page
      .locator('main a[href^="#guides/"]')
      .evaluateAll((as) =>
        Array.from(
          new Set(
            as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!.replace('#guides/', '')),
          ),
        ).sort(),
      );
    expect(hrefs).toEqual([...GUIDE_SLUGS].sort());
  });
});

// Dark is checked at desktop only; mobile adds layout coverage, not colour.
for (const [vpName, viewport, themes] of [
  ['1280', VIEWPORTS.lg, THEMES],
  ['375', VIEWPORTS.sm, ['light']],
] as const) {
  for (const theme of themes) {
    test.describe(`docs @${vpName} ${theme}`, () => {
      test.use({ viewport });

      for (const route of DOC_PAGES) {
        test(route.name, async ({ page }, info) => {
          await applyTheme(page, theme);
          const errors = collectErrors(page);
          await gotoHash(page, route.hash);

          await expect(page.locator('h1').first()).toBeVisible();
          expect(
            await page
              .locator('html')
              .evaluate((el, t) => el.classList.contains('dark') === (t === 'dark'), theme),
            `html.dark matches ${theme}`,
          ).toBe(true);

          await expectNoHorizontalOverflow(page, theme, info);
          await expectAxeClean(page, theme, info);
          await expectNoErrors(page, errors, theme, info);
        });
      }
    });
  }
}
