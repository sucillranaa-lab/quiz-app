import React from 'react';
import { View, Text } from './ui';
import OptionButton from './OptionButton';
import RichQuestionText from './HtmlTable';

export default function QuestionCard({ question, questionNumber, totalQuestions, selectedAnswer, onSelectAnswer }) {
  return (
    <View className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <View className="mb-5">
        <Text className="text-xs font-bold text-teal-700 uppercase mb-3">
          Question {questionNumber} of {totalQuestions}
        </Text>
        <RichQuestionText
          text={question.questionText}
          textClassName="text-2xl font-bold text-slate-950 leading-8"
        />
      </View>

      <View className="gap-3">
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
