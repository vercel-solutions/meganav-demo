# Cache Header Testing with Headless Browser

This directory contains automated tests for verifying cache headers and ISR (Incremental Static Regeneration) behavior on both local and Vercel deployments.

## Overview

The test suite uses Playwright in headless mode to:
1. ✅ Verify cache headers on navigation API (`s-maxage=360`)
2. ✅ Check cache HIT/MISS behavior
3. ✅ Test main page cache headers (`s-maxage=3600`)
4. ✅ Validate revalidation endpoint functionality
5. ✅ Confirm cache clearing after revalidation
6. ✅ Monitor SWR client-side updates (10s interval)
7. ✅ Test responsive navigation (mobile & desktop)
8. ✅ Verify navigation data structure

## Running Tests Locally

### Prerequisites
```bash
npm install
npx playwright install chromium
```

### Test Against Local Server
```bash
# Build and start production server
npm run build
npm start

# In another terminal, run tests
npm run test:cache
```

### Test Against Vercel Deployment
```bash
# Set deployment URL and run tests
DEPLOYMENT_URL=https://your-app.vercel.app npm run test:cache
```

## GitHub Actions Integration

The `.github/workflows/cache-tests.yml` workflow automatically:
- Runs tests on every pull request
- Waits for Vercel preview deployment
- Tests cache headers on the preview URL
- Comments results on the PR

### Manual Workflow Trigger
You can manually trigger the workflow from GitHub Actions with a custom deployment URL:
1. Go to Actions → Vercel Cache Tests
2. Click "Run workflow"
3. Enter the deployment URL (optional)
4. Click "Run workflow"

## Test Results

Example output from a successful test run:

```
============================================================
Testing Cache Headers on Vercel Deployment
============================================================
Target URL: http://localhost:3000

1. Testing /api/navigation endpoint...
   Status: 200
   Cache-Control: s-maxage=360, stale-while-revalidate=31535640
   X-Nextjs-Cache: HIT
✓ Navigation API cache-control header
  s-maxage=360 found

2. Making second request to check cache behavior...
   X-Nextjs-Cache: HIT
✓ Navigation API cache HIT
  Cache is working

3. Testing main page cache headers...
   Status: 200
   Cache-Control: s-maxage=3600, stale-while-revalidate=31532400
✓ Main page cache-control
  s-maxage=3600 (1 hour) found

4. Testing revalidation endpoint...
   Response: {"revalidated":true,"now":1770486745207}
✓ Revalidation endpoint
  Successfully triggered revalidation

5. Checking cache headers after revalidation...
   X-Nextjs-Cache: MISS
✓ Cache cleared after revalidation
  Cache shows MISS or STALE

6. Testing timestamp updates in navigation data...
   First timestamp:  Product 1 Saturday 05:52:08 PM
   Second timestamp: Product 1 Saturday 05:52:26 PM
✓ Navigation data structure
  Navigation data format is correct

7. Testing page load and SWR functionality in browser...
✓ Navigation renders
  MegaNav component is visible
✓ Product links render
  Found 6 product links

8. Monitoring network requests (10 seconds)...
   API call detected at 5:52:38 PM
✓ SWR client-side updates
  Detected 1 API calls (10s refresh interval)

9. Testing responsive navigation...
✓ Mobile menu button
  Mobile menu button is visible on small screens
✓ Desktop navigation
  Desktop navigation is visible on large screens

============================================================
Test Summary
============================================================
Total Passed:   11
Total Failed:   0
Total Warnings: 0

Success Rate: 100.0%

✓ All critical tests passed!
```

## What Gets Tested

### Cache Headers
- **Navigation API** (`/api/navigation`):
  - `cache-control: s-maxage=360` (6 minutes)
  - `x-nextjs-cache: HIT` on subsequent requests
  
- **Main Page** (`/`):
  - `cache-control: s-maxage=3600` (1 hour)

### Revalidation
- `/api/revalidate` endpoint returns `{"revalidated": true}`
- Cache shows `MISS` after revalidation
- New timestamps generated after revalidation

### SWR Behavior
- Client-side API calls to `/api/navigation` every 10 seconds
- Updates happen without page reload
- Navigation data stays fresh

### Responsive Design
- Mobile menu button visible on small screens
- Desktop navigation visible on large screens
- Both layouts render correctly

## Test Configuration

You can customize test behavior by editing `tests/cache-test.js`:

```javascript
// Configuration at the top of the file
const BASE_URL = process.env.DEPLOYMENT_URL || 'http://localhost:3000';
const TIMEOUT = 30000;
```

## CI/CD Integration

### Vercel + GitHub Actions
The workflow automatically tests every PR against its Vercel preview deployment:

1. PR is opened
2. Vercel creates preview deployment
3. GitHub Actions waits for deployment
4. Tests run against preview URL
5. Results posted as PR comment

### Testing Production Deployments
To test a production deployment:

```bash
DEPLOYMENT_URL=https://meganav-demo.vercel.app npm run test:cache
```

## Troubleshooting

### Tests fail with timeout
- Increase `TIMEOUT` constant in `cache-test.js`
- Check if the server is running
- Verify deployment URL is accessible

### Cache headers not found
- Wait a few seconds after deployment
- Make sure the application is fully deployed
- Check Vercel deployment logs

### SWR tests fail
- SWR updates happen every 10 seconds
- Test waits 12 seconds to catch at least one update
- If it fails, the page may not have fully loaded

## Benefits

This automated testing ensures:
- ✅ Cache headers are correct on every deployment
- ✅ ISR behavior works as expected
- ✅ Revalidation clears cache properly
- ✅ Client-side updates function correctly
- ✅ No manual testing required
- ✅ Confidence in cache configuration

## Next Steps

To test your Vercel deployment:
1. Push this branch to GitHub
2. Vercel will automatically create a preview deployment
3. GitHub Actions will run the tests
4. Check the PR for test results

Or manually test with:
```bash
DEPLOYMENT_URL=https://your-preview-url.vercel.app npm run test:cache
```
