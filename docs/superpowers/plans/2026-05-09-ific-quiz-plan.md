# IFIC Quiz App Implementation Plan

**For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully offline React Native quiz app with IndexedDB storage, allowing users to take quizzes, track progress, and add new quizzes.

**Architecture:** Expo + React Native with IndexedDB via `idb` library, NativeWind for styling, React Navigation for routing.

**Tech Stack:** Expo, idb (IndexedDB wrapper), NativeWind, TailwindCSS, React Navigation

---

## File Structure

```
IFIC-Quiz/
├── App.js                          # Main app with navigation
├── app.json                        # Expo config
├── tailwind.config.js              # Tailwind config
├── babel.config.js                 # Babel config
├── metro.config.js                 # Metro config for NativeWind
├── db/
│   └── database.js                 # IndexedDB setup with idb
├── screens/
│   ├── HomeScreen.js               # List of quizzes
│   ├── QuizScreen.js               # Take quiz (one question at a time)
│   ├── ResultsScreen.js            # Show score after completion
│   ├── ReviewScreen.js            # Review all questions with feedback
│   └── AddQuizScreen.js           # Form to add new quiz
├── components/
│   ├── QuizCard.js                 # Quiz list item component
│   ├── QuestionCard.js             # Question display component
│   ├── OptionButton.js             # Answer option button
│   └── ProgressBar.js              # Progress indicator
├── hooks/
│   ├── useQuiz.js                  # Quiz data and actions hook
│   └── useProgress.js              # Progress tracking hook
└── utils/
    └── helpers.js                  # Utility functions
```

---

## Task 1: Project Setup

**Files:**
- Create: `IFIC-Quiz/package.json`
- Create: `IFIC-Quiz/app.json`
- Create: `IFIC-Quiz/babel.config.js`
- Create: `IFIC-Quiz/metro.config.js`
- Create: `IFIC-Quiz/tailwind.config.js`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "ific-quiz",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-native": "0.76.5",
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/native-stack": "^7.0.0",
    "react-native-screens": "~4.4.0",
    "react-native-safe-area-context": "~4.14.0",
    "nativewind": "^4.0.0",
    "tailwindcss": "^3.4.0",
    "idb": "^8.0.0",
    "lucide-react-native": "^0.460.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0"
  }
}
```

- [ ] **Step 2: Create app.json**

```json
{
  "expo": {
    "name": "IFIC Quiz",
    "slug": "ific-quiz",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#1e40af"
    },
    "web": {
      "bundler": "metro"
    },
    "extra": {
      "eas": {
        "projectId": "ific-quiz"
      }
    }
  }
}
```

- [ ] **Step 3: Create babel.config.js**

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel']
  };
};
```

- [ ] **Step 4: Create metro.config.js**

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './tailwind.config.js' });
```

- [ ] **Step 5: Create tailwind.config.js**

```javascript
module.exports = {
  content: ['./App.js', './**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [],
};
```

- [ ] **Step 6: Install dependencies**

Run: `cd IFIC-Quiz && npm install`

---

## Task 2: Database Layer

**Files:**
- Create: `IFIC-Quiz/db/database.js`

- [ ] **Step 1: Create db/database.js**

```javascript
import { openDB } from 'idb';

const DB_NAME = 'ificQuizDB';
const DB_VERSION = 1;

export const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Quizzes store
      if (!db.objectStoreNames.contains('quizzes')) {
        const quizStore = db.createObjectStore('quizzes', {
          keyPath: 'id',
          autoIncrement: true
        });
        quizStore.createIndex('title', 'title');
        quizStore.createIndex('createdAt', 'createdAt');
      }

      // Questions store
      if (!db.objectStoreNames.contains('questions')) {
        const questionStore = db.createObjectStore('questions', {
          keyPath: 'id',
          autoIncrement: true
        });
        questionStore.createIndex('quizId', 'quizId');
      }

      // Progress store
      if (!db.objectStoreNames.contains('progress')) {
        const progressStore = db.createObjectStore('progress', {
          keyPath: 'id',
          autoIncrement: true
        });
        progressStore.createIndex('quizId', 'quizId');
      }
    }
  });

  return db;
};

// Quiz operations
export const getAllQuizzes = async () => {
  const db = await initDB();
  return db.getAll('quizzes');
};

export const getQuiz = async (id) => {
  const db = await initDB();
  return db.get('quizzes', id);
};

export const addQuiz = async (title) => {
  const db = await initDB();
  const id = await db.add('quizzes', {
    title,
    createdAt: new Date().toISOString()
  });
  return id;
};

