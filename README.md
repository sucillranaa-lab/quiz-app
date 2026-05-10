# Quiz App

A fully offline React Native quiz application with IndexedDB storage. Built with Expo, NativeWind for styling, and React Navigation.

## Features

- **IndexedDB Storage** - All data (quizzes, questions, progress) stored locally using IndexedDB
- **Quiz Management** - Add new quizzes with flexible question formats (2-6 options)
- **Progress Tracking** - Auto-save progress, pause and resume anytime
- **One Question at a Time** - Navigate through questions with Previous/Next buttons
- **Results & Review** - View score, pass/fail status, and detailed review with explanations
- **Fully Offline** - Works without internet connection

## Project Structure

```
QuizApp/
├── App.js                    # Main app entry with navigation setup
├── app.json                  # Expo configuration
├── babel.config.js           # Babel configuration
├── metro.config.js           # Metro bundler configuration
├── package.json              # Project dependencies
├── tailwind.config.js        # Tailwind CSS configuration
│
├── db/
│   └── database.js           # IndexedDB operations (CRUD for quizzes, questions, progress)
│
├── screens/
│   ├── HomeScreen.js         # Home screen - lists all quizzes, auto-seeds sample data
│   ├── QuizScreen.js         # Quiz taking screen - one question at a time
│   ├── ResultsScreen.js      # Results screen - shows score and summary
│   ├── ReviewScreen.js       # Review screen - navigate through all answers with feedback
│   └── AddQuizScreen.js      # Add new quiz screen - create quizzes with custom questions
│
├── components/
│   ├── QuizCard.js           # Quiz list item component (shows title, question count, actions)
│   ├── QuestionCard.js       # Question display component
│   ├── OptionButton.js       # Answer option button component
│   └── ProgressBar.js        # Progress bar component
│
└── utils/
    └── helpers.js            # Utility functions (getOptionLetter, calculateScore, etc.)
```

## Environment

The app supports two environments via the `EXPO_PUBLIC_APP_ENV` environment variable (Expo SDK 49+ automatically exposes `EXPO_PUBLIC_*` vars to the client):

| Mode | Command | Dev Features |
|------|---------|-------------|
| **Development** | `EXPO_PUBLIC_APP_ENV=development npx expo start --web` | Shows "Dev Tools" on quiz cards with "Show All Questions" |
| **Production** (default) | `npx expo start --web` | All dev features hidden. Same as deployed build. |

When `EXPO_PUBLIC_APP_ENV` is not set, the app **defaults to production** — this ensures deployed builds never expose dev features.

### Running in Development Mode

```bash
# Web
EXPO_PUBLIC_APP_ENV=development npx expo start --web

# iOS
EXPO_PUBLIC_APP_ENV=development npx expo start --ios

# Android
EXPO_PUBLIC_APP_ENV=development npx expo start --android
```

### Building for Production

Production builds always run with `EXPO_PUBLIC_APP_ENV` unset, so the app defaults to production mode.

```bash
# Export for web deployment (always production)
npx expo export --platform web

# Or for store builds
npx eas build --platform all
```

## Requirements

- Node.js 18+ (Node.js 20+ recommended)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
# For web
npx expo start --web

# For Android
npx expo start --android

# For iOS
npx expo start --ios
```

3. Open your browser to http://localhost:8081 (for web)

## Usage

### Home Screen
- View all available quizzes
- Start a new quiz, resume a paused quiz, or restart a completed quiz
- Add new quizzes using the + button

### Taking a Quiz
- Answer questions one at a time
- Use Previous/Next to navigate
- Progress is auto-saved on every answer

### Results
- View your score and percentage
- See pass/fail status (70% to pass)
- Click "Review Answers" to see detailed feedback

### Review
- Navigate through all questions
- See your answer vs correct answer
- View explanations for incorrect answers

### Adding a Quiz
1. Click the + button on home screen
2. Enter quiz title
3. Add questions with:
   - Question text
   - 2-6 answer options
   - Select the correct answer
   - Add optional feedback/explanation
4. Save the quiz

## Tech Stack

- **Expo** - React Native framework
- **React Native** - Mobile framework
- **IndexedDB (idb)** - Local database
- **NativeWind** - Tailwind CSS for React Native
- **React Navigation** - Navigation framework
- **Lucide React Native** - Icons

## License

MIT