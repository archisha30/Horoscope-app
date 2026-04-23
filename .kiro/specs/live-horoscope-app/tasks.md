# Implementation Plan

- [ ] 1. Refactor project into ES modules and set up testing framework
  - Split existing `script.js` into `format.js`, `api.js`, `ui.js`, and `main.js` under a `src/` directory
  - Update `index.html` to load `src/main.js` as `type="module"`
  - Add `package.json` with Vitest and fast-check as dev dependencies
  - Add `vitest.config.js` configured for jsdom environment
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2. Implement format.js — pure utility functions
- [ ] 2.1 Implement `buildApiUrl(sign)`
  - Returns the full API URL string with the sign interpolated
  - _Requirements: 1.2_

- [ ]* 2.2 Write property test for Property 1: API URL contains the sign
  - **Property 1: API URL contains the sign**
  - **Validates: Requirements 1.2**
  - Use `fc.constantFrom(...signs)` to generate valid sign strings; assert URL contains sign

- [ ] 2.3 Implement `formatDate(date)`
  - Returns a string in "Month DD, YYYY" format from a Date object
  - _Requirements: 4.2_

- [ ]* 2.4 Write property test for Property 5: Date formatter pattern
  - **Property 5: Date formatter always produces "Month DD, YYYY" pattern**
  - **Validates: Requirements 4.2**
  - Use `fc.date()` to generate arbitrary dates; assert result matches regex

- [ ] 2.5 Implement `parseResponse(data)`
  - Returns the `horoscope` string if present and non-empty, otherwise returns `null`
  - _Requirements: 3.3_

- [ ]* 2.6 Write property test for Property 4: parseResponse null on missing/empty field
  - **Property 4: parseResponse returns null for missing or empty prediction field**
  - **Validates: Requirements 3.3**
  - Use `fc.oneof` with null, undefined, whitespace strings, and objects missing the field

- [ ] 3. Implement api.js — live API fetch
- [ ] 3.1 Implement `fetchHoroscope(sign)`
  - Calls `buildApiUrl(sign)`, fetches, checks response.ok, calls `parseResponse`
  - Throws a human-readable Error on non-2xx status or network failure
  - Returns the prediction string on success; throws if `parseResponse` returns null
  - _Requirements: 1.2, 3.1, 3.2, 3.3_

- [ ]* 3.2 Write property test for Property 3: Error handler produces non-empty message
  - **Property 3: Error handler produces non-empty message for any error input**
  - **Validates: Requirements 3.1, 3.2**
  - Mock fetch to return various non-2xx status codes; assert thrown Error message is non-empty string

- [ ] 4. Implement ui.js — DOM rendering functions
- [ ] 4.1 Implement `renderLoading()`, `setButtonState(disabled)`, `renderError(message)`
  - `renderLoading` sets Result Panel innerHTML to a loading indicator and removes `hidden` class
  - `setButtonState` sets the button's `disabled` property
  - `renderError` sets Result Panel innerHTML to the error message
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2_

- [ ] 4.2 Implement `renderResult(sign, date, prediction)`
  - Sets Result Panel innerHTML to show sign name, date, and prediction text
  - Replaces any existing content (not appends)
  - _Requirements: 1.3, 4.1, 4.2, 4.3_

- [ ]* 4.3 Write property test for Property 2: Render output contains sign and prediction
  - **Property 2: Render output contains sign name and prediction**
  - **Validates: Requirements 1.3, 4.1**
  - Use `fc.string()` for sign, date, prediction; assert rendered HTML contains both

- [ ]* 4.4 Write property test for Property 6: Render replaces not appends
  - **Property 6: Render replaces, not appends**
  - **Validates: Requirements 4.3**
  - Call `renderResult` twice with different predictions; assert panel contains only second

- [ ] 5. Implement main.js — event orchestration
- [ ] 5.1 Wire button click to full fetch lifecycle
  - Validate sign selection; show inline message if empty (Requirement 1.4)
  - Call `renderLoading()` and `setButtonState(true)` before fetch
  - On success: call `renderResult` with sign, `formatDate(new Date())`, prediction
  - On failure: call `renderError` with error message
  - In finally block: call `setButtonState(false)`
  - _Requirements: 1.4, 2.1, 2.2, 2.3_

- [ ]* 5.2 Write property test for Property 7: Button disabled during loading, re-enabled after
  - **Property 7: Button is disabled during loading and re-enabled after**
  - **Validates: Requirements 2.2, 2.3**
  - Simulate fetch lifecycle with controlled promise; assert button.disabled transitions

- [ ] 6. Checkpoint — Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Update CSS for responsive layout and touch targets
  - Ensure no horizontal overflow at 320px–1920px viewport widths
  - Set min-height and min-width of button and select to 44px for touch targets
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 8. Final Checkpoint — Ensure all tests pass, ask the user if questions arise.
