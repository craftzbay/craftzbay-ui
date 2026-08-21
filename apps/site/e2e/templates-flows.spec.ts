import { test, expect, type Locator, type Page } from '@playwright/test';
import { gotoHash, applyTheme } from './helpers';
import { VIEWPORTS } from './routes';

/* -----------------------------------------------------------------------------
 *  Cross-template flows: auth validation + demo outcomes, deep links and
 *  not-found states, legacy redirects, mobile nav sheets, ⌘K in the docs.
 * --------------------------------------------------------------------------- */

test.describe('auth › sign in', () => {
  test.use({ viewport: VIEWPORTS.lg });

  test('blur validation, submit summary, error demo and success path', async ({ page }) => {
    await applyTheme(page, 'light');
    await gotoHash(page, 'preview/auth/signin');
    const email = page.getByLabel('Email', { exact: true });
    const password = page.getByLabel('Password', { exact: true });
    const submit = page.getByRole('button', { name: /^Sign in$/ });

    // Blur an empty field → inline error wired via aria-describedby.
    await email.focus();
    await email.blur();
    await expect(page.getByText('Enter your email address.')).toBeVisible();
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    const describedBy = await email.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`[id="${describedBy!.split(' ')[0]}"]`)).toContainText(
      'Enter your email address.',
    );

    // Submit with both fields empty → summary alert listing the fields.
    await submit.click();
    const summary = page.getByRole('alert').filter({ hasText: /Fix 2 fields/ });
    await expect(summary).toBeVisible();

    // Valid input succeeds after the demo delay.
    await email.fill('ada@example.com');
    await password.fill('correct horse battery');
    await submit.click();
    await expect(page.getByText(/Signed in — this is a demo/)).toBeVisible({ timeout: 5_000 });
  });

  test('?demo=error renders the server-error alert', async ({ page }) => {
    await applyTheme(page, 'light');
    await gotoHash(page, 'preview/auth/signin?demo=error');
    await page.getByLabel('Email', { exact: true }).fill('ada@example.com');
    await page.getByLabel('Password', { exact: true }).fill('correct horse battery');
    await page.getByRole('button', { name: /^Sign in$/ }).click();
    await expect(page.getByRole('alert').filter({ hasText: /don't match/ })).toBeVisible({
      timeout: 5_000,
    });
  });
});

test.describe('deep links + not-found', () => {
  test.use({ viewport: VIEWPORTS.lg });

  test('ecommerce product ?id= opens that product; unknown id shows not-found', async ({
    page,
  }) => {
    await applyTheme(page, 'light');
    await gotoHash(page, 'preview/ecommerce/product?id=lumen');
    await expect(page.getByRole('heading', { level: 1, name: 'Lumen Desk Lamp' })).toBeVisible();

    await gotoHash(page, 'preview/ecommerce/product?id=does-not-exist');
    await expect(page.getByText('Product not found')).toBeVisible();
    await page.getByRole('button', { name: 'Back to shop' }).first().click();
    await expect(page.getByRole('heading', { level: 1, name: 'New arrivals' })).toBeVisible();
  });

  test('news article ?id= opens that story; unknown id shows not-found', async ({ page }) => {
    await applyTheme(page, 'light');
    await gotoHash(page, 'preview/news/article?id=markets-pause');
    await expect(page.locator('article h1, main h1').first()).toBeVisible();
    await expect(page).toHaveURL(/id=markets-pause/);

    await gotoHash(page, 'preview/news/article?id=nope');
    await expect(page.getByRole('heading', { level: 1, name: 'Story not found' })).toBeVisible();
    await page.getByRole('button', { name: 'Back to front page' }).click();
    await expect(page).not.toHaveURL(/id=nope/);
  });

  test('legacy #dashboard redirects into the admin preview', async ({ page }) => {
    await applyTheme(page, 'light');
    await gotoHash(page, 'dashboard');
    // The router maps the legacy hash to the admin preview (the address bar
    // keeps `#dashboard`; the template only rewrites `#preview/…` hashes).
    await expect(page.getByRole('heading', { level: 1, name: 'Overview' })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Template: Admin dashboard/ })).toBeVisible();
  });

  test('legacy #settings and #auth-signup resolve', async ({ page }) => {
    await applyTheme(page, 'light');
    await gotoHash(page, 'settings');
    await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();
    await gotoHash(page, 'auth-signup');
    await expect(page.getByRole('heading', { level: 1, name: /Create|Sign up/ })).toBeVisible();
  });
});

/** Tab through `n` stops and assert focus stays inside `scope`. */
async function expectFocusTrapped(page: Page, scope: Locator, n = 12) {
  for (let i = 0; i < n; i++) {
    await page.keyboard.press('Tab');
    const inside = await scope.evaluate((el) => el.contains(document.activeElement));
    expect(inside, `Tab #${i + 1} left the dialog`).toBe(true);
  }
}

test.describe('mobile nav sheets @375', () => {
  test.use({ viewport: VIEWPORTS.sm });

  for (const [name, hash, trigger] of [
    ['landing', 'preview/landing/home', 'Open menu'],
    ['ecommerce', 'preview/ecommerce/shop', 'Open menu'],
    ['news', 'preview/news/home', 'Menu'],
  ] as const) {
    test(`${name}: sheet opens, traps focus, closes on Escape`, async ({ page }) => {
      await applyTheme(page, 'light');
      await gotoHash(page, hash);
      const btn = page.getByRole('button', { name: trigger, exact: true });
      await expect(btn).toBeVisible();
      await btn.click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await expectFocusTrapped(page, dialog);
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(btn).toBeFocused();
    });
  }
});

test.describe('docs command palette', () => {
  test.use({ viewport: VIEWPORTS.lg });

  test('⌘K / Ctrl+K opens the palette and navigates', async ({ page }) => {
    await applyTheme(page, 'light');
    await gotoHash(page, 'components/button');
    await page.keyboard.press('ControlOrMeta+k');
    const input = page.getByPlaceholder(/Jump to component/);
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();

    await input.fill('Dialog');
    await page
      .getByRole('option', { name: /^Dialog/ })
      .first()
      .click();
    await expect(page).toHaveURL(/#components\/dialog/);
    await expect(input).toBeHidden();
  });
});
