import { test, expect } from '@playwright/test';
import {
  collectErrors,
  expectAxeClean,
  expectFocusVisible,
  expectNoErrors,
  expectNoDocumentScroll,
  expectNoHorizontalOverflow,
  gotoHash,
  recordFinding,
  ctx,
  applyTheme,
} from './helpers';
import { TEMPLATE_ROUTES, THEMES, VIEWPORTS } from './routes';

/* -----------------------------------------------------------------------------
 *  Every template × screen × (admin layout × page) at 320/375/768/1280 × light/dark.
 *  Structure (one h1, a main landmark), overflow, axe, console, and a 15-stop
 *  keyboard walk where every stop is on-screen with a visible ring.
 * --------------------------------------------------------------------------- */

// Light at every breakpoint; dark at the two most-used (375, 1280) — the
// theme only changes colour tokens, so it does not need every layout.
const DARK_WIDTHS: number[] = [375, 1280];
for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
  const themes = DARK_WIDTHS.includes(viewport.width) ? THEMES : (['light'] as const);
  for (const theme of themes) {
    test.describe(`templates @${viewport.width} ${theme}`, () => {
      test.use({ viewport });

      for (const route of TEMPLATE_ROUTES) {
        test(route.name, async ({ page }, info) => {
          await applyTheme(page, theme);
          const errors = collectErrors(page);
          await gotoHash(page, route.hash);

          // Structure
          const h1s = await page.locator('h1').count();
          const mains = await page.locator('main, [role=main]').count();
          if (h1s !== 1 || mains < 1) {
            recordFinding(info, { ...ctx(page, theme), kind: 'structure', detail: { h1s, mains } });
          }
          expect.soft(h1s, 'exactly one <h1>').toBe(1);
          expect.soft(mains, 'a <main> landmark').toBeGreaterThanOrEqual(1);

          await expectNoHorizontalOverflow(page, theme, info);
          if (route.shell === 'app') await expectNoDocumentScroll(page, theme, info);
          await expectAxeClean(page, theme, info);
          await expectFocusVisible(page, theme, info, 15);
          await expectNoErrors(page, errors, theme, info);
          void vpName;
        });
      }
    });
  }
}
