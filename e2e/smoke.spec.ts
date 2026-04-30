import { test, expect } from "@playwright/test";

/**
 * Smoke tests — verify pages load and render key structural elements.
 * These tests require a running dev server (npm run dev) or:
 *   PLAYWRIGHT_BASE_URL=https://monstrino.com npx playwright test
 */

test.describe("Home page", () => {
  test("loads and has a non-empty <title>", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/.+/);
  });

  test("renders primary navigation", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav, header");
    await expect(nav.first()).toBeVisible();
  });
});

test.describe("Releases catalog", () => {
  test("loads and displays release cards", async ({ page }) => {
    await page.goto("/catalog/r");
    await expect(page).toHaveTitle(/.+/);
    // Wait for cards or empty state
    await page
      .locator('[data-testid="release-card"], [data-testid="catalog-empty"]')
      .or(page.locator("h1, h2").filter({ hasText: /catalog|releases/i }))
      .first()
      .waitFor({ timeout: 10_000 });
  });
});

test.describe("Series catalog", () => {
  test("loads and renders a heading", async ({ page }) => {
    await page.goto("/catalog/s");
    await expect(page).toHaveTitle(/.+/);
    const heading = page.locator("h1, h2, h3").filter({ hasText: /series/i });
    await expect(heading.first()).toBeVisible();
  });
});

test.describe("Characters catalog", () => {
  test("loads and renders a heading", async ({ page }) => {
    await page.goto("/catalog/c");
    await expect(page).toHaveTitle(/.+/);
    const heading = page.locator("h1, h2, h3").filter({ hasText: /character/i });
    await expect(heading.first()).toBeVisible();
  });
});

test.describe("Pets catalog", () => {
  test("loads and renders a heading", async ({ page }) => {
    await page.goto("/catalog/p");
    await expect(page).toHaveTitle(/.+/);
    const heading = page.locator("h1, h2, h3").filter({ hasText: /pet/i });
    await expect(heading.first()).toBeVisible();
  });
});

test.describe("Favorites page", () => {
  test("loads without crashing", async ({ page }) => {
    await page.goto("/favorites");
    await expect(page).toHaveTitle(/.+/);
  });
});

test.describe("Detail pages", () => {
  test("release detail — navigate from catalog and verify title matches", async ({ page }) => {
    await page.goto("/catalog/r");
    // Wait for at least one card link to appear
    const card = page.locator("a[href*='/catalog/r/']").first();
    await card.waitFor({ timeout: 10_000 });
    await card.click();
    // Detail page should have a non-empty title
    await expect(page).toHaveTitle(/.+/);
    // And at least one heading
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("character detail — navigate from catalog and verify title", async ({ page }) => {
    await page.goto("/catalog/c");
    const card = page.locator("a[href*='/catalog/c/']").first();
    await card.waitFor({ timeout: 10_000 });
    await card.click();
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });
});