export const deleteQuiz = async (id) => {
  const db = await initDB();
  // Delete all questions for this quiz
  const questions = await db.getAllFromIndex('questions', 'quizId', id);
  for (const q of questions) {
    await db.delete('questions', q.id);
  }
  // Delete all progress for this quiz
  const progressItems = await db.getAllFromIndex('progress', 'quizId', id);
  for (const p of progressItems) {
    await db.delete('progress', p.id);
  }
  // Delete the quiz
  await db.delete('quizzes', id);
};

// Question operations
export const getQuestionsByQuizId = async (quizId) => {
  const db = await initDB();
  return db.getAllFromIndex('questions', 'quizId', quizId);
};

export const addQuestion = async (quizId, questionText, options, correctIndex, feedback) => {
  const db = await initDB();
  const id = await db.add('questions', {
    quizId,
    questionText,
    options,
    correctIndex,
    feedback
  });
  return id;
};

export const addQuestions = async (questions) => {
  const db = await initDB();
  const tx = db.transaction('questions', 'readwrite');
  const ids = [];
  for (const q of questions) {
    const id = await tx.store.add(q);
    ids.push(id);
  }
  await tx.done;
  return ids;
};

// Progress operations
export const getProgressByQuizId = async (quizId) => {
  const db = await initDB();
  const items = await db.getAllFromIndex('progress', 'quizId', quizId);
  // Return the most recent incomplete progress or null if none
  const incomplete = items.find(p => !p.completedAt);
  return incomplete || null;
};

export const saveProgress = async (quizId, currentIndex, answers) => {
  const db = await initDB();
  // Check for existing progress
  const existing = await getProgressByQuizId(quizId);
  
  if (existing) {
    await db.put('progress', {
      ...existing,
      currentIndex,
      answers
    });
    return existing.id;
  } else {
    const id = await db.add('progress', {
      quizId,
      currentIndex,
      answers,
      completedAt: null,
      score: null
    });
    return id;
  }
};

export const completeQuiz = async (quizId, score) => {
  const db = await initDB();
  const existing = await getProgressByQuizId(quizId);
  
  if (existing) {
    await db.put('progress', {
      ...existing,
      completedAt: new Date().toISOString(),
      score
    });
    return existing.id;
  }
};

export const clearProgress = async (quizId) => {
  const db = await initDB();
  const items = await db.getAllFromIndex('progress', 'quizId', quizId);
  for (const p of items) {
    await db.delete('progress', p.id);
  }
};
```

---

## Task 3: Utility Functions

**Files:**
- Create: `IFIC-Quiz/utils/helpers.js`

- [ ] **Step 1: Create utils/helpers.js**

```javascript
export const getOptionLetter = (index) => {
  return String.fromCharCode(65 + index); // A, B, C, D, etc.
};

export const calculateScore = (questions, answers) => {
  let score = 0;
  for (const q of questions) {
    const userAnswer = answers[q.id];
    if (userAnswer !== undefined && userAnswer === q.correctIndex) {
      score++;
    }
  }
  return score;
};

export const getAnsweredCount = (answers) => {
  return Object.keys(answers).length;
};

export const isQuizComplete = (questions, answers) => {
  return Object.keys(answers).length === questions.length;
};
```

---

## Task 4: Components

**Files:**
- Create: `IFIC-Quiz/components/QuizCard.js`
- Create: `IFIC-Quiz/components/QuestionCard.js`
- Create: `IFIC-Quiz/components/OptionButton.js`
- Create: `IFIC-Quiz/components/ProgressBar.js`

- [ ] **Step 1: Create components/QuizCard.js**

```javascript
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BookOpen, Play, RotateCcw } from 'lucide-react-native';

