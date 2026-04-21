const { test, expect } = require("@playwright/test");

test.describe("OnyxAI landing page", () => {
  test("desktop homepage renders core sections, SEO metadata, and waitlist states", async ({ page, request }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/OnyxAI/i);
    await expect(page.locator("h1")).toHaveText(/AI memory assistant/i);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /AI memory assistant/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://onyxai.lol/");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://onyxai.lol/");
    await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute(
      "content",
      /OnyxAI brand card/i
    );
    await expect(page.getByRole("link", { name: "Join Waitlist" }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /How It Works/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /What It Feels Like/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /What this first version says clearly/i })).toBeVisible();

    const form = page.locator("[data-waitlist-form]");
    const emailInput = form.getByLabel("Email address");
    const message = form.locator("[data-form-message]");

    await form.getByRole("button", { name: "Join Waitlist" }).click();
    await expect(message).toHaveText("Enter an email to preview the waitlist flow.");

    await emailInput.fill("wrong-email");
    await form.getByRole("button", { name: "Join Waitlist" }).click();
    await expect(message).toHaveText("Use a valid email address.");

    await emailInput.fill("founder@onyxai.lol");
    await form.getByRole("button", { name: "Join Waitlist" }).click();
    await expect(message).toHaveText("Waitlist opening soon. This demo page does not store your address yet.");

    await page.getByRole("link", { name: "See How It Works" }).click();
    await expect(page.locator("#how-it-works")).toBeInViewport();

    const faviconResponse = await request.get("/assets/brand/favicon.png");
    const manifestResponse = await request.get("/site.webmanifest");
    const markResponse = await request.get("/assets/brand/logo-mark.svg");
    const robotsResponse = await request.get("/robots.txt");
    const sitemapResponse = await request.get("/sitemap.xml");
    const manifest = await manifestResponse.json();
    const robotsText = await robotsResponse.text();
    const sitemapText = await sitemapResponse.text();
    const jsonLdTexts = await page.locator('script[type="application/ld+json"]').allTextContents();

    expect(faviconResponse.ok()).toBe(true);
    expect(manifestResponse.ok()).toBe(true);
    expect(markResponse.ok()).toBe(true);
    expect(robotsResponse.ok()).toBe(true);
    expect(sitemapResponse.ok()).toBe(true);
    expect(manifest.scope).toBe("/");
    expect(robotsText).toContain("Sitemap: https://onyxai.lol/sitemap.xml");
    expect(sitemapText).toContain("<lastmod>2026-04-21</lastmod>");

    const jsonLd = jsonLdTexts.map((text) => JSON.parse(text));
    expect(jsonLd.some((entry) => entry["@type"] === "Organization")).toBe(true);
    expect(jsonLd.some((entry) => entry["@type"] === "FAQPage")).toBe(true);
  });

  test("mobile layout stays inside viewport and keeps navigation usable", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true
    });
    const page = await context.newPage();

    await page.goto("/");

    await expect(page.getByRole("img", { name: "OnyxAI" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Join Waitlist" }).first()).toBeVisible();
    await page.getByRole("link", { name: "Waitlist", exact: true }).click();
    await expect(page.locator("#waitlist")).toBeInViewport();

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth - window.innerWidth;
    });

    expect(overflow).toBeLessThanOrEqual(1);
    await context.close();
  });
});
