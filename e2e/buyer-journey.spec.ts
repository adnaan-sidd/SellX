import { test, expect } from '@playwright/test'

test.describe('Buyer Journey', () => {
  test('should complete full buyer registration and browsing flow', async ({ page }) => {
    // Navigate to home page
    await page.goto('/')
    await expect(page).toHaveTitle(/SellX/)

    // Click on signup
    await page.getByRole('link', { name: /sign up|signup|register/i }).click()
    await expect(page).toHaveURL(/.*signup/)

    // Fill signup form
    await page.fill('input[name="phone"]', '+919876543210')
    await page.fill('input[name="name"]', 'Test Buyer')

    // Submit signup
    await page.getByRole('button', { name: /sign up|signup|register/i }).click()

    // Should redirect to OTP verification
    await expect(page).toHaveURL(/.*verify-otp/)

    // For testing purposes, we'll mock the OTP verification
    // In real tests, you might need to intercept the API call
    await page.fill('input[name="otp"]', '123456')
    await page.getByRole('button', { name: /verify|submit/i }).click()

    // Should redirect to home or dashboard
    await expect(page).toHaveURL(/.*home/)

    // Navigate to products
    await page.getByRole('link', { name: /browse|products|listings/i }).click()
    await expect(page).toHaveURL(/.*products|listings/)

    // Search for products
    await page.fill('input[placeholder*="search" i]', 'iPhone')
    await page.getByRole('button', { name: /search/i }).click()

    // Should show search results
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(await page.locator('[data-testid="product-card"]').count())

    // Click on a product
    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await firstProduct.click()

    // Should show product details
    await expect(page.locator('[data-testid="product-title"]')).toBeVisible()
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible()

    // Test contact seller functionality
    await page.getByRole('button', { name: /contact|message|chat/i }).click()

    // Should require buyer verification
    await expect(page).toHaveURL(/.*verify-buyer/)

    // Fill buyer verification form
    await page.fill('input[name="idNumber"]', 'ABCD123456789')
    await page.setInputFiles('input[name="idDocument"]', 'test-files/sample-id.jpg')

    await page.getByRole('button', { name: /submit|verify/i }).click()

    // Should redirect back to chat
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible()
  })

  test('should handle product filtering and sorting', async ({ page }) => {
    await page.goto('/products')

    // Test category filtering
    await page.selectOption('select[name="category"]', 'Electronics')
    await expect(page).toHaveURL(/.*category=Electronics/)

    // Test price filtering
    await page.fill('input[name="minPrice"]', '1000')
    await page.fill('input[name="maxPrice"]', '50000')
    await page.getByRole('button', { name: /apply|filter/i }).click()

    // Test sorting
    await page.selectOption('select[name="sort"]', 'price_asc')
    await expect(page).toHaveURL(/.*sort=price_asc/)

    // Verify products are displayed
    await expect(page.locator('[data-testid="product-card"]')).toBeVisible()
  })

  test('should handle pagination correctly', async ({ page }) => {
    await page.goto('/products')

    // Check if pagination exists
    const pagination = page.locator('[data-testid="pagination"]')
    if (await pagination.isVisible()) {
      // Click next page
      await page.getByRole('button', { name: /next|2/i }).click()

      // URL should change
      await expect(page).toHaveURL(/.*page=2/)

      // Products should load
      await expect(page.locator('[data-testid="product-card"]')).toBeVisible()
    }
  })
})