export default function QuizCard({ quiz, questionCount, onStart, onResume, onRestart }) {
  return (
    <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center mr-4">
            <BookOpen size={24} color="#3b82f6" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800">{quiz.title}</Text>
            <Text className="text-sm text-gray-500 mt-1">{questionCount} questions</Text>
          </View>
        </View>
      </View>
      
      <View className="flex-row gap-3 mt-4">
        <TouchableOpacity 
          onPress={onStart}
          className="flex-1 bg-blue-600 py-3 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Play size={18} color="white" />
          <Text className="text-white font-semibold">Start</Text>
        </TouchableOpacity>
        
        {onResume && (
          <TouchableOpacity 
            onPress={onResume}
            className="flex-1 bg-green-600 py-3 rounded-xl flex-row items-center justify-center gap-2"
          >
            <RotateCcw size={18} color="white" />
            <Text className="text-white font-semibold">Resume</Text>
          </TouchableOpacity>
        )}
        
        {onRestart && (
          <TouchableOpacity 
            onPress={onRestart}
            className="flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center gap-2"
          >
            <RotateCcw size={18} color="#6b7280" />
            <Text className="text-gray-700 font-semibold">Restart</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Create components/OptionButton.js**

```javascript
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { getOptionLetter } from '../utils/helpers';

export default function OptionButton({ option, index, isSelected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-4 rounded-xl border-2 transition-all ${
        isSelected 
          ? 'border-blue-600 bg-blue-50' 
          : 'border-gray-200 bg-white'
      }`}
    >
      <Text className="text-base">
        <Text className="font-bold">{getOptionLetter(index)}.</Text> {option}
      </Text>
    </TouchableOpacity>
  );
}
```

- [ ] **Step 3: Create components/QuestionCard.js**

```javascript
import React from 'react';
import { View, Text } from 'react-native';
import OptionButton from './OptionButton';

export default function QuestionCard({ question, questionNumber, totalQuestions, selectedAnswer, onSelectAnswer }) {
  return (
    <View>
      <View className="mb-6">
        <Text className="text-sm text-gray-500 mb-2">
          Question {questionNumber} of {totalQuestions}
        </Text>
        <Text className="text-xl font-semibold text-gray-800 leading-relaxed">
          {question.questionText}
        </Text>
      </View>

      <View className="space-y-3">
        {question.options.map((option, index) => (
          <OptionButton
            key={index}
            option={option}
            index={index}
            isSelected={selectedAnswer === index}
            onPress={() => onSelectAnswer(index)}
          />
        ))}
      </View>
    </View>
  );
}
```

- [ ] **Step 4: Create components/ProgressBar.js**

```javascript
import React from 'react';
import { View, Text } from 'react-native';

export default function ProgressBar({ current, total }) {
  const percentage = total > 0 ? ((current + 1) / total) * 100 : 0;
  
  return (
    <View>
      <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <View 
          className="h-full bg-blue-600 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </View>
      <Text className="text-sm text-gray-500 mt-2 text-right">
        {current + 1} / {total}
      </Text>
    </View>
  );
}
```

---

## Task 5: HomeScreen

**Files:**
- Create: `IFIC-Quiz/screens/HomeScreen.js`

- [ ] **Step 1: Create screens/HomeScreen.js**

```javascript
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, RefreshCw } from 'lucide-react-native';
import { getAllQuizzes, getQuestionsByQuizId, getProgressByQuizId, clearProgress } from '../db/database';
import QuizCard from '../components/QuizCard';

export default function HomeScreen({ navigation }) {
  const [quizzes, setQuizzes] = useState([]);
  const [quizData, setQuizData] = useState({}); // { quizId: { questionCount, progress } }
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const allQuizzes = await getAllQuizzes();
      setQuizzes(allQuizzes);

      // Load question counts and progress for each quiz
      const data = {};
      for (const quiz of allQuizzes) {
        const questions = await getQuestionsByQuizId(quiz.id);
        const progress = await getProgressByQuizId(quiz.id);
        data[quiz.id] = {
          questionCount: questions.length,
          progress: progress
        };
      }
      setQuizData(data);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation, loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleStart = (quizId) => {
    navigation.navigate('Quiz', { quizId, startFresh: true });
  };

  const handleResume = (quizId) => {
    navigation.navigate('Quiz', { quizId, startFresh: false });
  };

  const handleRestart = async (quizId) => {
    await clearProgress(quizId);
    navigation.navigate('Quiz', { quizId, startFresh: true });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-blue-700 px-6 py-6">
        <Text className="text-white text-3xl font-bold">IFIC Quiz</Text>
        <Text className="text-blue-200 text-base mt-1">Test your knowledge</Text>
      </View>

      <ScrollView 
        className="flex-1 px-6 py-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {quizzes.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Text className="text-gray-500 text-lg">No quizzes available</Text>
            <Text className="text-gray-400 text-sm mt-2">Add a quiz to get started</Text>
          </View>
        ) : (
          quizzes.map(quiz => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              questionCount={quizData[quiz.id]?.questionCount || 0}
              onStart={() => handleStart(quiz.id)}
              onResume={quizData[quiz.id]?.progress ? () => handleResume(quiz.id) : null}
              onRestart={quizData[quiz.id]?.progress ? () => handleRestart(quiz.id) : null}
            />
          ))
        )}
      </ScrollView>

      <TouchableOpacity 
        onPress={() => navigation.navigate('AddQuiz')}
        className="absolute bottom-6 right-6 w-16 h-16 bg-blue-600 rounded-full items-center justify-center shadow-lg"
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
```

---

## Task 6: QuizScreen

**Files:**
- Create: `IFIC-Quiz/screens/QuizScreen.js`

- [ ] **Step 1: Create screens/QuizScreen.js**

```javascript
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react-native';
import { getQuiz, getQuestionsByQuizId, getProgressByQuizId, saveProgress, completeQuiz } from '../db/database';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import { calculateScore } from '../utils/helpers';

