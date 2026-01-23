/**
 * ORI 369 - Comprehensive Workflow Tests
 * Using agent-browser for automated testing
 */

import { Agent } from 'agent-browser';

const BASE_URL = 'http://localhost:3002';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

const results: TestResult[] = [];

async function runTest(name: string, testFn: (agent: Agent) => Promise<void>) {
  const start = Date.now();
  const agent = new Agent();
  
  try {
    await testFn(agent);
    results.push({ name, passed: true, duration: Date.now() - start });
    console.log(`✅ ${name}`);
  } catch (error: any) {
    results.push({ name, passed: false, error: error.message, duration: Date.now() - start });
    console.log(`❌ ${name}: ${error.message}`);
  } finally {
    await agent.close();
  }
}

// Test 1: Homepage loads correctly
async function testHomepage(agent: Agent) {
  await agent.goto(BASE_URL);
  await agent.waitForSelector('h1');
  
  const title = await agent.evaluate(() => document.title);
  if (!title.includes('ORI 369')) {
    throw new Error(`Expected title to include 'ORI 369', got: ${title}`);
  }
  
  // Check hero section exists
  const heroExists = await agent.evaluate(() => {
    return document.querySelector('section')?.textContent?.includes('ORI 369');
  });
  if (!heroExists) {
    throw new Error('Hero section not found');
  }
}

// Test 2: Therapies page shows all therapies
async function testTherapiesPage(agent: Agent) {
  await agent.goto(`${BASE_URL}/terapije`);
  await agent.waitForSelector('h1');
  
  const pageTitle = await agent.evaluate(() => {
    return document.querySelector('h1')?.textContent;
  });
  if (!pageTitle?.includes('Terapije')) {
    throw new Error(`Expected page title 'Terapije', got: ${pageTitle}`);
  }
  
  // Check therapies are displayed
  const therapyCount = await agent.evaluate(() => {
    return document.querySelectorAll('[class*="therapy"], [class*="service"]').length;
  });
  if (therapyCount < 10) {
    throw new Error(`Expected at least 10 therapies, found: ${therapyCount}`);
  }
}

// Test 3: Individual therapy page loads
async function testTherapyDetailPage(agent: Agent) {
  await agent.goto(`${BASE_URL}/terapije/manualna-terapija`);
  await agent.waitForSelector('h1');
  
  const content = await agent.evaluate(() => document.body.textContent);
  if (!content?.includes('Manualna')) {
    throw new Error('Therapy detail page did not load correctly');
  }
}

// Test 4: Packages page shows packages
async function testPackagesPage(agent: Agent) {
  await agent.goto(`${BASE_URL}/paketi`);
  await agent.waitForSelector('h1');
  
  const pageTitle = await agent.evaluate(() => {
    return document.querySelector('h1')?.textContent;
  });
  if (!pageTitle?.includes('Paket')) {
    throw new Error(`Expected page title with 'Paket', got: ${pageTitle}`);
  }
}

// Test 5: Pricing page loads
async function testPricingPage(agent: Agent) {
  await agent.goto(`${BASE_URL}/cenik`);
  await agent.waitForSelector('h1');
  
  const content = await agent.evaluate(() => document.body.textContent);
  if (!content?.includes('Cenik') && !content?.includes('cen')) {
    throw new Error('Pricing page did not load correctly');
  }
}

// Test 6: Booking page loads
async function testBookingPage(agent: Agent) {
  await agent.goto(`${BASE_URL}/rezervacija`);
  await agent.waitForSelector('h1');
  
  const content = await agent.evaluate(() => document.body.textContent);
  if (!content?.includes('Rezerv') && !content?.includes('termin')) {
    throw new Error('Booking page did not load correctly');
  }
}

// Test 7: Navigation works
async function testNavigation(agent: Agent) {
  await agent.goto(BASE_URL);
  await agent.waitForSelector('nav');
  
  // Click on Terapije link
  await agent.click('a[href="/terapije"]');
  await agent.waitForNavigation();
  
  const url = await agent.evaluate(() => window.location.pathname);
  if (url !== '/terapije') {
    throw new Error(`Expected to navigate to /terapije, got: ${url}`);
  }
}

// Test 8: Login page loads
async function testLoginPage(agent: Agent) {
  await agent.goto(`${BASE_URL}/prijava`);
  await agent.waitForSelector('input[type="email"], input[type="text"]');
  
  const hasLoginForm = await agent.evaluate(() => {
    return document.querySelector('form') !== null;
  });
  if (!hasLoginForm) {
    throw new Error('Login form not found');
  }
}

// Test 9: Registration page loads
async function testRegistrationPage(agent: Agent) {
  await agent.goto(`${BASE_URL}/registracija`);
  await agent.waitForSelector('input');
  
  const hasForm = await agent.evaluate(() => {
    return document.querySelector('form') !== null;
  });
  if (!hasForm) {
    throw new Error('Registration form not found');
  }
}

// Test 10: Booking flow - select therapy
async function testBookingFlow(agent: Agent) {
  await agent.goto(`${BASE_URL}/rezervacija`);
  await agent.waitForSelector('select, [role="listbox"], button');
  
  // Check if therapy selection exists
  const hasTherapySelection = await agent.evaluate(() => {
    const content = document.body.textContent || '';
    return content.includes('terapij') || content.includes('storitev');
  });
  if (!hasTherapySelection) {
    throw new Error('Therapy selection not found in booking flow');
  }
}

// Main test runner
async function runAllTests() {
  console.log('\n🧪 ORI 369 - Workflow Tests\n');
  console.log('='.repeat(50));
  
  await runTest('Homepage loads correctly', testHomepage);
  await runTest('Therapies page shows all therapies', testTherapiesPage);
  await runTest('Individual therapy page loads', testTherapyDetailPage);
  await runTest('Packages page shows packages', testPackagesPage);
  await runTest('Pricing page loads', testPricingPage);
  await runTest('Booking page loads', testBookingPage);
  await runTest('Navigation works', testNavigation);
  await runTest('Login page loads', testLoginPage);
  await runTest('Registration page loads', testRegistrationPage);
  await runTest('Booking flow - select therapy', testBookingFlow);
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary\n');
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${results.length}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
  }
  
  console.log('\n' + '='.repeat(50));
}

runAllTests().catch(console.error);
