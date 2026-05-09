# IFIC Quiz App Design

## Overview

A fully offline React Native quiz app (with React Native Web support) using Expo. IndexedDB serves as the single source of truth for all data.

## Database Schema (IndexedDB)

### Store: `quizzes`
| Field | Type | Description |
|-------|------|-------------|
| id | auto-increment | Primary key |
| title | string | Quiz title |
| createdAt | timestamp | Creation date |

### Store: `questions`
| Field | Type | Description |
|-------|------|-------------|
| id | auto-increment | Primary key |
| quizId | number (indexed) | Foreign key to quizzes |
| questionText | string | The question |
| options | array of strings | Answer options [A, B, C, D, ...] |
| correctIndex | number | Index of correct answer |
| feedback | string | Explanation shown in review |

### Store: `progress`
| Field | Type | Description |
|-------|------|-------------|
| id | auto-increment | Primary key |
| quizId | number (indexed) | Foreign key to quizzes |
| currentIndex | number | Current question position |
| answers | object | {questionId: selectedIndex} mapping |
| completedAt | timestamp | When quiz was finished |
| score | number | Final score (null if not completed) |

## Screens

1. **HomeScreen** — Lists all available quizzes, tap to start/resume
2. **QuizScreen** — Shows one question at a time with Previous/Next
3. **ResultsScreen** — Shows score and link to review
4. **ReviewScreen** — Navigate through all questions, see user's answer vs correct, feedback for incorrect
5. **AddQuizScreen** — Form to add new quiz with questions

## Navigation Flow

```
Home → Quiz → Results → Review
         ↑_______|
    (pause/resume)
```

## Key Behaviors

### Quiz Taking
- Auto-save progress on every answer selection
- Pause/resume: reopening quiz resumes from saved position
- Previous/Next buttons navigate one question at a time
- Finish button on last question → Results

### Review
- Shows all questions (not just incorrect)
- For each question: show question, options, user's answer, correct answer (if incorrect), feedback (if incorrect)
- Previous/Next navigation through all questions
- Back to Home button

### Add Quiz
- Enter quiz title
- Add questions one by one (question text, 2-6 options, mark correct, add feedback)
- Save quiz to IndexedDB

## Technical Stack

- **Expo** with React Native
- **idb** library for IndexedDB (works on both web and mobile)
- **NativeWind/Tailwind** for styling
- **React Navigation** for navigation

## Data Flow

1. App loads → HomeScreen fetches all quizzes from IndexedDB
2. User taps quiz → Check for existing progress in IndexedDB
   - If progress exists and not completed → Resume QuizScreen
   - If no progress → Start fresh QuizScreen
3. User answers → Save to progress store immediately
4. User finishes → Update progress with completedAt and score → ResultsScreen
5. User reviews → Fetch questions for quiz + user's answers → ReviewScreen