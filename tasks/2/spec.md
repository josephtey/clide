# Task #2: Fix React 18 and Sanity CORS Bugs After Vite Migration

**Repository:** joetey.com
**Status:** TODO
**Created:** 2026-02-01

## Requirements

Fix two bugs that appeared after migrating from Create React App to Vite:

1. **React 18 Deprecation Warning**: "ReactDOM.render is no longer supported in React 18. Use createRoot instead."
2. **Sanity CORS Error**: XMLHttpRequest blocked by CORS policy when fetching from `https://cdcjz2is.apicdn.sanity.io`

## Implementation Approach

### Fix 1: Migrate to React 18 createRoot API

**File to modify:** [src/index.jsx](src/index.jsx)

Update the React rendering code to use the new React 18 API:

1. Change import from `react-dom` to `react-dom/client`
2. Replace `ReactDOM.render()` with `createRoot().render()`

```javascript
// Change this:
import ReactDOM from "react-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      {/* routes */}
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// To this:
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      {/* routes */}
    </Router>
  </React.StrictMode>
);
```

### Fix 2: Add apiVersion to Sanity Client Configuration

**File to modify:** [src/client.js](src/client.js)

The CORS error is caused by missing `apiVersion` parameter, which is required by @sanity/client v6.21.3:

```javascript
// Change this:
export default sanityClient({
  projectId: "cdcjz2is",
  dataset: "production",
  useCdn: true,
});

// To this:
export default sanityClient({
  projectId: "cdcjz2is",
  dataset: "production",
  apiVersion: "2023-05-03",
  useCdn: true,
});
```

## Implementation Details

**Technology choices:**
- React 18.2.0 (already installed)
- @sanity/client 6.21.3 (already installed)
- apiVersion date: "2023-05-03" (stable Sanity API version)

**Files to modify:**
1. [src/index.jsx](src/index.jsx) - React 18 migration (2 line changes)
2. [src/client.js](src/client.js) - Add apiVersion (1 line addition)

**Components affected (no changes needed):**
- [src/components/TheLab.jsx](src/components/TheLab.jsx) - Uses Sanity client for blog post listing
- [src/components/LabPost.jsx](src/components/LabPost.jsx) - Uses Sanity client for individual posts

**Why this fixes the issues:**
- React 18 deprecation: The new `createRoot` API is the official React 18 way to render applications
- CORS error: The `apiVersion` parameter is required by Sanity client v6+. Without it, the client makes malformed requests that trigger CORS errors

## Success Criteria

### Verification Steps

1. **Start dev server:**
   ```bash
   cd /Users/josephtey/Projects/joetey.com
   npm run dev
   ```

2. **Check React 18 fix:**
   - Open browser console
   - Verify NO warning: "ReactDOM.render is no longer supported in React 18"
   - Homepage should render normally

3. **Check Sanity CORS fix:**
   - Navigate to `/the-lab` route
   - Verify blog posts load successfully
   - Check browser console - NO CORS errors
   - Check Network tab - requests to `cdcjz2is.apicdn.sanity.io` should succeed (200 status)
   - Click on a blog post to test `/the-lab/:slug` route
   - Verify post content and images load correctly

4. **Functional testing:**
   - All routes work correctly
   - Blog post filtering by category works
   - Images render via imageUrlBuilder
   - PortableText content displays properly

### Expected Outcomes

- ✅ No React deprecation warnings in console
- ✅ No CORS errors when fetching Sanity data
- ✅ Blog posts load on `/the-lab` page
- ✅ Individual blog posts accessible at `/the-lab/:slug`
- ✅ All existing functionality works as before

## Critical Files

- [src/index.jsx](src/index.jsx) - Primary file for React 18 fix
- [src/client.js](src/client.js) - Primary file for Sanity CORS fix
- [vite.config.js](vite.config.js) - Reference (no changes needed)
- [package.json](package.json) - Reference (no changes needed)
