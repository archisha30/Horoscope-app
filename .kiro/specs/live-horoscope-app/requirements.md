# Requirements Document

## Introduction

A browser-based daily horoscope application that allows users to select their zodiac sign and receive a real, up-to-date horoscope prediction by fetching data from a live third-party API. The app presents the prediction in a visually engaging, mystical UI and handles loading states, API errors, and empty responses gracefully.

## Glossary

- **Horoscope App**: The client-side web application described in this document.
- **Zodiac Sign**: One of the twelve astrological signs (Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces).
- **Prediction**: The horoscope text returned by the live API for a given zodiac sign on the current day.
- **Live API**: A remote HTTP endpoint that returns daily horoscope data in JSON format.
- **Loading State**: A visual indicator shown to the user while an API request is in progress.
- **Error State**: A visual indicator shown when the API request fails or returns an unexpected response.
- **Result Panel**: The UI section that displays the fetched prediction to the user.

---

## Requirements

### Requirement 1

**User Story:** As a user, I want to select my zodiac sign and fetch my daily horoscope, so that I can read a real, up-to-date prediction.

#### Acceptance Criteria

1. THE Horoscope App SHALL provide a dropdown containing all twelve zodiac signs for the user to select from.
2. WHEN a user selects a zodiac sign and clicks the fetch button, THE Horoscope App SHALL send a request to the live API using the selected sign as a parameter.
3. WHEN the API returns a successful response, THE Horoscope App SHALL display the prediction text inside the Result Panel.
4. WHEN a user clicks the fetch button without selecting a zodiac sign, THE Horoscope App SHALL prevent the API request and display an inline validation message.

---

### Requirement 2

**User Story:** As a user, I want to see a loading indicator while my horoscope is being fetched, so that I know the app is working and have not been left waiting without feedback.

#### Acceptance Criteria

1. WHEN a fetch request is initiated, THE Horoscope App SHALL display a loading indicator inside the Result Panel within 100 milliseconds of the button click.
2. WHILE a fetch request is in progress, THE Horoscope App SHALL disable the fetch button to prevent duplicate requests.
3. WHEN the fetch request completes (success or failure), THE Horoscope App SHALL remove the loading indicator and re-enable the fetch button.

---

### Requirement 3

**User Story:** As a user, I want to see a clear error message when the horoscope cannot be fetched, so that I understand something went wrong and can try again.

#### Acceptance Criteria

1. IF the live API returns a non-2xx HTTP status code, THEN THE Horoscope App SHALL display a human-readable error message inside the Result Panel.
2. IF a network error occurs during the fetch, THEN THE Horoscope App SHALL display a human-readable error message inside the Result Panel.
3. IF the API response does not contain a valid prediction field, THEN THE Horoscope App SHALL display a fallback message indicating the prediction is unavailable.

---

### Requirement 4

**User Story:** As a user, I want the app to display the sign name and today's date alongside the prediction, so that I can confirm the horoscope is current and relevant to me.

#### Acceptance Criteria

1. WHEN a prediction is displayed, THE Horoscope App SHALL show the selected zodiac sign name in the Result Panel.
2. WHEN a prediction is displayed, THE Horoscope App SHALL show the current date (formatted as Month DD, YYYY) in the Result Panel.
3. WHEN a new zodiac sign is selected and fetched, THE Horoscope App SHALL replace the previously displayed prediction, sign name, and date with the new values.

---

### Requirement 5

**User Story:** As a user, I want the app to work correctly on both desktop and mobile browsers, so that I can check my horoscope from any device.

#### Acceptance Criteria

1. THE Horoscope App SHALL render the layout without horizontal overflow on viewport widths from 320px to 1920px.
2. THE Horoscope App SHALL apply touch-friendly tap targets of at least 44x44 CSS pixels to all interactive elements.
3. WHEN the app is loaded on any supported viewport width, THE Horoscope App SHALL display all interactive elements without requiring horizontal scrolling.
