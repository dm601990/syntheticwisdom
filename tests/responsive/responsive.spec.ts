import { test, expect } from '@playwright/test';

// Test for responsive design on mobile devices
test.describe('Responsive Design Tests', () => {
  test('homepage should be properly responsive on mobile', async ({ page }) => {
    // Mobile viewport test
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.goto('http://localhost:3001/');
    
    // Header should be visible and properly sized
    const headerTitle = page.locator('h1:has-text("Synthetic Wisdom")');
    await expect(headerTitle).toBeVisible();
    
    // Navigation elements should be properly displayed
    const navItems = page.locator('nav a');
    await expect(navItems).toHaveCount(3);
    
    // Search bar should be visible and properly sized
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();
    
    // Search input should take appropriate width
    const searchInputBox = await searchInput.boundingBox();
    if (searchInputBox) {
      expect(searchInputBox.width).toBeGreaterThan(200);
      expect(searchInputBox.width).toBeLessThanOrEqual(375); // Should be less than or equal to viewport
    } else {
      test.fail(true, 'Search input box not found');
    }
    
    // News cards should stack vertically and fit width
    // Wait for news cards to be visible
    await page.waitForSelector('.motion-div, div[style*="padding"]');
    const newsCards = page.locator('.motion-div, div[style*="padding"]').first();
    await expect(newsCards).toBeVisible({ timeout: 10000 });
    
    // Check that card is properly sized for mobile
    const cardBox = await newsCards.boundingBox();
    if (cardBox) {
      expect(cardBox.width).toBeGreaterThan(200);
      expect(cardBox.width).toBeLessThanOrEqual(375); // Allow full-width cards
    } else {
      test.fail(true, 'Card box not found');
    }
  });
  
  test('toolkit page should be properly responsive on tablet', async ({ page }) => {
    // Tablet viewport test
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
    await page.goto('http://localhost:3001/toolkit');
    
    // Basic checks - verify the page loads and has expected title
    await expect(page).toHaveURL(/.*\/toolkit/);
    
    // Verify the page title is visible
    const title = page.locator('h1');
    await expect(title).toBeVisible();
    
    // Verify navigation is present
    const navItems = page.locator('nav a');
    await expect(navItems).toHaveCount(3);
    
    // Verify the search input is present
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();
    
    // Take screenshot to verify the page loads properly
    await page.screenshot({ path: 'toolkit-tablet.png' });
  });
}); 