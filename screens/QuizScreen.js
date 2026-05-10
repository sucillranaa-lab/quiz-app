import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from '../components/ui';
import { ArrowLeft, ArrowRight, CheckCircle, Home, Info } from 'lucide-react-native';
import { getQuiz, getQuestionsByQuizId, getProgressByQuizId, saveProgress, completeQuiz, clearProgress, getAllQuestions } from '../db/database';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import { calculateScore, getAnsweredCount, shuffleArray } from '../utils/helpers';
import { setRandomQuizData, clearRandomQuizData } from '../utils/randomQuizStore';

const questionCountChoices = (total) => {
  const choices = [10, 20, 30, 50, 75, 100].filter(count => count <= total);
  return choices.includes(total) ? choices : [...choices, total];
};

export default function QuizScreen({ navigation, route }) {
  const { quizId, startFresh, randomMode } = route.params;
  const [quiz, setQuiz] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCount, setSelectedCount] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const elapsedRef = useRef(0);
  const answersRef = useRef({});
  const selectedCountRef = useRef(null);
  const timerRef = useRef(null);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => {
        const next = prev + 1;
        elapsedRef.current = next;
        return next;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopTimer(); // cleanup on unmount
  }, []);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      if (randomMode) {
        clearRandomQuizData();
        const allQuestionsData = await getAllQuestions();
        const shuffled = shuffleArray(allQuestionsData);
        setQuiz({ title: 'Random Quiz', id: 'random' });
        setAllQuestions(shuffled);
        setLoading(false);
        return;
      }

      const quizData = await getQuiz(quizId);
      const questionsData = await getQuestionsByQuizId(quizId);

      setQuiz(quizData);
      setAllQuestions(questionsData);

      if (startFresh) {
        await clearProgress(quizId);
        setQuestions([]);
        setCurrentIndex(0);
        setAnswers({});
        answersRef.current = {};
        setSelectedCount(null);
        selectedCountRef.current = null;
        setQuizStarted(false);
      } else {
        const progress = await getProgressByQuizId(quizId);
        if (progress) {
          const savedCount = progress.selectedCount || questionsData.length;
          const selectedQuestions = questionsData.slice(0, savedCount);
          const savedIndex = Math.min(progress.currentIndex || 0, Math.max(selectedQuestions.length - 1, 0));

          setSelectedCount(savedCount);
          selectedCountRef.current = savedCount;
          setQuestions(selectedQuestions);
          setCurrentIndex(savedIndex);
          setAnswers(progress.answers || {});
          answersRef.current = progress.answers || {};
          setQuizStarted(true);
          startTimer();
        }
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (count) => {
    const selectedQuestions = allQuestions.slice(0, count);

    setQuestions(selectedQuestions);
    setSelectedCount(count);
    selectedCountRef.current = count;
    setCurrentIndex(0);
    setAnswers({});
    answersRef.current = {};
    setQuizStarted(true);
    startTimer();

    if (!randomMode) {
      await saveProgress(quizId, 0, {}, count);
    }
  };

  const handleExit = async () => {
    stopTimer();
    if (quizStarted && !randomMode) {
      await saveProgress(quizId, currentIndex, answersRef.current, selectedCountRef.current || selectedCount || questions.length);
    }
    navigation.navigate('Home');
  };

  const handleSelectAnswer = useCallback(async (answerIndex) => {
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) {
      return;
    }

    const newAnswers = { ...answersRef.current, [currentQuestion.id]: answerIndex };
    answersRef.current = newAnswers;
    setAnswers(newAnswers);

    if (!randomMode) {
      await saveProgress(quizId, currentIndex, newAnswers, selectedCountRef.current || selectedCount || questions.length);
    }
  }, [currentIndex, questions, quizId, selectedCount, randomMode]);

  const handleNext = async () => {
    const latestAnswers = answersRef.current;
    const countToSave = selectedCountRef.current || selectedCount || questions.length;

    if (currentIndex < questions.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      if (!randomMode) {
        await saveProgress(quizId, newIndex, latestAnswers, countToSave);
      }
    } else {
      stopTimer();
      const score = calculateScore(questions, latestAnswers);
      const finalElapsed = elapsedRef.current;

      if (randomMode) {
        setRandomQuizData({
          questions,
          answers: latestAnswers,
          score,
          selectedCount: countToSave,
          elapsedSeconds: finalElapsed
        });
        navigation.replace('Results', { quizId: 'random', score, elapsedSeconds: finalElapsed, randomMode: true });
      } else {
        await completeQuiz(quizId, score, countToSave, finalElapsed);
        navigation.replace('Results', { quizId, score, elapsedSeconds: finalElapsed });
      }
    }
  };

  const handlePrevious = async () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      if (!randomMode) {
        await saveProgress(quizId, newIndex, answersRef.current, selectedCountRef.current || selectedCount || questions.length);
      }
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

  if (!quizStarted && allQuestions.length > 0) {
    const choices = questionCountChoices(allQuestions.length);

    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="bg-white border-b border-slate-200 px-5 py-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleExit}
              activeOpacity={0.88}
              className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3"
            >
              <ArrowLeft size={22} color="#0f172a" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-slate-950 text-xl font-bold" numberOfLines={1}>{quiz?.title}</Text>
              <Text className="text-slate-500 mt-1">Choose your practice length</Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 28 }}
        >
          <View className="bg-slate-950 rounded-2xl p-5 mb-5">
            <Text className="text-teal-200 text-sm font-semibold">Question setup</Text>
            <Text className="text-white text-3xl font-bold mt-2">{allQuestions.length} available</Text>
            <Text className="text-slate-300 mt-2 leading-5">
              {randomMode
                ? 'Questions are picked at random from all exam sets. Progress is not saved.'
                : 'Pick how many questions you want in this attempt. Your choice and answers save automatically.'}
            </Text>
          </View>

          {choices.map((count) => (
            <TouchableOpacity
              key={count}
              onPress={() => handleStartQuiz(count)}
              activeOpacity={0.88}
              className="bg-white border border-slate-200 rounded-2xl p-5 mb-3 shadow-sm"
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-xl font-bold text-slate-950">{count} questions</Text>
                  <Text className="text-slate-500 mt-1">
                    {count === allQuestions.length ? 'Use the full combined quiz bank' : randomMode ? 'Randomly selected across all exams' : 'Focused practice session'}
                  </Text>
                </View>
                <ArrowRight size={22} color="#0f766e" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
          onPress={handleExit}
          activeOpacity={0.88}
          className="mt-6 bg-teal-700 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Back to quizzes</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const selectedAnswer = answers[currentQuestion.id];
  const answeredCount = getAnsweredCount(answers);
  const isCurrentAnswered = selectedAnswer !== undefined;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-white border-b border-slate-200 px-5 py-4">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={handleExit}
            activeOpacity={0.88}
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
          >
            <Home size={21} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-slate-950 text-lg font-bold flex-1 mx-3" numberOfLines={1}>
            {quiz?.title}
          </Text>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center bg-slate-100 rounded-lg px-2.5 py-1">
              <Text className="text-base font-bold text-slate-700 tabular-nums">{formatTime(elapsedSeconds)}</Text>
            </View>
            <Text className="text-sm font-bold text-teal-700">{answeredCount}/{questions.length}</Text>
          </View>
        </View>
        <ProgressBar current={currentIndex} total={questions.length} />
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
            {randomMode ? 'Random questions picked from all exam sets. Exit discards progress.' : 'You can exit any time. Your current question, selected length, and answers are saved.'}
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
