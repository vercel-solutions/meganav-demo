const { chromium } = require('playwright');

// Configuration
const BASE_URL = process.env.DEPLOYMENT_URL || 'http://localhost:3000';
const TIMEOUT = 30000;
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

function logTest(name, status, details = '') {
  const icon = status === 'pass' ? '✓' : status === 'fail' ? '✗' : '⚠';
  const color = status === 'pass' ? 'green' : status === 'fail' ? 'red' : 'yellow';
  log(`${icon} ${name}`, color);
  if (details) {
    console.log(`  ${details}`);
  }
}

async function testCacheHeaders(page) {
  logSection('Testing Cache Headers on Vercel Deployment');
  log(`Target URL: ${BASE_URL}`, 'blue');
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
  };

  try {
    // Test 1: Check navigation endpoint cache headers
    log('\n1. Testing /api/navigation endpoint...', 'yellow');
    
    const navResponse = await page.request.get(`${BASE_URL}/api/navigation`);
    const navHeaders = navResponse.headers();
    
    log(`   Status: ${navResponse.status()}`);
    log(`   Cache-Control: ${navHeaders['cache-control'] || 'NOT SET'}`);
    log(`   X-Nextjs-Cache: ${navHeaders['x-nextjs-cache'] || 'NOT SET'}`);
    
    // Verify cache-control header
    if (navHeaders['cache-control'] && navHeaders['cache-control'].includes('s-maxage=360')) {
      logTest('Navigation API cache-control header', 'pass', 's-maxage=360 found');
      results.passed++;
    } else {
      logTest('Navigation API cache-control header', 'fail', `Expected s-maxage=360, got: ${navHeaders['cache-control']}`);
      results.failed++;
    }
    
    // Second request to check cache HIT
    log('\n2. Making second request to check cache behavior...', 'yellow');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const navResponse2 = await page.request.get(`${BASE_URL}/api/navigation`);
    const navHeaders2 = navResponse2.headers();
    
    log(`   X-Nextjs-Cache: ${navHeaders2['x-nextjs-cache'] || 'NOT SET'}`);
    
    if (navHeaders2['x-nextjs-cache'] === 'HIT' || navHeaders2['x-nextjs-cache'] === 'STALE') {
      logTest('Navigation API cache HIT', 'pass', 'Cache is working');
      results.passed++;
    } else {
      logTest('Navigation API cache HIT', 'warn', `Expected HIT or STALE, got: ${navHeaders2['x-nextjs-cache']}`);
      results.warnings++;
    }
    
    // Test 3: Check main page cache headers
    log('\n3. Testing main page cache headers...', 'yellow');
    
    const pageResponse = await page.request.get(`${BASE_URL}/`);
    const pageHeaders = pageResponse.headers();
    
    log(`   Status: ${pageResponse.status()}`);
    log(`   Cache-Control: ${pageHeaders['cache-control'] || 'NOT SET'}`);
    
    if (pageHeaders['cache-control'] && pageHeaders['cache-control'].includes('s-maxage=3600')) {
      logTest('Main page cache-control', 'pass', 's-maxage=3600 (1 hour) found');
      results.passed++;
    } else {
      logTest('Main page cache-control', 'warn', `Expected s-maxage=3600, got: ${pageHeaders['cache-control']}`);
      results.warnings++;
    }
    
    // Test 4: Test revalidation endpoint
    log('\n4. Testing revalidation endpoint...', 'yellow');
    
    const revalidateResponse = await page.request.get(`${BASE_URL}/api/revalidate`);
    const revalidateData = await revalidateResponse.json();
    
    log(`   Response: ${JSON.stringify(revalidateData)}`);
    
    if (revalidateData.revalidated === true) {
      logTest('Revalidation endpoint', 'pass', 'Successfully triggered revalidation');
      results.passed++;
    } else {
      logTest('Revalidation endpoint', 'fail', 'Revalidation failed');
      results.failed++;
    }
    
    // Test 5: Check cache after revalidation
    log('\n5. Checking cache headers after revalidation...', 'yellow');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const navResponse3 = await page.request.get(`${BASE_URL}/api/navigation`);
    const navHeaders3 = navResponse3.headers();
    
    log(`   X-Nextjs-Cache: ${navHeaders3['x-nextjs-cache'] || 'NOT SET'}`);
    
    if (navHeaders3['x-nextjs-cache'] === 'MISS' || navHeaders3['x-nextjs-cache'] === 'STALE') {
      logTest('Cache cleared after revalidation', 'pass', 'Cache shows MISS or STALE');
      results.passed++;
    } else {
      logTest('Cache cleared after revalidation', 'warn', `Expected MISS, got: ${navHeaders3['x-nextjs-cache']}`);
      results.warnings++;
    }
    
    // Test 6: Verify timestamps in navigation data
    log('\n6. Testing timestamp updates in navigation data...', 'yellow');
    
    const navData1 = await navResponse.json();
    await new Promise(resolve => setTimeout(resolve, 2000));
    const navResponse4 = await page.request.get(`${BASE_URL}/api/navigation`);
    const navData2 = await navResponse4.json();
    
    const timestamp1 = navData1.items[0]?.dropdown?.items[0]?.title || '';
    const timestamp2 = navData2.items[0]?.dropdown?.items[0]?.title || '';
    
    log(`   First timestamp:  ${timestamp1}`);
    log(`   Second timestamp: ${timestamp2}`);
    
    if (timestamp1 && timestamp2) {
      logTest('Navigation data structure', 'pass', 'Navigation data format is correct');
      results.passed++;
    } else {
      logTest('Navigation data structure', 'fail', 'Navigation data format is incorrect');
      results.failed++;
    }
    
    // Test 7: Browser test - Load page and check SWR updates
    log('\n7. Testing page load and SWR functionality in browser...', 'yellow');
    
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    
    // Check if navigation is visible
    const navVisible = await page.locator('nav').isVisible();
    if (navVisible) {
      logTest('Navigation renders', 'pass', 'MegaNav component is visible');
      results.passed++;
    } else {
      logTest('Navigation renders', 'fail', 'MegaNav component not found');
      results.failed++;
    }
    
    // Check for product links with timestamps
    const productLinks = await page.locator('a[href^="/product-"]').count();
    if (productLinks >= 3) {
      logTest('Product links render', 'pass', `Found ${productLinks} product links`);
      results.passed++;
    } else {
      logTest('Product links render', 'fail', `Expected at least 3 product links, found ${productLinks}`);
      results.failed++;
    }
    
    // Test 8: Monitor network requests for SWR
    log('\n8. Monitoring network requests (10 seconds)...', 'yellow');
    
    let apiCallCount = 0;
    page.on('request', request => {
      if (request.url().includes('/api/navigation')) {
        apiCallCount++;
        log(`   API call detected at ${new Date().toLocaleTimeString()}`, 'blue');
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 12000)); // Wait 12 seconds to catch at least one SWR refresh (10s interval)
    
    if (apiCallCount >= 1) {
      logTest('SWR client-side updates', 'pass', `Detected ${apiCallCount} API calls (10s refresh interval)`);
      results.passed++;
    } else {
      logTest('SWR client-side updates', 'warn', 'No SWR API calls detected in 12 seconds');
      results.warnings++;
    }
    
    // Test 9: Check responsive behavior
    log('\n9. Testing responsive navigation...', 'yellow');
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mobileMenuButton = await page.locator('button[aria-label*="menu"], button:has(svg path[d*="M4 6h16"])').first();
    const mobileMenuVisible = await mobileMenuButton.isVisible();
    
    if (mobileMenuVisible) {
      logTest('Mobile menu button', 'pass', 'Mobile menu button is visible on small screens');
      results.passed++;
    } else {
      logTest('Mobile menu button', 'warn', 'Mobile menu button not found');
      results.warnings++;
    }
    
    // Test desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const desktopNav = await page.locator('nav.hidden.md\\:flex, nav:has(.mega-nav-item)').isVisible();
    
    if (desktopNav) {
      logTest('Desktop navigation', 'pass', 'Desktop navigation is visible on large screens');
      results.passed++;
    } else {
      logTest('Desktop navigation', 'warn', 'Desktop navigation not found');
      results.warnings++;
    }
    
  } catch (error) {
    log(`\nError during testing: ${error.message}`, 'red');
    results.failed++;
  }
  
  // Summary
  logSection('Test Summary');
  log(`Total Passed:   ${results.passed}`, 'green');
  log(`Total Failed:   ${results.failed}`, results.failed > 0 ? 'red' : 'reset');
  log(`Total Warnings: ${results.warnings}`, results.warnings > 0 ? 'yellow' : 'reset');
  
  const total = results.passed + results.failed + results.warnings;
  const successRate = total > 0 ? ((results.passed / total) * 100).toFixed(1) : 0;
  
  log(`\nSuccess Rate: ${successRate}%`, successRate >= 80 ? 'green' : 'red');
  
  if (results.failed === 0) {
    log('\n✓ All critical tests passed!', 'green');
  } else {
    log(`\n✗ ${results.failed} test(s) failed!`, 'red');
  }
  
  return results.failed === 0;
}

async function main() {
  log('Starting Headless Browser Cache Tests', 'cyan');
  log(`Node version: ${process.version}`);
  log(`Playwright version: ${require('@playwright/test/package.json').version}`);
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const context = await browser.newContext({
    userAgent: USER_AGENT,
    viewport: { width: 1280, height: 720 },
  });
  
  const page = await context.newPage();
  
  try {
    const success = await testCacheHeaders(page);
    await browser.close();
    
    process.exit(success ? 0 : 1);
  } catch (error) {
    log(`\nFatal error: ${error.message}`, 'red');
    console.error(error);
    await browser.close();
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  log(`\nUnhandled rejection: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

main();
