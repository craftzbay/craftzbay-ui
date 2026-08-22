import { test, expect } from '@playwright/test';
import {
  collectErrors,
  expectAxeClean,
  expectNoErrors,
  expectNoHorizontalOverflow,
  gotoHash,
} from './helpers';
import { TEMPLATE_ROUTES } from './routes';

/* -----------------------------------------------------------------------------
 *  Mongolian locale (`?lang=mn`) — every template route at 1280 and 375:
 *  <html lang="mn">, no console errors, no overflow (Cyrillic runs ~15% longer),
 *  axe clean, and the page actually switched (Cyrillic present, and none of the
 *  English chrome words that every template shares survive).
 * --------------------------------------------------------------------------- */

const CYRILLIC = /[Ѐ-ӿ]/;
// English words that appear in every template's chrome; none may survive in MN.
// Matched as standalone labels (whole line), so demo proper nouns such as the
// project "Search revamp" don't count.
const LEFTOVER =
  /^(Sign in|Sign up|Search|Settings|Overview|Add to cart|Subscribe|Loading|Projects|Dashboard)$/m;

for (const viewport of [
  { width: 1280, height: 800 },
  { width: 375, height: 740 },
]) {
  test.describe(`i18n mn @${viewport.width}`, () => {
    test.use({ viewport });
    for (const route of TEMPLATE_ROUTES) {
      test(route.name, async ({ page }, info) => {
        const errors = collectErrors(page);
        await gotoHash(page, `${route.hash}?lang=mn`);
        await expect(page.locator('html')).toHaveAttribute('lang', 'mn');
        const text = await page.locator('body').innerText();
        expect(text, 'page should render Cyrillic copy').toMatch(CYRILLIC);
        const leftover = text.match(LEFTOVER);
        expect(leftover, `English chrome leaked: ${leftover?.[0]}`).toBeNull();
        await expectNoHorizontalOverflow(page, 'light', info);
        await expectAxeClean(page, 'light', info);
        await expectNoErrors(page, errors, 'light', info);
      });
    }
  });
}
