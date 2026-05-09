import React, { useState } from 'react';
import { Alert } from 'react-native';
import { View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from '../components/ui';
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
        <View className="bg-white border-b border-slate-200 px-6 py-4 flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 w-10 h-10 rounded-full bg-slate-100 items-center justify-center">
            <ArrowLeft size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-slate-950 text-xl font-bold">New Quiz</Text>
        </View>

        <View className="p-6">
          <View className="bg-slate-950 rounded-2xl p-5 mb-5">
            <Text className="text-teal-200 font-semibold">Quiz builder</Text>
            <Text className="text-white text-3xl font-bold mt-2">Create a focused practice set</Text>
            <Text className="text-slate-300 mt-2">Name it clearly so it is easy to resume later.</Text>
          </View>

          <Text className="text-lg font-bold text-slate-950 mb-3">Quiz Title</Text>
          <TextInput
            value={quizTitle}
            onChangeText={setQuizTitle}
            placeholder="Enter quiz title..."
            className="bg-white p-4 rounded-xl border border-slate-200 text-lg text-slate-950"
            placeholderTextColor="#9ca3af"
          />

          <TouchableOpacity
            onPress={() => setStep('questions')}
            disabled={!quizTitle.trim()}
            activeOpacity={0.88}
            className={`mt-6 py-4 rounded-xl items-center ${
              quizTitle.trim() ? 'bg-teal-700' : 'bg-slate-300'
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
        <View className="bg-white border-b border-slate-200 px-6 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => setStep('title')} className="mr-4 w-10 h-10 rounded-full bg-slate-100 items-center justify-center">
              <ArrowLeft size={24} color="#0f172a" />
            </TouchableOpacity>
            <Text className="text-slate-950 text-xl font-bold">Add Questions</Text>
          </View>
          <View className="bg-teal-50 px-3 py-1 rounded-full">
            <Text className="text-teal-700 font-bold">{questions.length} added</Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm border border-slate-200">
            <Text className="text-lg font-bold text-slate-950 mb-3">Question</Text>
            <TextInput
              value={currentQuestion.questionText}
              onChangeText={(text) => setCurrentQuestion({ ...currentQuestion, questionText: text })}
              placeholder="Enter your question..."
              multiline
              className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-base min-h-[80px] text-slate-950"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm border border-slate-200">
            <Text className="text-lg font-bold text-slate-950 mb-1">Options</Text>
            <Text className="text-sm text-slate-500 mb-4">Tap the circle beside the correct answer.</Text>
            {currentQuestion.options.map((option, index) => (
              <View key={index} className="flex-row items-center gap-2 mb-3">
                <TouchableOpacity
                  onPress={() => setCurrentQuestion({ ...currentQuestion, correctIndex: index })}
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    currentQuestion.correctIndex === index
                      ? 'bg-green-600'
                      : 'bg-slate-200'
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
                  className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-950"
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
                <Plus size={20} color="#0f766e" />
                <Text className="text-teal-700 font-semibold">Add Option</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm border border-slate-200">
            <Text className="text-lg font-bold text-slate-950 mb-3">Feedback (Optional)</Text>
            <TextInput
              value={currentQuestion.feedback}
              onChangeText={(text) => setCurrentQuestion({ ...currentQuestion, feedback: text })}
              placeholder="Explanation for the correct answer..."
              multiline
              className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-base min-h-[80px] text-slate-950"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <TouchableOpacity
            onPress={handleAddQuestion}
            activeOpacity={0.88}
            className="bg-teal-700 py-4 rounded-xl flex-row items-center justify-center gap-2 mb-6"
          >
            <Plus size={22} color="white" />
            <Text className="text-white text-lg font-semibold">Add Question</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom buttons */}
        <View className="p-4 bg-white border-t border-slate-200 gap-3">
          {questions.length > 0 && (
            <TouchableOpacity
              onPress={() => setStep('review')}
              activeOpacity={0.88}
              className="bg-slate-950 py-4 rounded-xl flex-row items-center justify-center gap-2"
            >
              <Text className="text-white text-lg font-semibold">Review Quiz ({questions.length} questions)</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleSaveQuiz}
            disabled={questions.length === 0}
            activeOpacity={0.88}
            className={`py-4 rounded-xl flex-row items-center justify-center gap-2 ${
              questions.length > 0 ? 'bg-teal-700' : 'bg-slate-300'
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
      <View className="bg-white border-b border-slate-200 px-6 py-4 flex-row items-center">
        <TouchableOpacity onPress={() => setStep('questions')} className="mr-4 w-10 h-10 rounded-full bg-slate-100 items-center justify-center">
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-slate-950 text-xl font-bold">Review Quiz</Text>
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        <View className="bg-slate-950 p-5 rounded-2xl mb-4">
          <Text className="text-teal-200 text-sm font-semibold">Quiz Title</Text>
          <Text className="text-2xl font-bold text-white mt-2">{quizTitle}</Text>
          <Text className="text-slate-300 mt-2">{questions.length} questions</Text>
        </View>

        {questions.map((q, index) => (
          <View key={index} className="bg-white p-4 rounded-2xl mb-3 shadow-sm border border-slate-200">
            <Text className="font-bold text-slate-950 mb-2">Q{index + 1}: {q.questionText.substring(0, 70)}...</Text>
            <Text className="text-sm text-slate-500">
              Correct: {String.fromCharCode(65 + q.correctIndex)} - {q.options[q.correctIndex].substring(0, 30)}...
            </Text>
          </View>
        ))}
      </ScrollView>

      <View className="p-4 bg-white border-t border-slate-200">
        <TouchableOpacity
          onPress={handleSaveQuiz}
          activeOpacity={0.88}
          className="bg-teal-700 py-4 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Save size={22} color="white" />
          <Text className="text-white text-lg font-semibold">Save Quiz</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
