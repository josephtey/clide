# Task #4: Add Bookshelf Feature to joetey.com (V1 - Hardcoded)

**Repository:** joetey.com
**Status:** TODO
**Created:** 2026-02-01

## Design Vision

A **vertically stacked bookshelf** inspired by Stripe Press, where books are displayed as horizontal rows that stack on top of each other. Each row shows the book cover prominently with title/author info. When hovering, the entire row responds with pleasant visual feedback (subtle lift, shadow, or color shift).

**Key inspirations:**
- Stripe Press: Vertical stacking, individual book focus, editorial quality
- Ninkle's reading lists: Year-based organization, featured quotes
- **Add color and warmth** to avoid feeling dry

## User Requirements (V1 Simplified)

**Track for each book:**
- Basic info: title, author, cover image URL
- Reading status: Currently Reading / Finished / Want to Read
- Quotes & highlights (no page numbers needed for V1)

**Organization:**
- Filter by reading status
- **Hardcoded data** - no Sanity integration for V1

**Interaction:**
- Click/tap a book → modal opens with cover and quotes
- Pleasant hover effect on each stacked book

## Architecture Overview

**Technology Stack:**
- React 18 + Vite
- **Hardcoded book data** (JavaScript array in component)
- Tailwind CSS + Framer Motion
- Route already exists: `/books-im-reading`

**Simplified approach:**
- No Sanity CMS (V1 only)
- No dates tracking
- No rich text notes - just simple quotes
- Modal shows: cover + quotes only

## Implementation Plan

### Phase 1: Hardcoded Data Structure

**In BooksImReading.jsx, define books array:**

```javascript
const booksData = [
  {
    id: 1,
    title: "Gravity and Grace",
    author: "Simone Weil",
    coverUrl: "URL_TO_COVER_IMAGE",
    status: "finished", // 'reading' | 'finished' | 'wantToRead'
    quotes: [
      "All the natural movements of the soul are controlled by laws analogous to those of physical gravity.",
      "Grace fills empty spaces, but it can only enter where there is a void to receive it."
    ]
  },
  // ... more books
];
```

**Data structure:**
- `id`: unique number
- `title`: string
- `author`: string
- `coverUrl`: direct URL to cover image (can use external URLs or local `/public` images)
- `status`: 'reading' | 'finished' | 'wantToRead'
- `quotes`: array of strings (simple, no page numbers)

### Phase 2: Main Bookshelf Component

**Replace: `/src/components/BooksImReading.jsx`**

**Layout approach:**
- **Vertical stack of book rows** (not a grid)
- Each row is a horizontal card containing:
  - Book cover (left side, ~120-150px wide)
  - Book info (right side: title, author, status badge)
- Full-width rows with consistent spacing
- Container: `max-w-[900px]` for comfortable reading width

**Status filtering:**
- Filter buttons at top: All Books / Currently Reading / Finished / Want to Read
- Animated transition when changing filters (200ms fade)
- Button styling: border with fill on active state

**Hover effect (THE MAGIC):**
- Subtle scale up (1.02x) with smooth spring animation
- Shadow intensifies (shadow-md → shadow-xl)
- Optional: slight background color shift
- Cursor changes to pointer
- Feels pleasant and responsive, not jarring

**Data source:**
- **Hardcoded `booksData` array at top of component**
- Client-side filtering by selected status
- No API calls, no Sanity queries

**State management:**
- `selectedStatus` - current filter ('all', 'reading', 'finished', 'wantToRead')
- `selectedBook` - book for modal (or null)
- `modalOpen` - modal visibility boolean
- `isAnimating` - for filter transition animation

**Color palette integration:**
- Use joetey.com colors: joe-green, joe-blue, joe-yellow
- Status badges with different colors:
  - Currently Reading: joe-green
  - Finished: joe-blue
  - Want to Read: joe-yellow
- Adds warmth and avoids "dry" feeling

### Phase 3: Book Row Card Component

**Create: `/src/components/BookCard.jsx`**

**Structure:**
```
<motion.div> (horizontal card, full width)
  <div> (flex container)
    <div> (book cover - fixed width ~150px)
      <img> (cover image, maintain aspect ratio)
    </div>
    <div> (book info - flex-grow)
      <h3> (title - large, EB Garamond)
      <p> (author - gray text)
      <div> (status badge - colored pill)
      <div> (dates if available)
    </div>
  </div>
</motion.div>
```

**Styling:**
- Border around entire card (black, 1-2px)
- Background: white or subtle cream
- Padding: generous (p-6)
- Gap between cover and info: 24px
- Cover: aspect-[2/3], object-cover
- Status badge: absolute top-right or inline

**Hover animation:**
```javascript
whileHover={{
  scale: 1.02,
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
  transition: { type: "spring", stiffness: 300, damping: 20 }
}}
```

**Color accents:**
- Status badge background uses joe color palette
- Border can slightly change color on hover (black → joe-green)

### Phase 4: Book Detail Modal (Simplified)

**Create: `/src/components/BookModal.jsx`**

**Layout:**
- MUI Modal component (already installed)
- Centered overlay, max-width 800px
- Two-column layout (responsive: stack on mobile):
  - Left: Large cover image (~300px wide)
  - Right: Quotes list

**Sections in modal:**
1. **Header**: Title (large), Author
2. **Quotes Only**:
   - Each quote in a simple card/box
   - Style: light background, border, italic text for quote
   - No page numbers, no notes (V1 simplification)

