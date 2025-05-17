# MegaNav Demo

This demo showcases a modern, performant mega navigation solution built with Next.js that solves two key problems:

1. How to update navigation without revalidating all ISR pages that use it
2. How to achieve optimal Core Web Vitals while keeping navigation data fresh

## Key Features

### Server-Side Rendered with Client-Side Updates

- Initial render is done on the server using build-time data
- Client-side updates using SWR for data freshness
- Zero Cumulative Layout Shift (CLS) due to CSS-first approach
- Navigation data is always fresh in the client without affecting page performance

### Smart Caching Strategy

- Navigation endpoint is cached (like ISR) and can be revalidated using `revalidatePath`
- All product pages are static (ISR) with time-based revalidation (1 hour)
- Perfect for large sites with thousands of pages - update navigation without revalidating all pages
- See the implementation in [app/api/navigation/route.ts](app/api/navigation/route.ts)

### Configurable Data Freshness

- Time interval updates (default: 10 seconds)
- Can be configured for:
  - On focus updates
  - On mount updates
  - Manual refresh
- See the configuration in [components/MegaNav.tsx](components/MegaNav.tsx)

### Visual Demo

- Product links in the menu include timestamps
- Initial load shows stale timestamps
- Real-time updates when using the website
- CSS-first approach inspired by M&S MegaNav: [View on CodePen](https://codepen.io/nguyenanhtuan/pen/VwqxwJG)

### Testing the CSS-First Approach

![CleanShot 2025-05-17 at 20 19 03](https://github.com/user-attachments/assets/d87a51f2-e300-497b-b6dc-c2ae4f40e07f)


To verify the CSS-first implementation and its benefits:

1. Open the page in Chrome Browser
2. Disable JavaScript (DevTools > Settings > Debugger > Disable JavaScript)
3. Notice how:
   - The responsive design works perfectly on both mobile and desktop
   - The MegaNav renders and functions without any JavaScript
   - On desktop, the dropdown menus work with pure CSS hover states
   - On mobile, the menu is accessible and responsive
4. This approach ensures:
   - Perfect Core Web Vitals (CWV) scores
   - No JavaScript blocking the main thread
   - Immediate visual feedback for user interactions
   - Progressive enhancement when JavaScript is available

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technical Implementation

The demo uses several Next.js features:

- App Router for server components
- Route Handlers for the navigation API
- SWR for client-side data fetching
- CSS-first approach for optimal performance

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [SWR Documentation](https://swr.vercel.app)
- [Next.js App Router](https://nextjs.org/docs/app/building-your-application/routing)
- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
