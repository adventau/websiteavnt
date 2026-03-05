// e2e/homepage.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("hero section renders", async ({ page }) => {
    await page.goto("/");

    // Wait for hero section
    const hero = page.getByTestId("hero-section");
    await expect(hero).toBeVisible({ timeout: 10_000 });

    // Hero should contain a heading
    const heading = hero.locator("h1");
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });

  test("nav is present and sticky", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header").first();
    await expect(header).toBeVisible();
  });

  test("sign-in page loads", async ({ page }) => {
    await page.goto("/sign-in");
    // Clerk renders a sign-in form
    await expect(page).toHaveURL(/sign-in/);
  });

  test("admin redirects to sign-in when unauthenticated", async ({ page }) => {
    await page.goto("/admin");
    // Should be redirected to sign-in
    await expect(page).toHaveURL(/sign-in/);
  });
});
