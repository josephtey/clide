# Testing and Verification Guide

## When to Use Playwright Testing

**ALWAYS use Playwright to test and verify:**
1. **Frontend implementations** - Any task that creates or modifies a web UI
2. **Bug fixes** - When refining tasks to fix reported issues
3. **User-facing features** - Chat interfaces, forms, interactive components
4. **Before approval** - Test tasks in staging to verify they work as expected

## Playwright Testing Workflow

### 1. Write a Test Script
Create a focused test that:
- Navigates to the application
- Interacts with the UI (click, type, etc.)
- Captures console logs and network requests
- Takes screenshots for debugging
- Verifies expected behavior

**Example test structure:**
```javascript
const { chromium } = require('playwright');

async function testFeature() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Capture logs and errors
  page.on('console', msg => console.log(`[${msg.type()}] ${msg.text()}`));

  // Test the feature
  await page.goto('http://localhost:3000');
  await page.locator('input').fill('test message');
  await page.locator('button').click();

  // Wait and verify
  await page.waitForTimeout(5000);
  const hasResult = await page.locator('text=/expected/i').count() > 0;

  // Screenshot
  await page.screenshot({ path: '/tmp/test-result.png' });

  await browser.close();
  return hasResult;
}
```

### 2. Run Tests for Bug Reports
When a user reports something "not working":
- Ask them to describe the issue
- Write a Playwright test that reproduces the problem
- Run the test to confirm the bug
- Use test output to diagnose the root cause
- Fix the issue
- Re-run the test to verify the fix

### 3. Verify Before Approval
Before approving a task (moving from staging to completed):
- Write tests for core functionality
- Verify all features work as expected
- Check for console errors or warnings
- Ensure UI displays correctly
- Test edge cases

## Test Output Analysis

Playwright tests provide critical debugging information:
- **Console logs** - Shows JS errors, API calls, state updates
- **Network logs** - Reveals failed requests, response data
- **Screenshots** - Visual verification of UI state
- **DOM queries** - Confirms elements are rendered

Use this information to:
1. **Identify root cause** - Console errors, failed network requests
2. **Verify fixes** - Elements that were missing now appear
3. **Document issues** - Screenshot evidence for refinements

## Installing Playwright

When first using Playwright in a session:
```bash
cd /tmp
npm init -y
npm install playwright
npx playwright install chromium
```

Then run tests:
```bash
node test-script.js
```

## Best Practices for Testing

1. **Test early** - Don't wait for user complaints, test proactively
2. **Test thoroughly** - Cover happy path and edge cases
3. **Capture everything** - Console logs, network, screenshots
4. **Non-headless first** - Use `headless: false` to watch behavior
5. **Generous timeouts** - Wait long enough for async operations
6. **Close the loop** - Always verify fixes with a re-test

## Example: Bug Fix Workflow

```
1. User reports: "Messages not appearing"
2. Write Playwright test that sends a message
3. Run test → Confirms bug (no messages visible)
4. Analyze test output:
   - Console: "✅ Event parsed"
   - Network: "200 OK"
   - DOM: Text found but not visible
   - Diagnosis: CSS/rendering issue
5. Spawn refinement agent with detailed findings
6. Agent fixes the issue
7. Re-run Playwright test → Confirms fix works
8. Approve and merge with confidence
```

## Integration with Refinement Workflow

When refining tasks:
1. **Before refinement**: Run Playwright test to reproduce the issue
2. **Document findings**: Include test output in refinement prompt
3. **After refinement**: Re-run test to verify the fix
4. **Approve only if**: Tests pass and functionality is confirmed

This closes the loop and ensures high-quality implementations.
