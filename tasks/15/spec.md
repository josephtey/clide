# Task #15: Add Two New Books to Bookshelf

**Repository:** joetey.com
**Mode:** Fast Track
**Created:** 2026-02-14T12:10:00Z

## Description

Add two new books to the hardcoded bookshelf on joetey.com:

1. **"Crying in H-Mart"** by Michelle Zauner
   - Color: Red (a red that fits the existing palette)
   - Status: reading or finished (agent to decide based on current date)

2. **"The Idea Factory"** by Jon Gertner
   - Color: Rainbow gradient (vintage Apple-like rainbow)
   - Status: reading or finished (agent to decide)

## Implementation

- Locate the books data in `src/components/BooksImReading.jsx`
- Add the two new book objects to the hardcoded books array
- For "Crying in H-Mart": Use a red color that complements the existing palette (e.g., `#8B4545`, `#A04A4A`, or similar warm red)
- For "The Idea Factory": Implement a vintage Apple rainbow gradient effect (horizontal stripes: red, orange, yellow, green, blue, purple)
- Add appropriate year (2026 for currently reading, 2025 for finished)
- Add 2-3 relevant quotes for each book (can be placeholder quotes or real ones)
- Ensure the rainbow effect works with the book spine layout

## Technical Notes

- Books use inline styles for colors in the BookCard component
- May need to use CSS gradient for the rainbow effect: `background: linear-gradient(to bottom, #FF0000, #FFA500, #FFFF00, #00FF00, #0000FF, #8B00FF)`
- Ensure text remains readable on both red and rainbow backgrounds

## Success Criteria

- Two new books appear on the bookshelf
- "Crying in H-Mart" has a tasteful red color that fits the palette
- "The Idea Factory" has a vintage Apple-style rainbow gradient
- Text is readable on both book spines
- Books follow existing patterns (quotes, status, etc.)
