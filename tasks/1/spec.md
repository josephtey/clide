# Task #1: Dark mode

**Repository:** joetey.com
**Status:** TODO
**Created:** 2026-02-01T00:00:00Z

## Requirements

Implement a comprehensive dark mode feature for the entire application with the following specifications:

### Core Functionality
- Add a toggle button that allows users to switch between light and dark themes
- Apply dark mode styling across all pages and components in the application
- Ensure the user's theme preference persists across sessions (using localStorage)
- Provide smooth transitions between light and dark modes

### Toggle Button
- Create a visible, accessible toggle button/switch
- Place it in a prominent location (header/navigation area recommended)
- Include clear visual feedback when switching themes
- Consider using sun/moon icons or similar to indicate current mode

### Dark Mode Styling
- Define a cohesive dark color palette that provides good contrast and readability
- Apply dark theme to all UI components including:
  - Navigation/header
  - Main content areas
  - Footers
  - Cards and containers
  - Forms and inputs
  - Buttons and interactive elements
  - Text and headings
- Ensure all text remains readable with appropriate contrast ratios (WCAG AA compliance)
- Handle images and media appropriately in dark mode

### Technical Implementation
- Use CSS variables or a theming system for easy color management
- Store theme preference in localStorage
- Load saved preference on initial page load
- Optionally: respect user's system preference (`prefers-color-scheme`) as default

## Implementation Notes

- Follow existing code patterns and styling architecture in the repository
- Ensure mobile responsiveness is maintained in both themes
- Test thoroughly across different pages to ensure consistency
- Add appropriate error handling for localStorage access
- Consider performance impact of theme switching
- Write clean, maintainable code

## Success Criteria

- Dark mode toggle button is visible and functional
- All pages and components properly display in both light and dark modes
- Theme preference persists across browser sessions
- No breaking changes to existing functionality
- Smooth user experience when switching themes
- Code follows repository conventions
- All existing tests pass (if applicable)