export default function QuizScreen({ navigation, route }) {
  const { quizId, startFresh } = route.params;
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const quizData = await getQuiz(quizId);
      const questionsData = await getQuestionsByQuizId(quizId);
      
      setQuiz(quizData);
      setQuestions(questionsData);

      if (!startFresh) {
        const progress = await getProgressByQuizId(quizId);
        if (progress) {
          setCurrentIndex(progress.currentIndex);
          setAnswers(progress.answers || {});
        }
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = useCallback(async (answerIndex) => {
    const newAnswers = { ...answers, [questions[currentIndex].id]: answerIndex };
    setAnswers(newAnswers);
    
    // Auto-save progress
    await saveProgress(quizId, currentIndex, newAnswers);
  }, [answers, currentIndex, questions, quizId]);

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      await saveProgress(quizId, newIndex, answers);
    } else {
      // Quiz completed
      const score = calculateScore(questions, answers);
      await completeQuiz(quizId, score);
      navigation.replace('Results', { quizId, score });
    }
  };

  const handlePrevious = async () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      await saveProgress(quizId, newIndex, answers);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <Text className="text-gray-500">Loading...</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentQuestion?.id];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-blue-700 px-6 py-4">
        <Text className="text-white text-xl font-bold">{quiz?.title}</Text>
        <View className="mt-3">
          <ProgressBar current={currentIndex} total={questions.length} />
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
        />
      </ScrollView>

      {/* Navigation */}
      <View className="flex-row justify-between p-6 bg-white border-t border-gray-200">
        <TouchableOpacity 
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          className={`flex-row items-center gap-2 px-6 py-4 rounded-2xl ${
            currentIndex === 0 ? 'opacity-40' : 'bg-gray-100'
          }`}
        >
          <ArrowLeft size={22} color="#374151" />
          <Text className="font-semibold text-gray-700">Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleNext}
          className="bg-blue-700 flex-row items-center gap-2 px-8 py-4 rounded-2xl"
        >
          <Text className="text-white font-semibold">
            {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </Text>
          {currentIndex < questions.length - 1 && <ArrowRight size={22} color="white" />}
          {currentIndex === questions.length - 1 && <CheckCircle size={22} color="white" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
```

---

## Task 7: ResultsScreen

**Files:**
- Create: `IFIC-Quiz/screens/ResultsScreen.js`

- [ ] **Step 1: Create screens/ResultsScreen.js**

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, RotateCcw, Eye } from 'lucide-react';
import { getQuiz, getQuestionsByQuizId } from '../db/database';

export default function ResultsScreen({ navigation, route }) {
  const { quizId, score } = route.params;
  const [quiz, setQuiz] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    loadData();
  }, [quizId]);

  const loadData = async () => {
    const quizData = await getQuiz(quizId);
    const questions = await getQuestionsByQuizId(quizId);
    setQuiz(quizData);
    setTotalQuestions(questions.length);
  };

  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const passed = percentage >= 70;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-blue-700 p-10 items-center">
        <View className={`w-24 h-24 rounded-full items-center justify-center mb-4 ${
          passed ? 'bg-green-500' : 'bg-orange-500'
        }`}>
          <Trophy size={48} color="white" />
        </View>
        <Text className="text-white text-5xl font-bold mt-4">{score}/{totalQuestions}</Text>
        <Text className="text-blue-200 text-xl mt-2">
          {passed ? 'Excellent! You Passed' : 'Keep Practicing'}
        </Text>
        <Text className="text-white text-lg mt-2">{percentage}%</Text>
      </View>

      <View className="p-6 flex-1">
        <View className="bg-white p-6 rounded-2xl shadow-sm">
          <Text className="text-xl font-semibold mb-4">Quiz Summary</Text>
          
          <View className="flex-row justify-between py-3 border-b border-gray-100">
            <Text className="text-gray-600">Quiz Title</Text>
            <Text className="font-semibold text-gray-800">{quiz?.title}</Text>
          </View>
          
          <View className="flex-row justify-between py-3 border-b border-gray-100">
            <Text className="text-gray-600">Total Questions</Text>
            <Text className="font-semibold text-gray-800">{totalQuestions}</Text>
          </View>
          
          <View className="flex-row justify-between py-3 border-b border-gray-100">
            <Text className="text-gray-600">Correct Answers</Text>
            <Text className="font-semibold text-green-600">{score}</Text>
          </View>
          
          <View className="flex-row justify-between py-3">
            <Text className="text-gray-600">Incorrect Answers</Text>
            <Text className="font-semibold text-red-600">{totalQuestions - score}</Text>
          </View>
        </View>
      </View>

      <View className="p-6 gap-4">
        <TouchableOpacity 
          onPress={() => navigation.navigate('Review', { quizId })}
          className="bg-blue-700 py-4 rounded-2xl flex-row items-center justify-center gap-2"
        >
          <Eye size={22} color="white" />
          <Text className="text-white text-lg font-semibold">Review Answers</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')}
          className="bg-gray-100 py-4 rounded-2xl flex-row items-center justify-center gap-2"
        >
          <RotateCcw size={22} color="#374151" />
          <Text className="text-gray-700 text-lg font-semibold">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
```

---

## Task 8: ReviewScreen

**Files:**
- Create: `IFIC-Quiz/screens/ReviewScreen.js`

- [ ] **Step 1: Create screens/ReviewScreen.js**

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Home } from 'lucide-react';
import { getQuestionsByQuizId, getProgressByQuizId } from '../db/database';
import { getOptionLetter } from '../utils/helpers';

export default function ReviewScreen({ navigation, route }) {
  const { quizId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [quizId]);

  const loadData = async () => {
    try {
      const questionsData = await getQuestionsByQuizId(quizId);
      const progress = await getProgressByQuizId(quizId);
      
      setQuestions(questionsData);
      setUserAnswers(progress?.answers || {});
    } catch (error) {
      console.error('Error loading review data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <Text className="text-gray-500">Loading...</Text>
      </SafeAreaView>
    );
  }

  const question = questions[currentIndex];
  const userAnswer = userAnswers[question.id];
  const isCorrect = userAnswer === question.correctIndex;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-blue-700 px-6 py-4">
        <Text className="text-white text-xl font-bold">Review Answers</Text>
        <Text className="text-blue-200 mt-1">
          Question {currentIndex + 1} of {questions.length}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Question */}
        <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800">
            {question.questionText}
          </Text>
        </View>

        {/* Options */}
        <View className="space-y-3 mb-4">
          {question.options.map((option, index) => {
            const isUserAnswer = userAnswer === index;
            const isCorrectAnswer = question.correctIndex === index;
            
            let optionStyle = 'bg-white border-gray-200';
            if (isCorrectAnswer) {
              optionStyle = 'bg-green-50 border-green-500';
            } else if (isUserAnswer && !isCorrect) {
              optionStyle = 'bg-red-50 border-red-500';
            }

            return (
              <View 
                key={index}
                className={`p-4 rounded-xl border-2 ${optionStyle}`}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-base flex-1">
                    <Text className="font-bold">{getOptionLetter(index)}.</Text> {option}
                  </Text>
                  {isCorrectAnswer && (
                    <CheckCircle size={20} color="#22c55e" />
                  )}
                  {isUserAnswer && !isCorrect && (
                    <XCircle size={20} color="#ef4444" />
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Result indicator */}
        <View className={`p-4 rounded-xl mb-4 ${
          isCorrect ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <View className="flex-row items-center gap-2">
            {isCorrect ? (
              <>
                <CheckCircle size={20} color="#22c55e" />
                <Text className="text-green-700 font-semibold">Correct Answer</Text>
              </>
            ) : (
              <>
                <XCircle size={20} color="#ef4444" />
                <Text className="text-red-700 font-semibold">Incorrect Answer</Text>
              </>
            )}
          </View>
        </View>

        {/* Feedback (only for incorrect) */}
        {!isCorrect && question.feedback && (
          <View className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <Text className="text-amber-800 font-medium mb-2">Explanation:</Text>
            <Text className="text-amber-900">{question.feedback}</Text>
          </View>
        )}
      </ScrollView>

      {/* Navigation */}
      <View className="flex-row justify-between p-6 bg-white border-t border-gray-200">
        <TouchableOpacity 
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          className={`flex-row items-center gap-2 px-6 py-4 rounded-2xl ${
            currentIndex === 0 ? 'opacity-40' : 'bg-gray-100'
          }`}
        >
          <ArrowLeft size={22} color="#374151" />
          <Text className="font-semibold text-gray-700">Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleNext}
          disabled={currentIndex === questions.length - 1}
          className={`flex-row items-center gap-2 px-6 py-4 rounded-2xl ${
            currentIndex === questions.length - 1 ? 'opacity-40' : 'bg-blue-700'
          }`}
        >
          <Text className={`font-semibold ${
            currentIndex === questions.length - 1 ? 'text-gray-400' : 'text-white'
          }`}>
            Next
          </Text>
          {currentIndex < questions.length - 1 && <ArrowRight size={22} color="white" />}
        </TouchableOpacity>
      </View>

      {/* Home button */}
      <View className="px-6 pb-4">
        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')}
          className="bg-gray-100 py-3 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Home size={20} color="#374151" />
          <Text className="text-gray-700 font-semibold">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
```

---

## Task 9: AddQuizScreen

**Files:**
- Create: `IFIC-Quiz/screens/AddQuizScreen.js`

- [ ] **Step 1: Create screens/AddQuizScreen.js**

```javascript
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Trash2, Save, ArrowLeft, Check } from 'lucide-react-native';
import { addQuiz, addQuestions } from '../db/database';

export default function AddQuizScreen({ navigation }) {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    feedback: ''
  });
  const [step, setStep] = useState('title'); // 'title', 'questions', 'review'

  const handleAddOption = () => {
    if (currentQuestion.options.length < 6) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [...currentQuestion.options, '']
      });
    }
  };

  const handleRemoveOption = (index) => {
    if (currentQuestion.options.length > 2) {
      const newOptions = currentQuestion.options.filter((_, i) => i !== index);
      // Adjust correct index if needed
      let newCorrectIndex = currentQuestion.correctIndex;
      if (index < currentQuestion.correctIndex) {
        newCorrectIndex--;
      } else if (index === currentQuestion.correctIndex) {
        newCorrectIndex = 0;
      }
      setCurrentQuestion({
        ...currentQuestion,
        options: newOptions,
        correctIndex: newCorrectIndex
      });
    }
  };

  const handleOptionChange = (text, index) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = text;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.questionText.trim()) {
      Alert.alert('Error', 'Please enter a question');
      return;
    }
    if (currentQuestion.options.some(o => !o.trim())) {
      Alert.alert('Error', 'Please fill all options');
      return;
    }

    setQuestions([...questions, { ...currentQuestion }]);
    setCurrentQuestion({
      questionText: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      feedback: ''
    });
  };

  const handleSaveQuiz = async () => {
    if (!quizTitle.trim()) {
      Alert.alert('Error', 'Please enter a quiz title');
      return;
    }
    if (questions.length === 0) {
      Alert.alert('Error', 'Please add at least one question');
      return;
    }

    try {
      const quizId = await addQuiz(quizTitle);
      
      // Add questions with quizId
      const questionsWithQuizId = questions.map(q => ({
        quizId,
        questionText: q.questionText,
        options: q.options,
        correctIndex: q.correctIndex,
        feedback: q.feedback
      }));
      
      await addQuestions(questionsWithQuizId);
      
      Alert.alert('Success', 'Quiz saved successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error saving quiz:', error);
      Alert.alert('Error', 'Failed to save quiz');
    }
  };

  if (step === 'title') {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="bg-blue-700 px-6 py-4 flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">New Quiz</Text>
        </View>

        <View className="p-6">
          <Text className="text-lg font-semibold mb-3">Quiz Title</Text>
          <TextInput
            value={quizTitle}
            onChangeText={setQuizTitle}
            placeholder="Enter quiz title..."
            className="bg-white p-4 rounded-xl border border-gray-200 text-lg"
            placeholderTextColor="#9ca3af"
          />

          <TouchableOpacity 
            onPress={() => setStep('questions')}
            disabled={!quizTitle.trim()}
            className={`mt-6 py-4 rounded-xl items-center ${
              quizTitle.trim() ? 'bg-blue-700' : 'bg-gray-300'
            }`}
          >
            <Text className="text-white text-lg font-semibold">Next: Add Questions</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'questions') {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="bg-blue-700 px-6 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => setStep('title')} className="mr-4">
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">Add Questions</Text>
          </View>
          <Text className="text-blue-200">{questions.length} added</Text>
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          {/* Question input */}
          <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm">
            <Text className="text-lg font-semibold mb-3">Question</Text>
            <TextInput
              value={currentQuestion.questionText}
              onChangeText={(text) => setCurrentQuestion({ ...currentQuestion, questionText: text })}
              placeholder="Enter your question..."
              multiline
              className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-base min-h-[80px]"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Options */}
          <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm">
            <Text className="text-lg font-semibold mb-3">Options</Text>
            {currentQuestion.options.map((option, index) => (
              <View key={index} className="flex-row items-center gap-2 mb-3">
                <TouchableOpacity
                  onPress={() => setCurrentQuestion({ ...currentQuestion, correctIndex: index })}
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    currentQuestion.correctIndex === index 
                      ? 'bg-green-500' 
                      : 'bg-gray-200'
                  }`}
                >
                  {currentQuestion.correctIndex === index && (
                    <Check size={16} color="white" />
                  )}
                </TouchableOpacity>
                <TextInput
                  value={option}
                  onChangeText={(text) => handleOptionChange(text, index)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-200"
                  placeholderTextColor="#9ca3af"
                />
                {currentQuestion.options.length > 2 && (
                  <TouchableOpacity 
                    onPress={() => handleRemoveOption(index)}
                    className="p-2"
                  >
                    <Trash2 size={20} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {currentQuestion.options.length < 6 && (
              <TouchableOpacity 
                onPress={handleAddOption}
                className="flex-row items-center gap-2 mt-2"
              >
                <Plus size={20} color="#3b82f6" />
                <Text className="text-blue-600">Add Option</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Feedback */}
          <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm">
            <Text className="text-lg font-semibold mb-3">Feedback (Optional)</Text>
            <TextInput
              value={currentQuestion.feedback}
              onChangeText={(text) => setCurrentQuestion({ ...currentQuestion, feedback: text })}
              placeholder="Explanation for the correct answer..."
              multiline
              className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-base min-h-[80px]"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <TouchableOpacity 
            onPress={handleAddQuestion}
            className="bg-green-600 py-4 rounded-xl flex-row items-center justify-center gap-2 mb-6"
          >
            <Plus size={22} color="white" />
            <Text className="text-white text-lg font-semibold">Add Question</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom buttons */}
        <View className="p-4 bg-white border-t border-gray-200 gap-3">
          {questions.length > 0 && (
            <TouchableOpacity 
              onPress={() => setStep('review')}
              className="bg-blue-700 py-4 rounded-xl flex-row items-center justify-center gap-2"
            >
              <Text className="text-white text-lg font-semibold">Review Quiz ({questions.length} questions)</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            onPress={handleSaveQuiz}
            disabled={questions.length === 0}
            className={`py-4 rounded-xl flex-row items-center justify-center gap-2 ${
              questions.length > 0 ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <Save size={22} color={questions.length > 0 ? 'white' : '#666'} />
            <Text className={`text-lg font-semibold ${
              questions.length > 0 ? 'text-white' : 'text-gray-500'
            }`}>
              Save Quiz
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Review step
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-blue-700 px-6 py-4 flex-row items-center">
        <TouchableOpacity onPress={() => setStep('questions')} className="mr-4">
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Review Quiz</Text>
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        <View className="bg-white p-5 rounded-2xl mb-4">
          <Text className="text-gray-600 text-sm">Quiz Title</Text>
          <Text className="text-xl font-semibold">{quizTitle}</Text>
          <Text className="text-gray-500 mt-2">{questions.length} questions</Text>
        </View>

        {questions.map((q, index) => (
          <View key={index} className="bg-white p-4 rounded-xl mb-3 shadow-sm">
            <Text className="font-semibold mb-2">Q{index + 1}: {q.questionText.substring(0, 50)}...</Text>
            <Text className="text-sm text-gray-500">
              Correct: {String.fromCharCode(65 + q.correctIndex)} - {q.options[q.correctIndex].substring(0, 30)}...
            </Text>
          </View>
        ))}
      </ScrollView>

      <View className="p-4 bg-white border-t border-gray-200">
        <TouchableOpacity 
          onPress={handleSaveQuiz}
          className="bg-green-600 py-4 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Save size={22} color="white" />
          <Text className="text-white text-lg font-semibold">Save Quiz</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
```

---

## Task 10: App.js with Navigation

**Files:**
- Create: `IFIC-Quiz/App.js`

- [ ] **Step 1: Create App.js**

```javascript
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import ResultsScreen from './screens/ResultsScreen';
import ReviewScreen from './screens/ReviewScreen';
import AddQuizScreen from './screens/AddQuizScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
          <Stack.Screen name="Review" component={ReviewScreen} />
          <Stack.Screen name="AddQuiz" component={AddQuizScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
```

---

## Task 11: Seed Sample Quiz Data

**Files:**
- Create: `IFIC-Quiz/seed.js`

- [ ] **Step 1: Create seed.js with sample quiz**

```javascript
import { initDB, addQuiz, addQuestions } from './db/database';

const sampleQuiz = {
  title: 'IFIC Banking Knowledge Test',
  questions: [
    {
      questionText: 'What does IFIC stand for?',
      options: ['International Finance Investment Corporation', 'Industrial Finance and Investment Corporation', 'International Financial Investment Company', 'Islamic Finance and Investment Corporation'],
      correctIndex: 1,
      feedback: 'IFIC stands for Industrial Finance and Investment Corporation, a leading bank in Bangladesh.'
    },
    {
      questionText: 'What is the primary function of a commercial bank?',
      options: ['Issuing currency', 'Providing credit facilities', 'Regulating money supply', 'Setting interest rates'],
      correctIndex: 1,
      feedback: 'Commercial banks primarily provide credit facilities to individuals and businesses.'
    },
    {
      questionText: 'What is a fixed deposit?',
      options: ['A savings account with unlimited withdrawals', 'A deposit with a fixed maturity period and interest rate', 'A checking account', 'A credit card'],
      correctIndex: 1,
      feedback: 'A fixed deposit is a deposit that has a fixed maturity period and typically offers higher interest rates.'
    },
    {
      questionText: 'What is the meaning of ATM?',
      options: ['Automated Teller Machine', 'Automatic Transfer Mechanism', 'Account Transaction Module', 'Automated Transaction Manager'],
      correctIndex: 0,
      feedback: 'ATM stands for Automated Teller Machine, which allows customers to perform basic transactions without help.'
    },
    {
      questionText: 'What is KYC in banking?',
      options: ['Keep Your Cash', 'Know Your Customer', 'Key Yearly Credit', 'Knowledge Yield Certificate'],
      correctIndex: 1,
      feedback: 'KYC stands for Know Your Customer, a process of verifying the identity of clients.'
    },
    {
      questionText: 'What is a credit card?',
      options: ['A card for withdrawing cash only', 'A card that allows borrowing money up to a limit', 'A debit card', 'A gift card'],
      correctIndex: 1,
      feedback: 'A credit card allows you to borrow money up to a certain limit to make purchases.'
    },
    {
      questionText: 'What is the central bank of Bangladesh?',
      options: ['World Bank', 'Bangladesh Bank', 'IFIC Bank', 'Central Bank of India'],
      correctIndex: 1,
      feedback: 'Bangladesh Bank is the central bank of Bangladesh.'
    },
    {
      questionText: 'What is mobile banking?',
      options: ['Banking through mobile phones', 'Banking at a bank branch', 'Banking through ATM', 'Banking through computer'],
      correctIndex: 0,
      feedback: 'Mobile banking refers to banking services accessed through mobile devices.'
    },
    {
      questionText: 'What is a loan?',
      options: ['Money saved in bank', 'Money borrowed to be repaid with interest', 'A type of credit card', 'A bank account'],
      correctIndex: 1,
      feedback: 'A loan is money borrowed from a lender that must be repaid with interest.'
    },
    {
      questionText: 'What is interest rate?',
      options: ['Fee charged for banking services', 'Percentage charged for borrowing money', 'Tax on savings', 'Commission on transactions'],
      correctIndex: 1,
      feedback: 'Interest rate is the percentage charged for borrowing money or paid on savings.'
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('Initializing database...');
    await initDB();
    
    console.log('Adding sample quiz...');
    const quizId = await addQuiz(sampleQuiz.title);
    
    const questionsWithQuizId = sampleQuiz.questions.map(q => ({
      quizId,
      questionText: q.questionText,
      options: q.options,
      correctIndex: q.correctIndex,
      feedback: q.feedback
    }));
    
    await addQuestions(questionsWithQuizId);
    
    console.log('Sample quiz added successfully!');
    console.log(`Quiz ID: ${quizId}`);
    console.log(`Questions: ${questionsWithQuizId.length}`);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
```

- [ ] **Step 2: Run seed script**

Run: `cd IFIC-Quiz && node seed.js`

---

## Task 12: Build and Test

- [ ] **Step 1: Start Expo development server**

Run: `cd IFIC-Quiz && npx expo start`

- [ ] **Step 2: Test on web**

Open browser at http://localhost:8081

- [ ] **Step 3: Verify functionality**

- Home screen shows quiz list
- Can start a quiz
- Can answer questions with Previous/Next
- Progress auto-saves
- Can finish quiz and see results
- Can review answers
- Can add new quiz