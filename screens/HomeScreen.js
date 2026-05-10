import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, RefreshControl } from 'react-native';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from '../components/ui';
import { GraduationCap, BookOpen, FileText, ChevronRight, Shuffle } from 'lucide-react-native';

import { getAllQuizzes, getQuestionsByQuizId, getProgressByQuizId, clearProgress, addQuiz, addQuestions, clearAllData, initDB } from '../db/database';
import QuizCard from '../components/QuizCard';
import { quizSources } from '../QuizData/index';
import { isDev } from '../utils/env';

const seedDatabase = async () => {
  try {
    await clearAllData();
    console.log(`Seeding ${quizSources.length} quiz source(s)...`);
    for (const source of quizSources) {
      const quizId = await addQuiz(source.name);
      const questions = source.data.map(q => ({
        quizId,
        questionText: q.question,
        options: q.options,
        correctIndex: q.correct,
        feedback: q.feedback
      }));
      await addQuestions(questions);
      console.log(`  ${source.name}: ${questions.length} questions`);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

export default function HomeScreen({ navigation }) {
  const [quizzes, setQuizzes] = useState([]);
  const [quizData, setQuizData] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      await seedDatabase();
      const allQuizzes = await getAllQuizzes();
      setQuizzes(allQuizzes);

      const data = {};
      let totalQuestions = 0;
      for (const quiz of allQuizzes) {
        const questions = await getQuestionsByQuizId(quiz.id);
        const progress = await getProgressByQuizId(quiz.id);
        totalQuestions += questions.length;
        data[quiz.id] = {
          questionCount: questions.length,
          progress: progress
        };
      }
      data._totalQuestions = totalQuestions;
      setQuizData(data);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await loadData();
      setLoading(false);
    };
    init();
  }, [loadData]);

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

  const handleRandomQuiz = () => {
    navigation.navigate('Quiz', { quizId: 'random', startFresh: true, randomMode: true });
  };

  const handleShowAll = (quiz) => {
    navigation.navigate('AllQuestions', { quizId: quiz.id, quizTitle: quiz.title });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <View className="w-16 h-16 bg-indigo-100 rounded-2xl items-center justify-center mb-6">
          <GraduationCap size={32} color="#4f46e5" />
        </View>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="text-slate-400 mt-4 text-sm">Loading your exams...</Text>
      </SafeAreaView>
    );
  }

  const totalQuestions = quizData._totalQuestions || 0;
  const totalExams = quizzes.length;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header with gradient overlay */}
      <View className="bg-indigo-900 px-6 pt-12 pb-0 relative">
        <View className="absolute inset-0" style={{ backgroundColor: '#3730a3', opacity: 0.5 }} />
        <View className="relative z-10">
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <GraduationCap size={22} color="white" />
            </View>
            <View>
              <Text className="text-white text-2xl font-bold">Exam Practice</Text>
              <Text className="text-indigo-200 text-sm mt-0.5">Master your exams with confidence</Text>
            </View>
          </View>
        </View>

        {/* Stats summary card */}
        <View className="mt-5 bg-white rounded-xl px-5 py-4 shadow-lg mx-0" style={{ marginBottom: -24 }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-9 h-9 bg-indigo-50 rounded-lg items-center justify-center mr-3">
                <BookOpen size={18} color="#4f46e5" />
              </View>
              <View>
                <Text className="text-xs text-slate-400 font-medium">Total Exams</Text>
                <Text className="text-lg font-bold text-slate-900">{totalExams}</Text>
              </View>
            </View>
            <View style={{ width: 1, height: 40 }} className="bg-slate-200" />
            <View className="flex-row items-center">
              <View className="w-9 h-9 bg-blue-50 rounded-lg items-center justify-center mr-3">
                <FileText size={18} color="#3b82f6" />
              </View>
              <View>
                <Text className="text-xs text-slate-400 font-medium">Questions</Text>
                <Text className="text-lg font-bold text-slate-900">{totalQuestions}</Text>
              </View>
            </View>
            <View style={{ width: 1, height: 40 }} className="bg-slate-200" />
            <View className="flex-row items-center">
              <View className="w-9 h-9 bg-amber-50 rounded-lg items-center justify-center mr-3">
                <Text className="text-amber-500 text-sm font-bold">{totalExams > 0 ? Math.round(100/totalExams) : 0}</Text>
              </View>
              <View>
                <Text className="text-xs text-slate-400 font-medium">Avg Score</Text>
                <Text className="text-lg font-bold text-slate-900">--</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        className="flex-1 pt-12 px-5"
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4f46e5"
            colors={['#4f46e5']}
          />
        }
      >
        {/* Section header */}
        <View className="flex-row items-center justify-between mb-4 mt-1">
          <Text className="text-lg font-bold text-slate-900">Your Exams</Text>
          <TouchableOpacity className="flex-row items-center" activeOpacity={0.7}>
            <Text className="text-sm font-medium text-indigo-600 mr-1">View All</Text>
            <ChevronRight size={14} color="#4f46e5" />
          </TouchableOpacity>
        </View>

        {quizzes.length === 0 ? (
          <View className="items-center justify-center pt-16">
            <View className="w-20 h-20 bg-slate-100 rounded-full items-center justify-center mb-4">
              <BookOpen size={36} color="#94a3b8" />
            </View>
            <Text className="text-slate-500 text-lg font-medium">No exams available</Text>
            <Text className="text-slate-400 text-sm mt-1">Pull down to refresh</Text>
          </View>
        ) : (
          <View>
            {quizzes.map(quiz => (
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
            ))}

            {/* Random Quiz card */}
            <TouchableOpacity
              onPress={handleRandomQuiz}
              activeOpacity={0.85}
              className="bg-white border-2 border-purple-200 rounded-2xl p-5 mt-3"
              style={{ borderStyle: 'dashed' }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1 mr-3">
                  <View className="w-12 h-12 rounded-2xl bg-purple-100 items-center justify-center mr-4">
                    <Shuffle size={24} color="#7c3aed" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-950 text-lg font-bold">Random Quiz</Text>
                    <Text className="text-slate-500 text-sm mt-0.5">
                      Random questions from all {totalExams} exam sets — {totalQuestions} total
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#7c3aed" />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}