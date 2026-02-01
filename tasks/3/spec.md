# Task #3: Optimize Front Page Text for Clearer Value Proposition

**Repository:** joetey.com
**Status:** TODO
**Created:** 2026-02-01

## Requirements

Optimize the front page text to make it "WAY better" by:
1. Creating a **clearer value proposition** - emphasize what makes Joe unique and create a stronger narrative thread
2. Using a **professional but warm** tone - maintain credibility while being approachable and human
3. **Improving the project list** - make the "More Random Bits About Me" descriptions more compelling and better written

## Current State Analysis

**Current bio text:**
```
"I study artificial intelligence at Stanford, interpret DNA models at
the Arc Institute, and research algorithms for human learning at the
Piech lab. I sometimes post my explorations in my own lab."
```

**Issues:**
- Lists activities but doesn't convey the "why" or unifying vision
- Technical/resume-like rather than engaging
- Doesn't create a clear narrative about who Joe is or what drives him
- Lacks personality and warmth

**Current project list:**
- 5 bullet points covering education tech, design/animation, and engineering work
- Factual but dry descriptions
- Doesn't tell a compelling story about the breadth of experience
- Could better highlight impact and unique angle

## Implementation Approach

### 1. Rewrite Main Bio

**Strategy:**
- Lead with a compelling hook about the intersection of interests (AI, education, design)
- Create a narrative thread connecting Stanford research → Arc Institute DNA work → human learning
- Add warmth through personal voice while maintaining professionalism
- Keep it concise but more engaging than current version
- End with a personal touch (the "lab" exploration concept)

**Approach:**
- 2-3 sentences maximum
- Focus on the "why" not just the "what"
- Connect the dots between different work streams
- Use active voice and stronger verbs

### 2. Improve Project Descriptions

**Strategy for each project:**
- Lead with impact/outcome rather than just description
- Add specific numbers/scale where impressive
- Use stronger, more vivid language
- Connect to the overall narrative (intersection of tech, education, design)
- Keep professional but inject warmth through word choice

**Projects to highlight:**
1. **Sherpa (Oral Exam Scaling)** - Education AI/voice tech
2. **Code in Place** - Large-scale education platform (30k students)
3. **Animation & Design** - Creative work with YouTube following
4. **Teaching (YouTube)** - Design education content
5. **Past Engineering Work** - Diverse startup/company experience

### 3. Visual Hierarchy & Structure

**File to modify:** [src/App.jsx](src/App.jsx)

**Changes:**
- Update lines 23-31: Main bio text (currently lines 23-26 with bio, line 30-31 with lab link)
- Update lines 66-112: "More Random Bits About Me" section with improved project descriptions
- Keep existing structure/layout (works well visually)
- Maintain existing Tailwind styling and animations
- No changes to navigation, header, or other components

## Implementation Details

**Technology/Stack:**
- React component (App.jsx)
- Tailwind CSS for styling (already applied)
- Framer Motion for animations (already implemented)
- No new dependencies needed

**Existing patterns to follow:**
- EB Garamond font
- Color palette (black-primary #242323, dark-gray #505050, green links #376649)
- Clean, minimal design aesthetic
- Fade-in animation on mount
- Max width 800px container

**Tone guidelines:**
- Professional but warm - avoid jargon while maintaining credibility
- Use "I" voice authentically
- Active verbs, concrete language
- Show personality without being casual/informal
- Balance achievement with curiosity

## Success Criteria

### Content Quality
- ✅ Bio clearly communicates unique value proposition (intersection of AI, education, design/creativity)
- ✅ Narrative thread connects different work areas
- ✅ Tone is professional but warm and engaging
- ✅ Project descriptions are more compelling and specific
- ✅ Text shows impact and scale where relevant

### Technical Requirements
- ✅ All changes isolated to App.jsx text content
- ✅ No breaking changes to layout or styling
- ✅ Existing animations and interactions preserved
- ✅ Responsive design maintained
- ✅ No console errors or warnings

### User Experience
- ✅ Text is easier to read and more engaging
- ✅ Visitor understands who Joe is and what makes him unique
- ✅ Professional credibility maintained while feeling more human
- ✅ Clear narrative connects the diverse experiences

## Verification Steps

1. **Start dev server:**
   ```bash
   cd /Users/josephtey/Projects/joetey.com
   npm run dev
   ```

2. **Review front page:**
   - Read the bio text - does it clearly communicate value proposition?
   - Check tone - professional but warm?
   - Read project descriptions - more compelling than before?
   - Verify narrative flow and connection between sections

3. **Technical checks:**
   - Page renders without errors
   - Animations work correctly
   - Layout/styling unchanged
   - Responsive design works on mobile
   - All links functional

4. **Comparison test:**
   - Compare new text against old (commented out in code)
   - Verify improvement in clarity, engagement, and warmth

## Critical Files

- [src/App.jsx](src/App.jsx) - Primary file to modify (bio text and project descriptions)
- [src/index.css](src/index.css) - Reference for color palette and styling (no changes)
- [src/styles/components.css](src/styles/components.css) - Reference for link styling (no changes)
