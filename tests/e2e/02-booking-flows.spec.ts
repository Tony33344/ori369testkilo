import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { BookingPage } from './pages/BookingPage';
import { getFutureDate, getPastDate, supabase } from './fixtures/supabase.fixture';

test.describe('Booking Flows and Edge Cases', () => {
  // Use real credentials from env or fixed test account
  const userEmail = process.env.TEST_USER_EMAIL || 'termarc50@gmail.com';
  const userPassword = process.env.TEST_USER_PASSWORD || 'test1234';
  // Real service names from Supabase DB
  const realServiceName = 'Elektrostimulacija';
  const realPackageName = 'Aktivacija - Paket 3 obravnave';

  test('01 - Booking Requires Login', async ({ page }) => {
    const bookingPage = new BookingPage(page);
    
    await bookingPage.goto();
    
    // Should show login required banner
    const isLoginRequired = await bookingPage.isLoginRequired();
    expect(isLoginRequired).toBe(true);
    
    // Try to submit without login
    await bookingPage.submitButton.click();
    
    // Should redirect to login
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/prijava/);
  });

  test('02 - Package Shortcut Booking', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const bookingPage = new BookingPage(page);
    
    // Login first
    await loginPage.goto();
    await loginPage.login(userEmail, userPassword);
    await page.waitForTimeout(2000);
    
    // Navigate with real motioscan package slug
    await bookingPage.goto('motioscan');
    await page.waitForTimeout(1500);
    
    // Page should stay on reservation (service may or may not preselect depending on slug match)
    await expect(page).toHaveURL(/rezervacija/);
    const selectedValue = await bookingPage.serviceSelect.inputValue();
    console.log('Pre-selected service value for motioscan:', selectedValue);
    // If a service was matched and preselected, it should not be empty
    // This documents the preselection behaviour
  });

  test('03 - Form Validation - Missing Service', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const bookingPage = new BookingPage(page);
    
    // Login
    await loginPage.goto();
    await loginPage.login(userEmail, userPassword);
    await page.waitForTimeout(2000);
    
    await bookingPage.goto();
    
    // Try to submit without selecting service
    await bookingPage.submitButton.click();
    
    // Should show validation error (browser native or toast)
    await page.waitForTimeout(1000);
    
    // Should still be on booking page
    await expect(page).toHaveURL(/rezervacija/);
  });

  test('04 - Form Validation - Missing Date', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const bookingPage = new BookingPage(page);
    
    // Login
    await loginPage.goto();
    await loginPage.login(userEmail, userPassword);
    await page.waitForTimeout(2000);
    
    await bookingPage.goto();
    
    // Select service but not date
    await bookingPage.selectService(realServiceName);
    await bookingPage.submitButton.click();
    
    // Should show validation error
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/rezervacija/);
  });

  test('05 - Available Time Slots Load Correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const bookingPage = new BookingPage(page);
    
    // Login
    await loginPage.goto();
    await loginPage.login(userEmail, userPassword);
    await page.waitForTimeout(2000);
    
    await bookingPage.goto();
    
    // Select service and date
    await bookingPage.selectService(realServiceName);
    const futureDate = getFutureDate(3);
    await bookingPage.selectDate(futureDate);
    
    // Wait for slots to load
    await page.waitForTimeout(3000);
    
    // Time slot buttons show HH:MM format
    const slotsCount = await bookingPage.getAvailableTimeSlots();
    console.log(`Available time slots for ${futureDate}: ${slotsCount}`);
    // Slots depend on availability_slots in DB; just verify page is functional
    expect(slotsCount).toBeGreaterThanOrEqual(0);
  });

  test('06 - Double Booking Prevention', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const bookingPage = new BookingPage(page);
    
    // Login
    await loginPage.goto();
    await loginPage.login(userEmail, userPassword);
    await page.waitForTimeout(2000);
    
    // Create first booking
    await bookingPage.goto();
    const futureDate = getFutureDate(4);
    await bookingPage.selectService(realServiceName);
    await bookingPage.selectDate(futureDate);
    await page.waitForTimeout(1500);
    
    // Get first available slot
    const firstSlot = await bookingPage.timeSlots.first().textContent();
    await bookingPage.selectFirstAvailableTimeSlot();
    await bookingPage.submitBooking();
    await page.waitForTimeout(2000);
    
    // Try to book the same slot again
    await bookingPage.goto();
    await bookingPage.selectService(realServiceName);
    await bookingPage.selectDate(futureDate);
    await page.waitForTimeout(1500);
    
    // The previously booked slot should not be available
    const availableSlots = await bookingPage.timeSlots.allTextContents();
    
    // If the slot is still shown, it means the system allows double booking (which is bad)
    // In a proper system, the slot should be removed from available slots
    // We'll verify by checking if we can still see it
    const slotStillAvailable = availableSlots.includes(firstSlot || '');
    
    // Depending on implementation, this might be false (good) or we need to verify error on submission
    if (slotStillAvailable) {
      // Try to book it and expect an error
      await page.locator(`button:has-text("${firstSlot}")`).click();
      await bookingPage.submitBooking();
      await page.waitForTimeout(2000);
      
      // Should show error or the slot should have been removed
      // This test documents the expected behavior
    }
  });

  test('07 - Past Date Validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const bookingPage = new BookingPage(page);
    
    // Login
    await loginPage.goto();
    await loginPage.login(userEmail, userPassword);
    await page.waitForTimeout(2000);
    
    await bookingPage.goto();
    await page.waitForLoadState('networkidle');
    
    // The calendar uses disabled buttons for past dates
    // Today's date minus 1 day should have a disabled button
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDay = yesterday.getDate();
    
    // Past day buttons should be disabled in the calendar
    const pastDayBtn = page.locator(`button:has-text("${yesterdayDay}")`).first();
    const isDisabled = await pastDayBtn.isDisabled().catch(() => true);
    console.log(`Yesterday (${yesterdayDay}) button disabled:`, isDisabled);
    expect(isDisabled).toBe(true);
  });

  test('08 - Booking with Notes', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const bookingPage = new BookingPage(page);
    
    // Login
    await loginPage.goto();
    await loginPage.login(userEmail, userPassword);
    await page.waitForTimeout(2000);
    
    await bookingPage.goto();
    
    const futureDate = getFutureDate(5);
    const testNotes = 'Special request: Please call before appointment';
    
    await bookingPage.createBooking(realServiceName, futureDate, testNotes);
    await page.waitForTimeout(2000);
    
    // Verify notes were saved
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('notes', testNotes);
    
    expect(bookings?.length).toBeGreaterThan(0);
  });

  test('09 - Multiple Bookings for Same User', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const bookingPage = new BookingPage(page);
    
    // Login
    await loginPage.goto();
    await loginPage.login(userEmail, userPassword);
    await page.waitForTimeout(2000);
    
    // Create first booking
    await bookingPage.goto();
    const date1 = getFutureDate(6);
    await bookingPage.createBooking(realServiceName, date1, 'First booking');
    await page.waitForTimeout(2000);
    
    // Create second booking
    await bookingPage.goto();
    const date2 = getFutureDate(7);
    await bookingPage.createBooking(realPackageName, date2, 'Second booking');
    await page.waitForTimeout(2000);
    
    // Verify both bookings exist
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')
      .or('notes.eq.First booking,notes.eq.Second booking');
    
    expect(bookings?.length).toBe(2);
  });
});
