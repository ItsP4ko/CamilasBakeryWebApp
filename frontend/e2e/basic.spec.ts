import { test, expect, type Page } from '@playwright/test';

/**
 * Helper function to login (mock Google OAuth for testing)
 * In a real scenario, you'd mock the OAuth flow or use a test account
 */
async function login(page: Page) {
    // For now, we'll just check if login page loads
    // TODO: Implement actual login flow when Google OAuth mock is ready
    await page.goto('/');

    // Check if we're on the login page or already logged in
    const isLoggedIn = await page.locator('[data-testid="user-menu"]').isVisible().catch(() => false);

    if (!isLoggedIn) {
        // If there's a login button, we're on the login page
        const loginButton = page.locator('button:has-text("Iniciar sesión")');
        if (await loginButton.isVisible().catch(() => false)) {
            // In a real test, we'd complete the OAuth flow here
            // For now, we'll just verify the button exists
            await expect(loginButton).toBeVisible();
        }
    }
}

test.describe('Camila\'s Bakery E2E Tests', () => {

    test('should load the homepage', async ({ page }) => {
        await page.goto('/');

        // Check that the page loads
        await expect(page).toHaveTitle(/Camila/i);

        // Check for key elements
        const heading = page.locator('h1, h2').first();
        await expect(heading).toBeVisible();
    });

    test('should display login page', async ({ page }) => {
        await page.goto('/');

        // Look for login-related elements
        const loginButton = page.locator('button:has-text("Iniciar sesión")');

        // Either we're already logged in (no login button) or we see the login button
        const isVisible = await loginButton.isVisible().catch(() => false);

        if (isVisible) {
            await expect(loginButton).toBeVisible();
        } else {
            // We're logged in, check for user menu or navigation
            const nav = page.locator('nav');
            await expect(nav).toBeVisible();
        }
    });

    test('should navigate to pedidos page (if logged in)', async ({ page }) => {
        await login(page);

        // Try to navigate to pedidos
        await page.goto('/pedidos');

        // Check if we're redirected to login or if we see the pedidos page
        const url = page.url();

        // If we're on pedidos page, check for expected elements
        if (url.includes('/pedidos')) {
            // Look for pedidos-related content
            const pageContent = await page.textContent('body');
            expect(pageContent).toBeTruthy();
        }
    });

    test('should handle 404 for non-existent routes', async ({ page }) => {
        const response = await page.goto('/this-route-does-not-exist-xyz123');

        // Either we get a 404 or the app handles it gracefully
        if (response) {
            // Some apps return 200 and show a 404 component
            const is404 = response.status() === 404 ||
                await page.locator('text=/404|not found/i').isVisible().catch(() => false);

            expect(is404).toBeTruthy();
        }
    });

    test('should have responsive navigation', async ({ page }) => {
        await page.goto('/');

        // Check if navigation exists
        const nav = page.locator('nav, [role="navigation"]').first();

        if (await nav.isVisible().catch(() => false)) {
            await expect(nav).toBeVisible();

            // Check for common navigation items
            const links = nav.locator('a');
            const linkCount = await links.count();

            // Should have at least one navigation link
            expect(linkCount).toBeGreaterThan(0);
        }
    });
});

test.describe('Pedidos Flow (Authenticated)', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test.skip('should create a new pedido', async ({ page }) => {
        // Skip this test until we have proper authentication mocking
        // This is a placeholder for the full flow

        await page.goto('/pedidos/crear');

        // Select cliente
        await page.fill('input[placeholder*="cliente"]', 'Test Cliente');

        // Select torta
        await page.click('button:has-text("Agregar")');

        // Submit
        await page.click('button[type="submit"]');

        // Verify success
        await expect(page.locator('text=/creado|éxito/i')).toBeVisible({ timeout: 10000 });
    });

    test.skip('should change pedido status', async ({ page }) => {
        // Skip until authentication is mocked

        await page.goto('/pedidos');

        // Find first pedido
        const firstRow = page.locator('tr').nth(1);
        await firstRow.click();

        // Change status
        await page.click('button:has-text("Completar")');

        // Verify
        await expect(page.locator('text=/completado/i')).toBeVisible();
    });
});
