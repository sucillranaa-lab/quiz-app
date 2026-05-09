import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from '../components/ui';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Home, Lightbulb } from 'lucide-react-native';
import { getQuestionsByQuizId, getLatestProgressByQuizId } from '../db/database';
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
        <Text className="text-slate-500 font-medium">Loading answer review...</Text>
      </SafeAreaView>
    );
  }

  const question = questions[currentIndex];
  if (!question) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center px-6">
        <Text className="text-xl font-bold text-slate-950">No answers to review</Text>
        <Text className="text-slate-500 text-center mt-2">Complete a quiz attempt to see answer explanations.</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          className="mt-6 bg-teal-700 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Back to Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const userAnswer = userAnswers[question.id];
  const isCorrect = userAnswer === question.correctIndex;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-white border-b border-slate-200 px-5 py-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3"
          >
            <ArrowLeft size={22} color="#0f172a" />
          </TouchableOpacity>
          <View>
            <Text className="text-slate-950 text-xl font-bold">Review Answers</Text>
            <Text className="text-slate-500 mt-1">
              Question {currentIndex + 1} of {questions.length}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 28 }}
      >
        <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm border border-slate-200">
          <Text className="text-xs font-bold text-teal-700 uppercase mb-3">
            Question {currentIndex + 1}
          </Text>
          <Text className="text-xl font-bold text-slate-950 leading-7">
            {question.questionText}
          </Text>
        </View>

        <View className="gap-3 mb-4">
          {question.options.map((option, index) => {
            const isUserAnswer = userAnswer === index;
            const isCorrectAnswer = question.correctIndex === index;

            let optionStyle = 'bg-white border-slate-200';
            let letterStyle = 'bg-slate-50 border-slate-200';
            let letterTextStyle = 'text-slate-700';
            if (isCorrectAnswer) {
              optionStyle = 'bg-green-50 border-green-600';
              letterStyle = 'bg-green-600 border-green-600';
              letterTextStyle = 'text-white';
            } else if (isUserAnswer && !isCorrect) {
              optionStyle = 'bg-red-50 border-red-600';
              letterStyle = 'bg-red-600 border-red-600';
              letterTextStyle = 'text-white';
            }

            return (
              <View
                key={index}
                className={`p-4 rounded-2xl border ${optionStyle}`}
              >
                <View className="flex-row items-start">
                  <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 border ${letterStyle}`}>
                    <Text className={`font-bold ${letterTextStyle}`}>
                      {getOptionLetter(index)}
                    </Text>
                  </View>
                  <Text className="text-base flex-1 text-slate-800 leading-6">
                    {option}
                  </Text>
                  {isCorrectAnswer && (
                    <CheckCircle size={22} color="#16a34a" />
                  )}
                  {isUserAnswer && !isCorrect && (
                    <XCircle size={22} color="#dc2626" />
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <View className={`p-4 rounded-2xl mb-4 ${
          isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <View className="flex-row items-center gap-2">
            {isCorrect ? (
              <>
                <CheckCircle size={20} color="#16a34a" />
                <Text className="text-green-800 font-semibold">Correct answer</Text>
              </>
            ) : (
              <>
                <XCircle size={20} color="#dc2626" />
                <Text className="text-red-800 font-semibold">Incorrect answer</Text>
              </>
            )}
          </View>
        </View>

        {question.feedback && (
          <View className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
            <View className="flex-row items-center mb-2">
              <Lightbulb size={18} color="#b45309" />
              <Text className="text-amber-900 font-bold ml-2">Explanation</Text>
            </View>
            <Text className="text-amber-900">{question.feedback}</Text>
          </View>
        )}
      </ScrollView>

      <View className="p-5 bg-white border-t border-slate-200">
        <View className="flex-row justify-between gap-3">
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          activeOpacity={0.88}
          className={`flex-1 flex-row items-center justify-center gap-2 py-4 rounded-2xl border ${
            currentIndex === 0 ? 'opacity-40 bg-slate-100 border-slate-200' : 'bg-white border-slate-300'
          }`}
        >
          <ArrowLeft size={22} color="#334155" />
          <Text className="font-semibold text-slate-700">Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          disabled={currentIndex === questions.length - 1}
          activeOpacity={0.88}
          className={`flex-1 flex-row items-center justify-center gap-2 py-4 rounded-2xl ${
            currentIndex === questions.length - 1 ? 'opacity-40 bg-slate-300' : 'bg-teal-700'
          }`}
        >
          <Text className={`font-semibold ${
            currentIndex === questions.length - 1 ? 'text-slate-500' : 'text-white'
          }`}>
            Next
          </Text>
          {currentIndex < questions.length - 1 && <ArrowRight size={22} color="white" />}
        </TouchableOpacity>
        </View>
      </View>

      <View className="px-5 pb-4 bg-white">
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.88}
          className="bg-slate-100 py-3 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Home size={20} color="#334155" />
          <Text className="text-slate-700 font-semibold">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
