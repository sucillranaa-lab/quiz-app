# Dev Environment & All Questions Viewer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add an `APP_ENV`-based dev/prod environment and a dev-only "Show All Questions" feature on the HomeScreen.

**Architecture:** A lightweight `utils/env.js` reads `process.env.APP_ENV` (Expo-injected) to toggle dev features. A new `AllQuestionsScreen` lists every question for a quiz with correct answers highlighted. QuizCard shows a collapsible "Dev Tools" section in dev mode only.

**Tech Stack:** React Native / Expo, IndexedDB (idb), NativeWind (Tailwind classes), React Navigation

---

### Task 1: Create `utils/env.js`

**Files:**
- Create: `QuizApp/utils/env.js`

- [ ] **Step 1: Write env.js**

```js
const env = process.env.APP_ENV || 'production';

export const isDev = env === 'development';
export const isProd = !isDev;
```

`process.env.APP_ENV` is injected by Expo at runtime from `.env` files or terminal. When unset, it defaults to `'production'` — so deployments always hide dev features unless explicitly opted in.

---

### Task 2: Create `screens/AllQuestionsScreen.js`

**Files:**
- Create: `QuizApp/screens/AllQuestionsScreen.js`

- [ ] **Step 1: Write AllQuestionsScreen.js**

```js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from '../components/ui';
import { ArrowLeft, CheckCircle, Home } from 'lucide-react-native';
import { getQuestionsByQuizId } from '../db/database';
import RichQuestionText from '../components/HtmlTable';
import { getOptionLetter } from '../utils/helpers';

export default function AllQuestionsScreen({ navigation, route }) {
  const { quizId, quizTitle } = route.params;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, [quizId]);

  const loadQuestions = async () => {
    try {
      const data = await getQuestionsByQuizId(quizId);
      setQuestions(data);
    } catch (err) {
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <Text className="text-slate-500 font-medium">Loading questions...</Text>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center px-6">
        <Text className="text-xl font-bold text-slate-950">No questions found</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
          className="mt-6 bg-teal-700 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white border-b border-slate-200 px-5 py-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3"
          >
            <ArrowLeft size={22} color="#0f172a" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-slate-950 text-xl font-bold">All Questions</Text>
            <Text className="text-slate-500 text-sm mt-0.5">{quizTitle} — {questions.length} questions</Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 28 }}
      >
        {questions.map((question, qIndex) => (
          <View key={question.id || qIndex} className="mb-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            {/* Question header */}
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mr-2.5">
                <Text className="text-sm font-bold text-indigo-700">{qIndex + 1}</Text>
              </View>
              <View className="flex-1">
                <RichQuestionText
                  text={question.questionText}
                  textClassName="text-base font-bold text-slate-900 leading-5"
                />
              </View>
            </View>

            {/* Options */}
            <View className="gap-2">
              {question.options.map((option, optIndex) => {
                const isCorrect = question.correctIndex === optIndex;
                return (
                  <View
                    key={optIndex}
                    className={`flex-row items-center p-3.5 rounded-xl border ${
                      isCorrect
                        ? 'bg-green-50 border-green-500'
                        : 'bg-white border-slate-200 opacity-60'
                    }`}
                  >
                    <View
                      className={`w-8 h-8 rounded-full items-center justify-center mr-3 border ${
                        isCorrect
                          ? 'bg-green-600 border-green-600'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <Text
                        className={`text-sm font-bold ${
                          isCorrect ? 'text-white' : 'text-slate-600'
                        }`}
                      >
                        {getOptionLetter(optIndex)}
                      </Text>
                    </View>
                    <Text
                      className={`text-sm flex-1 leading-5 ${
                        isCorrect ? 'text-green-800 font-medium' : 'text-slate-500'
                      }`}
                    >
                      {option}
                    </Text>
                    {isCorrect && <CheckCircle size={18} color="#16a34a" />}
                  </View>
                );
              })}
            </View>

            {/* Feedback */}
            {question.feedback && (
              <View className="mt-3 p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                <Text className="text-sm text-blue-800 leading-5">{question.feedback}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Bottom bar */}
      <View className="px-5 py-4 bg-white border-t border-slate-200">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
          className="bg-teal-700 py-3.5 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Home size={20} color="white" />
          <Text className="text-white font-semibold text-base">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
```

---

### Task 3: Modify HomeScreen to pass `onShowAll` callback and read state

**Files:**
- Modify: `QuizApp/screens/HomeScreen.js`

- [ ] **Step 1: Add env import at top**

After line 8 (`import { quizSources } from '../QuizData/index';`), add:
```js
import { isDev } from '../utils/env';
```

- [ ] **Step 2: Add `handleShowAll` handler**

Before the `return` statement (before line 107: `if (loading)`), add:
```js
const handleShowAll = (quiz) => {
  navigation.navigate('AllQuestions', { quizId: quiz.id, quizTitle: quiz.title });
};
```

- [ ] **Step 3: Pass `onShowAll` and `isDev` to QuizCard**

Find the `<QuizCard>` usage inside the `quizzes.map` (around line 193). Add `isDev` and `onShowAll` props:
```js
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                isDev={isDev}
                questionCount={quizData[quiz.id]?.questionCount || 0}
                progress={quizData[quiz.id]?.progress || null}
                onStart={() => handleStart(quiz.id)}
                onResume={quizData[quiz.id]?.progress ? () => handleResume(quiz.id) : null}
                onRestart={quizData[quiz.id]?.progress ? () => handleRestart(quiz.id) : null}
                onShowAll={() => handleShowAll(quiz)}
              />
```

---

### Task 4: Modify QuizCard to show dev tools section

**Files:**
- Modify: `QuizApp/components/QuizCard.js`

- [ ] **Step 1: Add props destructuring and collapsible state**

Replace the function signature and add `useState`:

```js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from './ui';
import { BookOpen, Clock, Play, RotateCcw, Award, ChevronRight, ChevronDown, Eye } from 'lucide-react-native';
import { getAnsweredCount, getQuizProgressPercent } from '../utils/helpers';
```

- [ ] **Step 2: Add `isDev`, `onShowAll` to destructured props and dev tools section**

Update the function signature:
```js
export default function QuizCard({ quiz, questionCount, progress, onStart, onResume, onRestart, isDev, onShowAll }) {
```

Add state inside the function (after the `scheme` line):
```js
  const [showDevTools, setShowDevTools] = useState(false);
```

- [ ] **Step 3: Add collapsible dev tools section**

Insert BEFORE the `</View>` that closes the main card (before the `</View>` that wraps the entire card, i.e., after the action bar section at line 123). Add right after the bottom action bar `</View>` (line 123) and before the card-closing `</View>` (line 124):

```js
        {/* Dev Tools — only visible in development mode */}
        {isDev && (
          <View className="border-t border-dashed border-amber-200">
            <TouchableOpacity
              onPress={() => setShowDevTools(!showDevTools)}
              activeOpacity={0.7}
              className="flex-row items-center justify-between px-5 py-3 bg-amber-50/50"
            >
              <View className="flex-row items-center">
                <Text className="text-xs font-bold text-amber-700 uppercase tracking-wider">Dev Tools</Text>
              </View>
              {showDevTools ? (
                <ChevronDown size={16} color="#b45309" />
              ) : (
                <ChevronRight size={16} color="#b45309" />
              )}
            </TouchableOpacity>

            {showDevTools && (
              <View className="px-5 pb-4 pt-2 bg-amber-50/30">
                <TouchableOpacity
                  onPress={onShowAll}
                  activeOpacity={0.85}
                  className="flex-row items-center justify-center py-2.5 px-4 bg-amber-100 border border-amber-300 rounded-lg"
                >
                  <Eye size={16} color="#b45309" />
                  <Text className="ml-2 text-sm font-semibold text-amber-800">Show All Questions</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
```

---

### Task 5: Register the screen in `App.js`

**Files:**
- Modify: `QuizApp/App.js`

- [ ] **Step 1: Add import**

After line 11 (`import AddQuizScreen from './screens/AddQuizScreen';`), add:
```js
import AllQuestionsScreen from './screens/AllQuestionsScreen';
```

- [ ] **Step 2: Add screen to navigator**

After `<Stack.Screen name="AddQuiz" ... />`, add:
```js
          <Stack.Screen name="AllQuestions" component={AllQuestionsScreen} />
```

---

### Task 6: Update README.md

**Files:**
- Modify: `QuizApp/README.md`

- [ ] **Step 1: Add environment documentation**

Before the "Requirements" section (or after "Installation"), add:

```md
## Environment

The app supports two environments via the `APP_ENV` environment variable:

| Mode | Command | Dev Features |
|------|---------|-------------|
| **Development** | `APP_ENV=development npx expo start --web` | Shows "Dev Tools" on quiz cards with "Show All Questions" |
| **Production** (default) | `npx expo start --web` | All dev features hidden. Same as deployed build. |

When `APP_ENV` is not set, the app **defaults to production** — this ensures deployed builds never expose dev features.

### Running in Development Mode

```bash
# Web
APP_ENV=development npx expo start --web

# iOS
APP_ENV=development npx expo start --ios

# Android
APP_ENV=development npx expo start --android
```

### Building for Production

```bash
# Export for web deployment (always production)
npx expo export --platform web

# Or for store builds
npx eas build --platform all
```

Production builds always run with `APP_ENV=production` regardless of the local environment variable, since `process.env` is baked at build time by Expo.
```

---

## Self-Review Checklist

- **Spec covered?**
  - `APP_ENV` env variable → Task 1 ✓
  - Per-quiz "Show All Questions" → Tasks 2–4 ✓
  - Correct answer highlighted green + checkmark, wrong greyed → Task 2 ✓
  - Hidden in production → Task 1 (isDev defaults false) + Task 4 (wrapped in `{isDev && ...}`) ✓
  - README docs → Task 6 ✓
  - Deployment defaults to production → Task 1 (`|| 'production'`) ✓

- **Placeholders?** None — all code is complete.

- **Type consistency?** `quizId` (number), `quizTitle` (string), `isDev` (boolean), `onShowAll` (callback) — consistent across all tasks ✓

- **Edge cases?** Empty questions list handled in Task 2 ✓, loading state ✓, missing `APP_ENV` handled in Task 1 ✓
