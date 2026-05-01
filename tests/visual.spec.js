import { test, expect } from '@playwright/test';

const scenarios = [
  // viewport screenshots (paged mode — content is clipped to columns)
  { label: "Paged",                    url: "/tests/base.html" },
  { label: "Paged RTL",                url: "/tests/base-rtl.html" },
  { label: "Paged vertical",           url: "/tests/base-vertical.html" },
  { label: "1 column",                 url: "/tests/cols-1.html" },
  { label: "2 columns",                url: "/tests/cols-2.html"},
  { label: "3 columns",                url: "/tests/cols-3.html" },
  { label: "Line length",              url: "/tests/line-length.html" },
  { label: "Scroll",                   url: "/tests/scroll.html",                  fullPage: true },
  { label: "Scroll vertical",          url: "/tests/scroll-vertical.html",         fullPage: true },
  { label: "Scroll padding",           url: "/tests/scroll-padding.html",          fullPage: true },
  { label: "Default colors",           url: "/tests/default-colors.html",          fullPage: true },
  { label: "Default custom colors",    url: "/tests/default-custom-colors.html",   fullPage: true },
  { label: "Theming",                  url: "/tests/theming.html",                 fullPage: true },
  { label: "Font family",              url: "/tests/font-family.html",             fullPage: true },
  { label: "Font size",                url: "/tests/font-size.html",               fullPage: true },
  { label: "Font size deprecated",     url: "/tests/font-size-deprecated.html",    fullPage: true },
  { label: "Font size normalize",      url: "/tests/font-size-normalize.html",     fullPage: true },
  { label: "Type scale",               url: "/tests/type-scale.html",              fullPage: true },
  { label: "Text align",               url: "/tests/text-align.html",              fullPage: true },
  { label: "Hyphens",                  url: "/tests/hyphens.html",                 fullPage: true },
  { label: "Line height",              url: "/tests/line-height.html",             fullPage: true },
  { label: "Para spacing",             url: "/tests/para-spacing.html",            fullPage: true },
  { label: "Para spacing vertical",    url: "/tests/para-spacing-vertical.html",   fullPage: true },
  { label: "Word spacing",             url: "/tests/word-spacing.html",            fullPage: true },
  { label: "Letter spacing",           url: "/tests/letter-spacing.html",          fullPage: true },
  { label: "Letter spacing CJK",       url: "/tests/letter-spacing-cjk.html",      fullPage: true },
  { label: "Ligatures",                url: "/tests/arabic-ligatures.html",        fullPage: true },
  { label: "Accessibility normalize",  url: "/tests/a11y-normalize.html",          fullPage: true },
  { label: "Accessibility custom",     url: "/tests/a11y-custom.html",             fullPage: true },
  { label: "No ruby",                  url: "/tests/no-ruby.html",                 fullPage: true },
  { label: "Font optical sizing",      url: "/tests/font-optical-sizing.html",     fullPage: true },
  { label: "Font weight",              url: "/tests/font-weight.html",             fullPage: true },
  { label: "Font width keyword",       url: "/tests/font-width-keyword.html",      fullPage: true },
  { label: "Font width percentage",    url: "/tests/font-width-percentage.html",   fullPage: true },
  { label: "Blend filter",             url: "/tests/blend-filter.html",            fullPage: true },
  { label: "Darken filter",            url: "/tests/darken-filter.html",           fullPage: true },
  { label: "Invert filter",            url: "/tests/invert-filter.html",           fullPage: true },
];

for (const { label, url, fullPage = false } of scenarios) {
  test(label, async ({ page }) => {
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const name = url.split("/").pop().replace(".html", "");

    if (fullPage) {
      // ReadiumCSS scroll mode sets overflow:auto on :root (html) and
      // overflow:clip on body, making html the scroll container rather than
      // the window. Playwright's fullPage scrolls the window, so it captures
      // only the viewport. We expand the viewport to the full content size instead.
      const { scrollWidth, scrollHeight } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
      }));
      await page.setViewportSize({ width: scrollWidth, height: scrollHeight });
    }

    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: false,
      maxDiffPixelRatio: 0.001,
    });
  });
}
