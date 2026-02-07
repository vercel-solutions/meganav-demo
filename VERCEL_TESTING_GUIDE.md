# Vercel Deployment Testing Guide

## Next.js 16.1.6 Upgrade - Cache Headers & Revalidation Testing

This document outlines how to test the MegaNav demo on Vercel after deploying the Next.js 16 upgrade.

### Prerequisites
- The PR has been merged or the branch has been deployed to Vercel
- Access to the Vercel deployment URL

### Test 1: Verify Navigation API Cache Headers

```bash
curl -I https://your-deployment-url.vercel.app/api/navigation
```

**Expected Response Headers:**
```
cache-control: s-maxage=360, stale-while-revalidate=31535640
x-nextjs-cache: HIT (after first request)
```

**What this means:**
- `s-maxage=360`: CDN will cache for 360 seconds (6 minutes)
- `stale-while-revalidate=31535640`: Stale content can be served while revalidating for ~1 year
- `x-nextjs-cache: HIT`: Response is served from Next.js cache

### Test 2: Verify Cache is Working

```bash
# First request
curl -s https://your-deployment-url.vercel.app/api/navigation | jq .

# Second request (within 6 minutes)
curl -s https://your-deployment-url.vercel.app/api/navigation | jq .
```

**Expected behavior:**
- Both requests should return the same timestamps in product titles
- This confirms the cache is working correctly

### Test 3: Test Manual Revalidation

```bash
# Trigger revalidation
curl https://your-deployment-url.vercel.app/api/revalidate

# Check cache status
curl -I https://your-deployment-url.vercel.app/api/navigation
```

**Expected behavior:**
- Revalidation endpoint returns: `{"revalidated":true,"now":...}`
- Next request to `/api/navigation` should have `x-nextjs-cache: MISS`
- New timestamps should be generated

### Test 4: Verify Client-Side SWR Updates

1. Open the deployed app in a browser: `https://your-deployment-url.vercel.app/`
2. Open browser DevTools → Network tab
3. Watch for requests to `/api/navigation`
4. Wait 10 seconds

**Expected behavior:**
- Browser should fetch `/api/navigation` every 10 seconds (SWR refreshInterval)
- Product titles should update with new timestamps
- No page reload required

### Test 5: Verify Page ISR (Incremental Static Regeneration)

```bash
curl -I https://your-deployment-url.vercel.app/
```

**Expected Response Headers:**
```
cache-control: s-maxage=3600, stale-while-revalidate=...
```

**What this means:**
- Main page is cached for 1 hour (3600 seconds)
- Navigation can update independently without revalidating all pages

### Test 6: Performance & Core Web Vitals

1. Open the app in Chrome
2. Open DevTools → Lighthouse
3. Run a Lighthouse audit

**Expected scores:**
- Performance: >90
- CLS (Cumulative Layout Shift): ~0 (no layout shift from navigation)
- FCP (First Contentful Paint): Fast

### Test 7: CSS-First Mega Nav (No JavaScript)

1. Open DevTools → Settings → Debugger → Disable JavaScript
2. Refresh the page
3. Test the navigation menu (desktop and mobile)

**Expected behavior:**
- Desktop: Hover over "Products" shows dropdown (pure CSS)
- Mobile: Navigation still renders correctly
- No JavaScript errors or broken functionality

## Key Features to Verify

### ✅ Server-Side Rendering
- Initial render uses build-time data
- No flash of unstyled content

### ✅ Smart Caching
- Navigation API cached for 6 minutes
- Main pages cached for 1 hour
- Can update navigation without revalidating all pages

### ✅ Client-Side Updates
- SWR refreshes navigation data every 10 seconds
- Seamless updates without page reload
- Always fresh navigation data

### ✅ Manual Revalidation
- `/api/revalidate` endpoint clears navigation cache
- Useful for CMS webhook integrations
- Immediate updates when content changes

## Troubleshooting

### Issue: Cache headers missing
**Cause:** Vercel might need time to propagate deployment
**Solution:** Wait a few minutes and retry

### Issue: x-nextjs-cache always shows MISS
**Cause:** Cache might be disabled or not warmed up
**Solution:** Make multiple requests to warm the cache

### Issue: Timestamps not updating
**Cause:** SWR not running on client
**Solution:** Check browser console for JavaScript errors

## Expected Performance Characteristics

### Cache Behavior
- **First request:** MISS (generates fresh content)
- **Subsequent requests (within 6 min):** HIT (from cache)
- **After revalidation:** MISS (then HIT again)

### Page Load Times (on Vercel)
- **Cold start:** < 2 seconds
- **Cached:** < 500ms
- **Navigation updates:** < 100ms (SWR)

## Next.js 16 Specific Features

### Turbopack in Production
The build now uses Turbopack which provides:
- Faster builds
- Better tree-shaking
- Improved HMR in development

### React 19 Compatibility
The upgrade includes React 19 which brings:
- Improved concurrent rendering
- Better hydration
- New hooks and APIs

### TypeScript Configuration
Next.js 16 automatically updated:
- `jsx: "react-jsx"` (automatic JSX runtime)
- `.next/dev/types/**/*.ts` in includes

## Summary

The MegaNav demo showcases how to build performant navigation with:
1. **ISR** for main pages (1-hour cache)
2. **Separate caching** for navigation (6-minute cache)
3. **Client-side updates** via SWR (10-second refresh)
4. **Manual revalidation** for immediate updates

This approach allows updating navigation across thousands of ISR pages without revalidating them all, while maintaining fresh data and optimal Core Web Vitals.
