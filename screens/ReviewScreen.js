import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from '../components/ui';
import { ArrowLeft, CheckCircle, XCircle, Home, Lightbulb, Award, HelpCircle } from 'lucide-react-native';
import { getQuestionsByQuizId, getLatestProgressByQuizId } from '../db/database';
import { getOptionLetter } from '../utils/helpers';
import RichQuestionText from '../components/HtmlTable';
import { getRandomQuizData } from '../utils/randomQuizStore';

export default function ReviewScreen({ navigation, route }) {
  const { quizId, randomMode } = route.params;
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [quizId]);

  const loadData = async () => {
    try {
      if (randomMode) {
        const data = getRandomQuizData();
        setQuestions(data?.questions || []);
        setUserAnswers(data?.answers || {});
        setLoading(false);
        return;
      }

      const questionsData = await getQuestionsByQuizId(quizId);
      const progress = await getLatestProgressByQuizId(quizId);
      const selectedCount = progress?.selectedCount || questionsData.length;

      setQuestions(questionsData.slice(0, selectedCount));
      setUserAnswers(progress?.answers || {});
    } catch (error) {
      console.error('Error loading review data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <Text className="text-slate-500 font-medium">Loading answer review...</Text>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center px-6">
        <HelpCircle size={48} color="#94a3b8" />
        <Text className="text-xl font-bold text-slate-950 mt-4">No answers to review</Text>
        <Text className="text-slate-500 text-center mt-2">Complete a quiz attempt to see answer explanations.</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.85}
          className="mt-6 bg-indigo-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Back to Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Calculate summary stats
  let correctCount = 0;
  let unansweredCount = 0;
  for (const q of questions) {
    const userAns = userAnswers[q.id];
    if (userAns === undefined || userAns === null) {
      unansweredCount++;
    } else if (userAns === q.correctIndex) {
      correctCount++;
    }
  }
  const incorrectCount = questions.length - correctCount - unansweredCount;
  const answeredCount = correctCount + incorrectCount;

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
            <Text className="text-slate-950 text-xl font-bold">Review Answers</Text>
            <Text className="text-slate-500 text-sm mt-0.5">{questions.length} questions reviewed</Text>
          </View>
          <View className="flex-row items-center bg-indigo-50 px-3 py-1.5 rounded-lg">
            <Award size={16} color="#4f46e5" />
            <Text className="text-indigo-700 font-bold ml-1.5">{Math.round((correctCount / answeredCount) * 100) || 0}%</Text>
          </View>
        </View>
      </View>

      {/* Summary bar */}
      <View className="flex-row bg-white border-b border-slate-100 px-5 py-3">
        <View className="flex-row items-center mr-5">
          <View className="w-2.5 h-2.5 rounded-full bg-green-500 mr-1.5" />
          <Text className="text-xs text-slate-500">{correctCount} Correct</Text>
        </View>
        <View className="flex-row items-center mr-5">
          <View className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5" />
          <Text className="text-xs text-slate-500">{incorrectCount} Incorrect</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-2.5 h-2.5 rounded-full bg-slate-300 mr-1.5" />
          <Text className="text-xs text-slate-500">{unansweredCount} Skipped</Text>
        </View>
      </View>

      {/* Full list of questions */}
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 28 }}
      >
        {questions.map((question, qIndex) => {
          const userAnswer = userAnswers[question.id];
          const isCorrect = userAnswer === question.correctIndex;
          const isUnanswered = userAnswer === undefined || userAnswer === null;

          return (
            <View key={question.id || qIndex} className="mb-5">
              {/* Question header */}
              <View className="flex-row items-center mb-3">
                <View className={`w-8 h-8 rounded-full items-center justify-center mr-2.5 ${
                  isUnanswered ? 'bg-slate-100' : isCorrect ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Text className={`text-sm font-bold ${
                    isUnanswered ? 'text-slate-500' : isCorrect ? 'text-green-700' : 'text-red-700'
                  }`}>{qIndex + 1}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-slate-400 uppercase">Question {qIndex + 1}</Text>
                  <RichQuestionText
                    text={question.questionText}
                    textClassName="text-base font-bold text-slate-900 leading-5 mt-0.5"
                  />
                </View>
                <View className="ml-3">
                  {isUnanswered ? (
                    <View className="bg-slate-100 px-2.5 py-1 rounded-full">
                      <Text className="text-xs font-semibold text-slate-500">Skip</Text>
                    </View>
                  ) : isCorrect ? (
                    <CheckCircle size={22} color="#16a34a" />
                  ) : (
                    <XCircle size={22} color="#dc2626" />
                  )}
                </View>
              </View>

              {/* Options */}
              <View className="gap-2 mb-3">
                {question.options.map((option, optIndex) => {
                  const isUserAns = userAnswer === optIndex;
                  const isCorrectAns = question.correctIndex === optIndex;

                  let optionStyle = 'bg-white border-slate-200';
                  let letterStyle = 'bg-slate-50 border-slate-200';
                  let letterTextStyle = 'text-slate-600';
                  let checkIcon = null;

                  if (isCorrectAns) {
                    optionStyle = 'bg-green-50 border-green-500';
                    letterStyle = 'bg-green-600 border-green-600';
                    letterTextStyle = 'text-white';
                    checkIcon = <CheckCircle size={18} color="#16a34a" />;
                  } else if (isUserAns && !isCorrectAns) {
                    optionStyle = 'bg-red-50 border-red-400';
                    letterStyle = 'bg-red-600 border-red-600';
                    letterTextStyle = 'text-white';
                    checkIcon = <XCircle size={18} color="#dc2626" />;
                  }

                  return (
                    <View
                      key={optIndex}
                      className={`flex-row items-center p-3.5 rounded-xl border ${optionStyle}`}
                    >
                      <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 border ${letterStyle}`}>
                        <Text className={`text-sm font-bold ${letterTextStyle}`}>
                          {getOptionLetter(optIndex)}
                        </Text>
                      </View>
                      <Text className={`text-sm flex-1 leading-5 ${
                        isCorrectAns ? 'text-green-800 font-medium' : 'text-slate-700'
                      }`}>
                        {option}
                      </Text>
                      {checkIcon && <View className="ml-2">{checkIcon}</View>}
                    </View>
                  );
                })}
              </View>

              {/* Feedback / Explanation */}
              {question.feedback && (
                <View className={`p-3.5 rounded-xl border ${
                  isUnanswered
                    ? 'bg-slate-50 border-slate-200'
                    : isCorrect
                      ? 'bg-green-50 border-green-200'
                      : 'bg-amber-50 border-amber-200'
                }`}>
                  <View className="flex-row items-start">
                    <Lightbulb size={16} color={isCorrect ? '#16a34a' : '#b45309'} className="mt-0.5" />
                    <View className="flex-1 ml-2.5">
                      {!isCorrect && !isUnanswered && (
                        <Text className="text-xs font-bold text-amber-800 mb-1">
                          Your answer: {getOptionLetter(userAnswer)} — Correct answer: {getOptionLetter(question.correctIndex)}
                        </Text>
                      )}
                      {isUnanswered && (
                        <Text className="text-xs font-bold text-slate-500 mb-1">
                          Correct answer: {getOptionLetter(question.correctIndex)}
                        </Text>
                      )}
                      <Text className={`text-sm leading-5 ${
                        isCorrect ? 'text-green-800' : isUnanswered ? 'text-slate-600' : 'text-amber-900'
                      }`}>
                        {question.feedback}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Divider between questions */}
              {qIndex < questions.length - 1 && (
                <View className="h-px bg-slate-100 mt-1" />
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom action */}
      <View className="px-5 py-4 bg-white border-t border-slate-200">
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.85}
          className="bg-indigo-600 py-3.5 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Home size={20} color="white" />
          <Text className="text-white font-semibold text-base">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
