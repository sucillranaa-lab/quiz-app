# Dev Environment & All Questions Viewer

## Overview

Add a developer-only "Show All Questions" feature to browse every question in a quiz with correct answers highlighted, and set up `APP_ENV`-based environment switching so this feature is hidden in production.

## Requirements

1. **Environment configuration** — `APP_ENV=development` enables dev features; `APP_ENV=production` (or unset) hides them
2. **"Show All Questions"** — per-quiz button on HomeScreen (dev only) that navigates to a full listing of all questions for that quiz with correct answers highlighted
3. **Deployment safety** — default to production when `APP_ENV` is not set

## Architecture

### 1. `utils/env.js`

Reads `process.env.APP_ENV` and exports two booleans:

```js
isDev  → true when APP_ENV === 'development'
isProd → true otherwise (defaults to production)
```

No external dependencies. The `process.env` values are injected by Expo at build/start time.

### 2. `screens/AllQuestionsScreen.js`

A new screen that:
- Receives `quizId` and `quizTitle` as route params
- Loads ALL questions for that quiz from IndexedDB (`getQuestionsByQuizId`)
- Renders a scrollable list
- For each question:
  - Question number (bold)
  - Question text (rendered via `RichQuestionText` for HTML table support)
  - All options listed using the existing `OptionButton`-like layout:
    - Correct answer: green background, green border, checkmark icon
    - Wrong options: normal appearance (no special styling)
  - Feedback/explanation shown below in a subtle card
- Back button returns to HomeScreen

### 3. `components/QuizCard.js` modification

Add a collapsible "Dev Tools" section at the bottom of the card, visible **only when `isDev` is true**:

```
[▼ Dev Tools]
  [Show All Questions]  → navigates to AllQuestionsScreen
```

The entire section is hidden in production builds.

### 4. `App.js` navigation update

Register `AllQuestions` screen in the stack navigator (after the existing screens).

### 5. `README.md` update

Add an "Environment" section documenting:
- Setting `APP_ENV=development` for dev features
- Default behavior (production) when not set
- How to run in each mode

## Styling

Follow the existing design system: white cards, rounded corners, Tailwind classes via the custom `tw` function. The AllQuestions screen should match the general look of ReviewScreen.

## Files Changed

| File | Action |
|------|--------|
| `utils/env.js` | **New** — environment configuration |
| `screens/AllQuestionsScreen.js` | **New** — all questions viewer |
| `components/QuizCard.js` | **Edit** — add dev tools section |
| `screens/HomeScreen.js` | **Edit** — pass `onShowAll` callback to QuizCard |
| `App.js` | **Edit** — register new screen |
| `README.md` | **Edit** — add environment docs |

## Edge Cases

- No questions exist for a quiz → show "No questions found" message
- `process.env.APP_ENV` undefined → safely defaults to production
- Expo web vs native → same code path, `process.env` works in both
