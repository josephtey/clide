# Task #10: Uncomment Navigation Bar in joetey.com

**Repository:** joetey.com
**Status:** TODO
**Created:** 2026-02-13T00:00:00Z

## Context

The navigation bar in the joetey.com website is currently commented out. This task will restore the navigation menu to provide users with links to key sections of the site: "the lab", "my thoughts", "what I believe in", "my part of the internet", and "books I'm reading".

## Critical Files

- `/Users/josephtey/Projects/joetey.com/src/App.jsx` (lines 93-134)

## Implementation Approach

1. **Uncomment the navigation bar**
   - Remove JSX comment wrapper `{/* ... */}` from lines 93-134 in `src/App.jsx`
   - The nav bar contains a `<ul>` element with 5 navigation items
   - Each item has hover effects (`hover:before:content-['--->']`) and click handlers

2. **Navigation structure to restore:**
   - "the lab" → navigates to `/the-lab`
   - "my thoughts" → shows "coming soon" alert
   - "what I believe in" → navigates to `/what-i-believe-in`
   - "my part of the internet" → navigates to `/my-part-of-the-internet`
   - "books I'm reading" → navigates to `/books-im-reading`

## Success Criteria

1. Start the development server (`npm run dev` or equivalent)
2. Verify the navigation bar appears on the homepage
3. Test each navigation link:
   - Click "the lab" → should navigate to the lab page
   - Click "my thoughts" → should show alert
   - Click other links → should navigate to respective pages
4. Verify hover effects work (arrow `-->` appears before items on hover)
5. Check responsiveness on different screen sizes
