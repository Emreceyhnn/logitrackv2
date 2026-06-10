/* eslint-disable @typescript-eslint/no-unused-vars */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://logitrack.emreceyhan.xyz';
const EMAIL = 'admin@atl.com';
const PASSWORD = '3121283455Em!';
const SCREENSHOT_DIR = 'C:\\Users\\emrec\\.gemini\\antigravity\\brain\\2b605b10-c5ab-4886-abe1-c2f46487fd13\\screenshots';
const REPORT_FILE = 'C:\\Users\\emrec\\.gemini\\antigravity\\brain\\2b605b10-c5ab-4886-abe1-c2f46487fd13\\route_test_report.json';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const results = [];

async function testRoute(page, route, label, waitMs = 3000) {
  const url = `${BASE_URL}${route}`;
  console.log(`\n=== Testing: ${url} ===`);
  
  const result = {
    label,
    route,
    url,
    timestamp: new Date().toISOString(),
    finalUrl: null,
    title: null,
    redirected: false,
    loadTimeMs: null,
    status: null,
    errors: [],
    consoleErrors: [],
    screenshot: null,
    visibleContent: null,
    notes: []
  };

  const consoleErrors = [];
  const pageErrors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  page.on('pageerror', err => {
    pageErrors.push(err.message);
  });

  try {
    const startTime = Date.now();
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(waitMs);
    const loadTime = Date.now() - startTime;
    
    result.loadTimeMs = loadTime;
    result.status = response ? response.status() : null;
    result.finalUrl = page.url();
    result.title = await page.title();
    result.redirected = result.finalUrl !== url;
    result.consoleErrors = [...consoleErrors];
    result.pageErrors = [...pageErrors];
    
    if (loadTime > 3000) {
      result.notes.push(`SLOW LOAD: ${loadTime}ms`);
    }
    
    // Get visible text content
    try {
      result.visibleContent = await page.evaluate(() => {
        const body = document.body;
        const text = body ? body.innerText.substring(0, 2000) : '';
        return text.trim();
      });
    } catch(e) {
      result.visibleContent = 'Could not extract text';
    }
    
    // Take screenshot
    const screenshotName = label.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
    const screenshotPath = path.join(SCREENSHOT_DIR, screenshotName);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    result.screenshot = screenshotPath;
    
    console.log(`  Status: ${result.status}`);
    console.log(`  Final URL: ${result.finalUrl}`);
    console.log(`  Title: ${result.title}`);
    console.log(`  Load time: ${result.loadTimeMs}ms`);
    console.log(`  Redirected: ${result.redirected}`);
    if (consoleErrors.length) console.log(`  Console errors: ${consoleErrors.length}`);
    
  } catch (err) {
    result.errors.push(err.message);
    console.log(`  ERROR: ${err.message}`);
    
    try {
      const screenshotName = label.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_error.png';
      const screenshotPath = path.join(SCREENSHOT_DIR, screenshotName);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      result.screenshot = screenshotPath;
    } catch(se) {}
  }
  
  results.push(result);
  return result;
}

async function login(page) {
  console.log('\n=== Performing Login ===');
  await page.goto(`${BASE_URL}/en/auth/sign-in`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  
  // Take pre-login screenshot
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'login_before.png'), fullPage: true });
  
  // Try to find email input
  const emailSelectors = ['input[type="email"]', 'input[name="email"]', 'input[placeholder*="email" i]', 'input[placeholder*="Email" i]'];
  let emailFilled = false;
  for (const sel of emailSelectors) {
    try {
      await page.fill(sel, EMAIL, { timeout: 3000 });
      emailFilled = true;
      console.log(`  Email filled via: ${sel}`);
      break;
    } catch(e) {}
  }
  
  const passSelectors = ['input[type="password"]', 'input[name="password"]', 'input[placeholder*="pass" i]'];
  let passFilled = false;
  for (const sel of passSelectors) {
    try {
      await page.fill(sel, PASSWORD, { timeout: 3000 });
      passFilled = true;
      console.log(`  Password filled via: ${sel}`);
      break;
    } catch(e) {}
  }
  
  if (emailFilled && passFilled) {
    // Take screenshot with filled form
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'login_filled.png'), fullPage: true });
    
    // Click submit
    const submitSelectors = ['button[type="submit"]', 'button:has-text("Sign in")', 'button:has-text("Login")', 'button:has-text("Sign In")'];
    for (const sel of submitSelectors) {
      try {
        await page.click(sel, { timeout: 3000 });
        console.log(`  Submit clicked via: ${sel}`);
        break;
      } catch(e) {}
    }
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'login_after.png'), fullPage: true });
    
    const loginResult = {
      finalUrl: page.url(),
      title: await page.title(),
      success: !page.url().includes('sign-in')
    };
    console.log(`  After login URL: ${loginResult.finalUrl}`);
    console.log(`  Login success: ${loginResult.success}`);
    return loginResult;
  } else {
    console.log(`  Could not find form fields. emailFilled=${emailFilled}, passFilled=${passFilled}`);
    return { success: false, finalUrl: page.url() };
  }
}

