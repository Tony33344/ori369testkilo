import { test, expect } from '@playwright/test';

test.describe('ORI369 Reservation and Checkout Flow', () => {
  test('Complete reservation and checkout process', async ({ page }) => {
    // Test user data
    const testEmail = `test-${Date.now()}@example.com`;
    const testName = 'Test User';
    const testPhone = '041123456';

    // Step 1: Go to reservation page
    await page.goto('http://localhost:3000/rezervacija');
    await page.waitForLoadState('networkidle');

    // Verify we're on the reservation page
    await expect(page).toHaveURL(/.*rezervacija/);

    // Step 2: Verify login is required message is shown
    await expect(page.locator('text=Prosim, prijavite se za rezervacijo')).toBeVisible();

    // Step 3: Go to registration page
    await page.goto('http://localhost:3000/registracija');
    await page.waitForLoadState('networkidle');

    // Fill registration form
    await page.locator('label:has-text("Ime *")').fill(testName);
    await page.locator('label:has-text("Email *")').fill(testEmail);
    await page.locator('label:has-text("Geslo *")').fill('TestPass123!');
    await page.locator('label:has-text("Potrdi geslo *")').fill('TestPass123!');

    // Accept terms
    await page.locator('text=Strinjam se').click();

    // Submit registration
    await page.locator('text=Registriraj se').click();
    await page.waitForTimeout(5000);

    // Step 4: Go back to reservation page (now authenticated)
    await page.goto('http://localhost:3000/rezervacija');
    await page.waitForLoadState('networkidle');

    // Step 5: Select service from dropdown
    await page.locator('select').selectOption({ label: 'Manualna Terapija' });
    await page.waitForTimeout(1000);

    // Step 6: Select date using dropdown
    await page.locator('text=Uporabi spustni seznam').click();
    await page.waitForTimeout(500);

    // Open date picker
    await page.locator('label:has-text("Izberite datum *")').click();
    await page.waitForTimeout(500);

    // Select tomorrow's date (second option)
    await page.locator('role=option').nth(1).click();
    await page.waitForTimeout(2000);

    // Step 7: Select time slot 10:00
    await page.locator('text=10:00').click();
    await page.waitForTimeout(1000);

    // Step 8: Submit booking
    await page.locator('button:has-text("Rezerviraj termin")').click();
    await page.waitForTimeout(3000);

    // Step 9: Should be redirected to checkout
    await expect(page).toHaveURL(/.*checkout/);

    // Fill checkout form
    await page.locator('label:has-text("Ime *")').fill(testName);
    await page.locator('label:has-text("Email *")').fill(testEmail);
    await page.locator('label:has-text("Telefon *")').fill(testPhone);

    // Accept terms
    await page.locator('text=Strinjam se s pogoji').click();

    // Select UPN payment
    await page.locator('text=UPN plačilo').click();
    await page.waitForTimeout(1000);

    // Generate QR code
    await page.locator('text=Generiraj QR kodo').click();
    await page.waitForTimeout(2000);

    // Verify QR code was generated
    await expect(page.locator('text=QR koda za plačilo')).toBeVisible();

    // Take final screenshot
    await page.screenshot({ path: 'test-results/reservation-checkout-final.png', fullPage: true });

    console.log('✅ Complete reservation and checkout flow test passed');
    console.log(`Test user created: ${testEmail}`);
    console.log('Booking completed with UPN payment QR code generation');
  });

  test('Reservation form validation', async ({ page }) => {
    // Go to reservation page
    await page.goto('http://localhost:3000/rezervacija');
    await page.waitForLoadState('networkidle');

    // Verify login is required message is shown
    await expect(page.locator('text=Prosim, prijavite se za rezervacijo')).toBeVisible();

    // Verify submit button is disabled for unauthenticated users
    const submitButton = page.locator('button:has-text("Rezerviraj termin")');
    await expect(submitButton).toBeDisabled();

    // Select service but button should still be disabled
    await page.locator('select').selectOption({ label: 'Manualna Terapija' });
    await page.waitForTimeout(1000);

    // Button should still be disabled
    await expect(submitButton).toBeDisabled();

    // Try to click disabled button (should not navigate)
    await submitButton.click({ force: true });
    await page.waitForTimeout(1000);

    // Should still be on reservation page
    await expect(page).toHaveURL(/.*rezervacija/);

    console.log('✅ Form validation test passed - button disabled for unauthenticated users');
  });
});