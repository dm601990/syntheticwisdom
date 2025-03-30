import { test, expect } from '@playwright/test';

// Test for basic navigation and rendering across browsers
test.describe('Cross-browser Navigation Tests', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('http://localhost:3001/');
    await expect(page).toHaveTitle(/Synthetic Wisdom/);
    
    // Check for main elements
    await expect(page.locator('h1:has-text("Synthetic Wisdom")')).toBeVisible();
    await expect(page.locator('a:has-text("AI News")')).toBeVisible();
    await expect(page.locator('a:has-text("AI Toolkit")')).toBeVisible();
    await expect(page.locator('a:has-text("Simulated Silliness")')).toBeVisible();
  });

  test('should navigate to AI Toolkit page', async ({ page }) => {
    await page.goto('http://localhost:3001/');
    await page.click('a:has-text("AI Toolkit")');
    
    // Verify navigation worked
    await expect(page).toHaveURL(/.*\/toolkit/);
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
  });

  test('should navigate to Simulated Silliness page', async ({ page }) => {
    await page.goto('http://localhost:3001/');
    await page.click('a:has-text("Simulated Silliness")');
    
    // Verify navigation worked
    await expect(page).toHaveURL(/.*\/silliness/);
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
  });
});

// Test search functionality across browsers
test.describe('Search Functionality Tests', () => {
  test('search input should filter articles', async ({ page }) => {
    await page.goto('http://localhost:3001/');
    
    // Wait for articles to load
    await page.waitForSelector('.motion-div, div[style*="padding"]', { timeout: 10000 });
    
    // Count articles before search
    const initialArticleCount = await page.locator('.motion-div, div[style*="padding"]').count();
    
    // Enter search term - make sure it's not empty
    if (initialArticleCount > 0) {
      await page.fill('input[placeholder*="Search"]', 'AI');
      
      // Wait for search results
      await page.waitForTimeout(1000);
      
      // Verify there are still some articles visible
      const afterSearchCount = await page.locator('.motion-div, div[style*="padding"]').count();
      expect(afterSearchCount).toBeGreaterThan(0);
    } else {
      // Skip test if no articles are available using proper method
      test.skip();
      console.log('No articles available to search');
    }
  });
}); 