async function testLogout(page) {
  console.log('\n=== Testing Logout ===');
  const logoutResult = { attempted: false, success: false, finalUrl: null, screenshot: null };
  
  // Look for user menu / avatar / logout button
  const logoutSelectors = [
    'button:has-text("Logout")',
    'button:has-text("Sign out")',
    'a:has-text("Logout")',
    'a:has-text("Sign out")',
    '[data-testid="logout"]',
    '[aria-label="logout"]',
    '[aria-label="user menu"]',
  ];
  
  // First try user/avatar menus that might reveal logout
  const avatarSelectors = ['[data-testid="user-avatar"]', 'button[aria-label*="user" i]', '.avatar', '[data-testid="avatar"]'];
  for (const sel of avatarSelectors) {
    try {
      await page.click(sel, { timeout: 2000 });
      await page.waitForTimeout(1000);
      console.log(`  Clicked avatar via: ${sel}`);
      break;
    } catch(e) {}
  }
  
  for (const sel of logoutSelectors) {
    try {
      await page.click(sel, { timeout: 2000 });
      logoutResult.attempted = true;
      console.log(`  Logout clicked via: ${sel}`);
      break;
    } catch(e) {}
  }
  
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'logout_result.png'), fullPage: true });
  
  logoutResult.finalUrl = page.url();
  logoutResult.success = page.url().includes('sign-in') || page.url().includes('auth') || !page.url().includes('overview');
  logoutResult.screenshot = path.join(SCREENSHOT_DIR, 'logout_result.png');
  
  console.log(`  After logout URL: ${logoutResult.finalUrl}`);
  return logoutResult;
}

async function main() {
  console.log('Starting LogiTrack v2 Route Testing...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Screenshots: ${SCREENSHOT_DIR}`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  const publicRoutes = [
    ['/', 'Root'],
    ['/en', 'Home EN'],
    ['/en/about', 'About'],
    ['/en/features', 'Features'],
    ['/en/how-it-works', 'How It Works'],
    ['/en/pricing', 'Pricing'],
    ['/en/auth/sign-in', 'Sign In'],
    ['/en/auth/sign-up', 'Sign Up'],
  ];
  
  // Test public routes first
  for (const [route, label] of publicRoutes) {
    await testRoute(page, route, label);
  }
  
  // Test unauthenticated access to protected route
  console.log('\n=== Testing Unauthenticated Access to /en/overview ===');
  await testRoute(page, '/en/overview', 'Overview Unauth');
  
  // Login
  const loginOutcome = await login(page);
  results.push({ label: 'Login Flow', loginOutcome });
  
  // Authenticated routes
  const authRoutes = [
    ['/en/overview', 'Overview Dashboard'],
    ['/en/shipments', 'Shipments'],
    ['/en/drivers', 'Drivers'],
    ['/en/customers', 'Customers'],
    ['/en/vehicle', 'Vehicle'],
    ['/en/routes', 'Routes'],
    ['/en/analytics', 'Analytics'],
    ['/en/inventory', 'Inventory'],
    ['/en/warehouses', 'Warehouses'],
    ['/en/reports', 'Reports'],
    ['/en/company', 'Company'],
    ['/en/playground', 'Playground'],
    ['/en/does-not-exist', '404 Test'],
  ];
  
  for (const [route, label] of authRoutes) {
    await testRoute(page, route, label, 3000);
  }
  
  // Test logout
  const logoutResult = await testLogout(page);
  results.push({ label: 'Logout Flow', logoutResult });
  
  // Collect sidebar links from overview (re-login if needed)
  console.log('\n=== Checking Sidebar Navigation ===');
  const loginResult2 = await login(page);
  await page.goto(`${BASE_URL}/en/overview`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  
  try {
    const sidebarLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('nav a, aside a, [role="navigation"] a'));
      return links.map(a => ({ text: a.innerText.trim(), href: a.href })).filter(l => l.text && l.href);
    });
    results.push({ label: 'Sidebar Links', sidebarLinks });
    console.log('Sidebar links found:', sidebarLinks.length);
    sidebarLinks.forEach(l => console.log(`  ${l.text}: ${l.href}`));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'sidebar_overview.png'), fullPage: false });
  } catch(e) {
    console.log('Could not extract sidebar links:', e.message);
  }
  
  await browser.close();
  
  // Save report
  fs.writeFileSync(REPORT_FILE, JSON.stringify(results, null, 2));
  console.log(`\n=== DONE. Report saved to: ${REPORT_FILE} ===`);
  
  // Print summary
  console.log('\n=== SUMMARY ===');
  for (const r of results) {
    if (r.route !== undefined) {
      const icon = r.errors?.length ? '❌' : r.redirected ? '↩️' : '✅';
      console.log(`${icon} ${r.label} (${r.route}) => ${r.finalUrl} | ${r.status} | ${r.loadTimeMs}ms | "${r.title}"`);
    }
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
