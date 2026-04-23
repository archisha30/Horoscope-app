# Design Document — Live Horoscope App

## Overview

The Live Horoscope App is a single-page, client-side web application built with vanilla HTML, CSS, and JavaScript. Users select one of the twelve zodiac signs from a dropdown, click a button, and receive a real daily horoscope prediction fetched from a live third-party JSON API. The app manages loading states, API errors, and malformed responses, and displays the sign name and today's date alongside the prediction.

The existing skeleton (`index.html`, `script.js`, `style.css`) already covers the basic structure. This design formalises the full feature set, adds robust state management, error handling, and a testable module structure.

---

## Architecture

The app is entirely client-side with no build step required. Logic is split into small, pure functions that are easy to unit-test and property-test, wired together by a thin event-handler layer.

```
index.html          — markup & sign dropdown
style.css           — responsive, mystical UI
script.js
  ├── api.js        — fetchHoroscope(sign) → Promise<{horoscope}>
  ├── format.js     — buildApiUrl(sign), formatDate(date), parseResponse(data)
  ├── ui.js         — renderResult(sign, date, text), renderError(msg), renderLoading(), setButtonState(disabled)
  └── main.js       — event wiring, orchestration
```

Because the project has no bundler, all modules are loaded as ES modules via `<script type="module">`.

---

## Components and Interfaces

### format.js

```js
// Constructs the API URL for a given sign
buildApiUrl(sign: string): string

// Formats a Date object as "Month DD, YYYY"
formatDate(date: Date): string

// Extracts the prediction string from a raw API response object.
// Returns null if the field is missing or empty.
parseResponse(data: unknown): string | null
```

### api.js

```js
// Fetches the horoscope for the given sign.
// Throws an Error with a human-readable message on HTTP or network failure.
fetchHoroscope(sign: string): Promise<string>
```

### ui.js

```js
// Renders the prediction, sign name, and date into the Result Panel
renderResult(sign: string, date: string, prediction: string): void

// Renders a human-readable error message into the Result Panel
renderError(message: string): void

// Renders a loading spinner/message into the Result Panel
renderLoading(): void

// Enables or disables the fetch button
setButtonState(disabled: boolean): void
```

### main.js

Wires the button click event to the orchestration flow:
1. Validate sign selection → show inline message if empty
2. `renderLoading()` + `setButtonState(true)`
3. `fetchHoroscope(sign)`
4. On success: `renderResult(sign, formatDate(new Date()), prediction)`
5. On failure: `renderError(message)`
6. Finally: `setButtonState(false)`

---

## Data Models

### API Response (ohmanda.com horoscope API)

```json
{
  "horoscope": "string — the daily prediction text"
}
```

`parseResponse` treats any response where `horoscope` is absent, `null`, or an empty/whitespace-only string as invalid and returns `null`.

### Internal AppState (managed in main.js)

```js
{
  selectedSign: string | "",   // current dropdown value
  loading: boolean,            // true while fetch is in progress
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

---

**Property 1: API URL contains the sign**

*For any* valid zodiac sign string, `buildApiUrl(sign)` should return a URL string that contains that sign as a substring.

**Validates: Requirements 1.2**

---

**Property 2: Render output contains sign name and prediction**

*For any* zodiac sign, date string, and non-empty prediction string, the HTML produced by `renderResult` should contain both the sign name and the prediction text.

**Validates: Requirements 1.3, 4.1**

---

**Property 3: Error handler produces non-empty message for any error input**

*For any* Error object (whether from a non-2xx HTTP response or a network failure), the error message passed to `renderError` should be a non-empty string.

**Validates: Requirements 3.1, 3.2**

---

**Property 4: parseResponse returns null for missing or empty prediction field**

*For any* object where the `horoscope` field is absent, `null`, `undefined`, or composed entirely of whitespace, `parseResponse` should return `null`.

**Validates: Requirements 3.3**

---

**Property 5: Date formatter always produces "Month DD, YYYY" pattern**

*For any* valid `Date` object, `formatDate` should return a string matching the pattern `<MonthName> <1-2 digit day>, <4 digit year>` (e.g. "April 23, 2026").

**Validates: Requirements 4.2**

---

**Property 6: Render replaces, not appends**

*For any* two sequential calls to `renderResult` with different prediction strings, the Result Panel should contain only the second prediction and not the first.

**Validates: Requirements 4.3**

---

**Property 7: Button is disabled during loading and re-enabled after**

*For any* fetch lifecycle (success or failure), the button should be disabled immediately when loading starts and enabled again once the fetch settles.

**Validates: Requirements 2.2, 2.3**

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| No sign selected | Inline validation message; no fetch initiated |
| HTTP non-2xx | `renderError` with status-based message |
| Network failure (TypeError) | `renderError` with connectivity message |
| Missing/empty `horoscope` field | `renderError` with fallback unavailability message |
| Fetch in progress (button clicked again) | Button is disabled; second click is a no-op |

---

## Testing Strategy

The project uses **vanilla JavaScript with ES modules**. Tests are written with **Vitest** (zero-config, browser-compatible, supports ES modules natively).

Property-based tests use **fast-check**, a mature PBT library for JavaScript/TypeScript.

### Unit Tests (Vitest)

- Specific examples for `parseResponse` with known good/bad inputs
- Example test for the dropdown containing exactly 12 sign options
- Example test for the empty-sign validation path
- Example test for the loading state appearing before fetch resolves

### Property-Based Tests (fast-check, minimum 100 runs each)

Each property-based test MUST be tagged with the following comment format:
`// Feature: live-horoscope-app, Property <N>: <property text>`

| Property | Test description |
|---|---|
| Property 1 | `fc.string()` filtered to valid signs → `buildApiUrl` result contains sign |
| Property 2 | `fc.string()` for sign, date, prediction → `renderResult` HTML contains both |
| Property 3 | `fc.oneof(fc.integer(), fc.string())` as error inputs → message is non-empty string |
| Property 4 | `fc.oneof(fc.constant(null), fc.constant(undefined), fc.string())` → `parseResponse` returns null for whitespace/missing |
| Property 5 | `fc.date()` → `formatDate` matches Month DD, YYYY regex |
| Property 6 | Two `fc.string()` predictions → Result Panel contains only second after two renders |
| Property 7 | Simulated fetch lifecycle → button disabled state transitions correctly |

Both unit and property tests live in a `tests/` directory alongside the source files.
