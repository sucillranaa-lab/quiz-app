import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from '../components/ui';
import { ArrowLeft, ArrowRight, Bookmark, CheckCircle, Info } from 'lucide-react-native';
import { getQuiz, getQuestionsByQuizId, getProgressByQuizId, saveProgress, completeQuiz, clearProgress } from '../db/database';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import { calculateScore, getAnsweredCount } from '../utils/helpers';

export default function QuizScreen({ navigation, route }) {
  const { quizId, startFresh } = route.params;
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const answersRef = useRef({});

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const quizData = await getQuiz(quizId);
      const questionsData = await getQuestionsByQuizId(quizId);

      setQuiz(quizData);
      setQuestions(questionsData);

      if (startFresh) {
        await clearProgress(quizId);
        setCurrentIndex(0);
        setAnswers({});
        answersRef.current = {};
      } else {
        const progress = await getProgressByQuizId(quizId);
        if (progress) {
          setCurrentIndex(progress.currentIndex);
          setAnswers(progress.answers || {});
          answersRef.current = progress.answers || {};
        }
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = useCallback(async (answerIndex) => {
    const newAnswers = { ...answersRef.current, [questions[currentIndex].id]: answerIndex };
    answersRef.current = newAnswers;
    setAnswers(newAnswers);

    // Auto-save progress
    await saveProgress(quizId, currentIndex, newAnswers);
  }, [answers, currentIndex, questions, quizId]);

  const handleNext = async () => {
    const latestAnswers = answersRef.current;
    if (currentIndex < questions.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      await saveProgress(quizId, newIndex, latestAnswers);
    } else {
      // Quiz completed
      const score = calculateScore(questions, latestAnswers);
      await completeQuiz(quizId, score);
      navigation.replace('Results', { quizId, score });
    }
  };

  const handlePrevious = async () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      await saveProgress(quizId, newIndex, answersRef.current);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0f766e" />
        <Text className="text-slate-500 mt-4 font-medium">Loading quiz...</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center px-6">
        <Text className="text-xl font-bold text-slate-950">No questions found</Text>
        <Text className="text-slate-500 text-center mt-2">This quiz does not have any questions yet.</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-6 bg-teal-700 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Back to quizzes</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const selectedAnswer = answers[currentQuestion?.id];
  const answeredCount = getAnsweredCount(answers);
  const isCurrentAnswered = selectedAnswer !== undefined;
  const progressPercent = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-white border-b border-slate-200 px-5 py-4">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
          >
            <ArrowLeft size={22} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-slate-950 text-lg font-bold flex-1 mx-3" numberOfLines={1}>
            {quiz?.title}
          </Text>
          <View className="w-10 h-10 rounded-full bg-amber-100 items-center justify-center">
            <Bookmark size={20} color="#b45309" />
          </View>
        </View>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm font-semibold text-slate-600">
            Question {currentIndex + 1} of {questions.length}
          </Text>
          <Text className="text-sm font-bold text-teal-700">{progressPercent}%</Text>
        </View>
        <View className="mt-3">
          <ProgressBar current={currentIndex} total={questions.length} />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 28 }}
      >
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
        />
        <View className="flex-row items-center mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <Info size={18} color="#b45309" />
          <Text className="text-amber-900 text-sm ml-2 flex-1">
            Select the best answer before moving forward. Your progress saves automatically.
          </Text>
        </View>
      </ScrollView>

      <View className="bg-white border-t border-slate-200 px-5 py-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-xs font-semibold text-slate-500">
            {answeredCount} of {questions.length} answered
          </Text>
          {!isCurrentAnswered && (
            <Text className="text-xs font-bold text-amber-700">Answer required</Text>
          )}
        </View>
        <View className="flex-row justify-between gap-3">
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          activeOpacity={0.88}
          className={`flex-1 flex-row items-center justify-center gap-2 py-4 rounded-2xl border ${
            currentIndex === 0 ? 'opacity-40 border-slate-200 bg-slate-100' : 'border-slate-300 bg-white'
          }`}
        >
          <ArrowLeft size={22} color="#334155" />
          <Text className="font-semibold text-slate-700">Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          disabled={!isCurrentAnswered}
          activeOpacity={0.88}
          className={`flex-1 flex-row items-center justify-center gap-2 py-4 rounded-2xl ${
            isCurrentAnswered ? 'bg-teal-700' : 'bg-slate-300'
          }`}
        >
          <Text className="text-white font-semibold">
            {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </Text>
          {currentIndex < questions.length - 1 && <ArrowRight size={22} color="white" />}
          {currentIndex === questions.length - 1 && <CheckCircle size={22} color="white" />}
        </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
