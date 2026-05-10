import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, SafeAreaView } from '../components/ui';
import { Award, CheckCircle2, ClipboardList, Clock, Eye, Home, XCircle } from 'lucide-react-native';
import { getLatestProgressByQuizId, getQuiz, getQuestionsByQuizId } from '../db/database';
import { getRandomQuizData } from '../utils/randomQuizStore';

const formatTime = (totalSeconds) => {
  if (!totalSeconds) return '--:--';
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function ResultsScreen({ navigation, route }) {
  const { quizId, score, elapsedSeconds, randomMode } = route.params;
  const [quiz, setQuiz] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    loadData();
  }, [quizId]);

  const loadData = async () => {
    try {
      if (randomMode) {
        const data = getRandomQuizData();
        setQuiz({ title: 'Random Quiz', id: 'random' });
        setTotalQuestions(data?.selectedCount || 0);
        return;
      }

      const quizData = await getQuiz(quizId);
      const questions = await getQuestionsByQuizId(quizId);
      const progress = await getLatestProgressByQuizId(quizId);
      setQuiz(quizData);
      setTotalQuestions(progress?.selectedCount || questions.length);
    } catch (error) {
      console.error('Error loading results:', error);
    }
  };

  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const passed = percentage >= 70;
  const incorrect = Math.max(totalQuestions - score, 0);

  if (!quiz && totalQuestions === 0) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0f766e" />
        <Text className="text-slate-500 mt-4 font-medium">Building your score report...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-white border-b border-slate-200 px-6 py-5">
        <Text className="text-slate-950 text-2xl font-bold text-center">Results</Text>
      </View>

      <View className="p-6 flex-1">
        <View className="bg-slate-950 rounded-2xl p-6">
          <View className="flex-row items-center">
            <View className={`w-28 h-28 rounded-full items-center justify-center mr-5 ${
              passed ? 'bg-green-600' : 'bg-amber-500'
            }`}>
              <Text className="text-white text-4xl font-bold">{percentage}%</Text>
              <Text className="text-white text-xs font-semibold">{score} of {totalQuestions}</Text>
            </View>
            <View className="flex-1">
              <Text className={`text-2xl font-bold ${passed ? 'text-green-300' : 'text-amber-300'}`}>
                {passed ? 'Passed' : 'Keep practicing'}
              </Text>
              <Text className="text-white text-lg font-semibold mt-1">{quiz?.title}</Text>
              <Text className="text-slate-300 mt-2 leading-5">
                {passed
                  ? 'Strong result. Review the explanations to lock in the details.'
                  : 'Review missed concepts, then restart for a stronger attempt.'}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mt-5">
          <Text className="text-xl font-bold text-slate-950 mb-4">Quiz summary</Text>

          <View className="flex-row">
            <View className="flex-1 items-center">
              <CheckCircle2 size={24} color="#16a34a" />
              <Text className="text-2xl font-bold text-slate-950 mt-2">{score}</Text>
              <Text className="text-xs text-slate-500">Correct</Text>
            </View>
            <View className="flex-1 items-center border-x border-slate-200">
              <XCircle size={24} color="#dc2626" />
              <Text className="text-2xl font-bold text-slate-950 mt-2">{incorrect}</Text>
              <Text className="text-xs text-slate-500">Incorrect</Text>
            </View>
            <View className="flex-1 items-center">
              <Clock size={24} color="#0f766e" />
              <Text className="text-2xl font-bold text-slate-950 mt-2">{formatTime(elapsedSeconds)}</Text>
              <Text className="text-xs text-slate-500">Time</Text>
            </View>
          </View>

          <View className={`flex-row items-center rounded-2xl p-4 mt-5 ${
            passed ? 'bg-green-50' : 'bg-amber-50'
          }`}>
            <Award size={22} color={passed ? '#16a34a' : '#b45309'} />
            <Text className={`ml-3 flex-1 font-semibold ${
              passed ? 'text-green-800' : 'text-amber-900'
            }`}>
              {passed ? 'Your score is above the 70% target.' : 'Target score is 70%. Keep going.'}
            </Text>
          </View>
        </View>
      </View>

      <View className="p-6 gap-3 bg-white border-t border-slate-200">
        <TouchableOpacity
          onPress={() => navigation.navigate('Review', { quizId, randomMode })}
          activeOpacity={0.88}
          className="bg-teal-700 py-4 rounded-2xl flex-row items-center justify-center gap-2"
        >
          <Eye size={22} color="white" />
          <Text className="text-white text-lg font-semibold">Review Answers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.88}
          className="bg-white border border-slate-300 py-4 rounded-2xl flex-row items-center justify-center gap-2"
        >
          <Home size={22} color="#334155" />
          <Text className="text-slate-700 text-lg font-semibold">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
