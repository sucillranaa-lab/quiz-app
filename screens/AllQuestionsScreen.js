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
            {/* Question header with number */}
            <View className="flex-row items-start mb-3">
              <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mr-2.5 mt-0.5">
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

            {/* Feedback / Explanation */}
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
