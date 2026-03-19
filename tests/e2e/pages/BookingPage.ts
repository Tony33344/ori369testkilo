import { Page, Locator } from '@playwright/test';

export class BookingPage {
  readonly page: Page;
  readonly serviceSelect: Locator;
  readonly dateSelect: Locator;
  readonly timeSlots: Locator;
  readonly notesTextarea: Locator;
  readonly submitButton: Locator;
  readonly loginRequiredBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.serviceSelect = page.locator('select').first();
    this.dateSelect = page.locator('select').nth(1);
    this.timeSlots = page.locator('button:has-text(":")');
    this.notesTextarea = page.locator('textarea');
    this.submitButton = page.locator('button[type="submit"]');
    this.loginRequiredBanner = page.locator('text=login').locator('..');
  }

  async goto(packageSlug?: string) {
    if (packageSlug) {
      await this.page.goto(`/rezervacija?package=${packageSlug}`);
    } else {
      await this.page.goto('/rezervacija');
    }
  }

  async selectService(serviceName: string) {
    // Get all options and find matching one by text
    const options = await this.serviceSelect.locator('option').all();
    for (const opt of options) {
      const text = await opt.textContent();
      if (text && text.toLowerCase().includes(serviceName.toLowerCase())) {
        const value = await opt.getAttribute('value');
        if (value) {
          await this.serviceSelect.selectOption({ value });
          return;
        }
      }
    }
    // fallback: try direct label match
    await this.serviceSelect.selectOption({ label: serviceName });
  }

  async selectDate(date: string) {
    // The booking page uses a custom calendar with day buttons, not a <select>
    // date format: 'YYYY-MM-DD' - click the day number button in the calendar
    const day = parseInt(date.split('-')[2], 10);
    const dayButton = this.page.locator(`button:has-text("${day}")`).filter({ hasNotText: /prev|next|<|>/ });
    await dayButton.first().click();
  }

  async selectTimeSlot(time: string) {
    await this.page.locator(`button:has-text("${time}")`).click();
  }

  async selectFirstAvailableTimeSlot() {
    await this.timeSlots.first().click();
  }

  async fillNotes(notes: string) {
    await this.notesTextarea.fill(notes);
  }

  async submitBooking() {
    await this.submitButton.click();
  }

  async createBooking(serviceName: string, date: string, notes?: string) {
    await this.selectService(serviceName);
    await this.selectDate(date);
    
    // Wait for time slots to load
    await this.page.waitForTimeout(1000);
    
    await this.selectFirstAvailableTimeSlot();
    
    if (notes) {
      await this.fillNotes(notes);
    }
    
    await this.submitBooking();
  }

  async waitForSuccessToast() {
    await this.page.waitForSelector('text=success', { timeout: 5000 });
  }

  async waitForErrorToast() {
    await this.page.waitForSelector('text=error', { timeout: 5000 });
  }

  async isLoginRequired(): Promise<boolean> {
    return await this.loginRequiredBanner.isVisible();
  }

  async getAvailableTimeSlots(): Promise<number> {
    return await this.timeSlots.count();
  }
}