**Styling:**
- Background: cream (#fff9ec)
- Close button: top-right (X icon from react-icons)
- Padding: generous (p-6 or p-8)
- EB Garamond for headings
- Scrollable if many quotes

**Animation:**
- Fade in + subtle scale (0.95 → 1.0)
- 200-300ms duration
- Exit animation on close

**NO complex features:**
- No dates
- No reading notes section
- No PortableText (just plain text quotes)
- No page numbers

### Phase 5: Navigation Integration

**Update: `/src/App.jsx`**

The navigation link already exists but is commented out (lines 122-129):
```javascript
<Link className="link" to="/books-im-reading">
  books i'm reading
</Link>
```

**Action:** Uncomment this link to make bookshelf accessible from homepage.

### Phase 6: Styling Details

**Color usage (add warmth):**
- Status badges:
  - Reading: `bg-joe-green text-white`
  - Finished: `bg-joe-blue text-white`
  - Want to Read: `bg-joe-yellow text-black`
- Hover accent: `border-joe-green` or subtle green glow
- Quote cards: light colored backgrounds matching status

**Typography:**
- Headings: EB Garamond (existing primary font)
- Body: Standard font stack
- Book titles: Bold, 24px
- Authors: Regular, 16px, gray
- Quotes: Italic

**Spacing:**
- Between book rows: mb-4 or mb-6
- Within card: p-6
- Container padding: px-12
- Max width: 900px (narrower than The Lab's 1200px for reading comfort)

## Data Sorting (Client-Side)

Since data is hardcoded, we can just manually order the array as we want:
- Put "Currently Reading" books first
- Then "Finished" books
- Then "Want to Read" books

Or use simple JavaScript sort if needed:
```javascript
const sortedBooks = [...booksData].sort((a, b) => {
  const statusOrder = { reading: 0, finished: 1, wantToRead: 2 };
  return statusOrder[a.status] - statusOrder[b.status];
});
```

## Files to Create/Modify (V1 Simplified)

**Create:**
1. `/src/components/BookCard.jsx` - Individual stacked book row
2. `/src/components/BookModal.jsx` - Simple modal with quotes only

**Modify:**
3. `/src/components/BooksImReading.jsx` - Complete implementation with hardcoded data
4. `/src/App.jsx` - Uncomment navigation link (lines 122-129)

**No Sanity changes needed for V1!**
- No schema files
- No backend setup
- Just pure React components

**No changes needed:**
- Routing already exists in `/src/index.jsx`
- All dependencies already installed (MUI, Framer Motion, etc.)

## Implementation Order (V1 - Much Simpler!)

1. **Create hardcoded data:**
   - Define `booksData` array in `BooksImReading.jsx`
   - Add at least 2-3 sample books (including Simone Weil's "Gravity and Grace")
   - Use placeholder cover image URLs (can use `/public` folder or external URLs)

2. **Build components:**
   - Create `BookCard.jsx` (the stacked row with hover effect)
   - Create `BookModal.jsx` (simple modal with cover + quotes)
   - Complete `BooksImReading.jsx` implementation (filtering, layout, state)

3. **Integration:**
   - Uncomment navigation in `App.jsx` (lines 122-129)
   - Test the flow: navigate → see books → filter → click → modal

4. **Polish:**
   - Fine-tune hover spring animation
   - Adjust colors for warmth (joe palette)
   - Test responsive behavior on mobile
   - Make sure it feels pleasant and not dry!

## Key Design Decisions

**Vertical stacking over grid:**
- More editorial, less "catalog"
- Each book gets individual attention
- Easier to scan titles/authors
- Better for displaying quotes inline (future enhancement)
- Inspired by Stripe Press's focus on quality over quantity

**Horizontal card layout:**
- Cover on left (visual anchor)
- Info on right (scannable)
- Natural left-to-right reading flow
- Works well on mobile (can stack cover on top)

**Status-based filtering:**
- Simpler than genre/category system
- Aligns with how people think about reading ("what am I reading now?")
- Easy to implement and maintain
- Can add year-based grouping later if desired

**Modal vs dedicated pages:**
- Faster interaction
- Maintains scroll position in bookshelf
- Cleaner URLs
- Good for focused reading of quotes/notes

**Color injection:**
- Status badges with joe palette colors
- Prevents "dry" Goodreads feeling
- Maintains joetey.com brand consistency
- Adds personality and warmth

## Testing Checklist (V1)

- [ ] Hardcoded books display correctly
- [ ] Vertical stack layout looks good
- [ ] Book covers maintain aspect ratio
- [ ] Hover effect is smooth and pleasant (spring animation feels nice!)
- [ ] Status filter buttons work
- [ ] Filter transition animates cleanly (200ms fade)
- [ ] Clicking book opens modal
- [ ] Modal shows cover + quotes
- [ ] Quotes render cleanly (italic, in boxes)
- [ ] Close button works (X icon)
- [ ] Clicking outside modal closes it
- [ ] Responsive: cards stack on mobile
- [ ] Colors look warm and inviting (not dry!)
- [ ] Empty filter states show message

## Future Enhancements (V2+)

- Migrate to Sanity CMS (proper backend)
- Add dates (dateStarted, dateFinished)
- Year-based grouping (2024, 2023, etc.)
- Page numbers for quotes
- Personal notes/reflections on books
- Full reading notes (rich text)
- Search by title/author
- Reading statistics
- Star ratings

## Verification

**To test after implementation:**
1. Navigate to `/books-im-reading`
2. See vertical stack of book rows
3. Hover over a book → pleasant lift and shadow effect
4. Click "Currently Reading" filter → only reading books show
5. Click a book → modal opens with cover, quotes, notes
6. Close modal → back to bookshelf
7. Try on mobile → cards stack vertically, responsive
8. Check that colors feel warm and vibrant (not dry)
