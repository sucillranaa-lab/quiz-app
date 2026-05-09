import React from 'react';
import { View, Text, TouchableOpacity } from './ui';
import { BookOpen, Clock3, Play, RotateCcw, TrendingUp } from 'lucide-react-native';
import { getAnsweredCount, getQuizProgressPercent } from '../utils/helpers';

export default function QuizCard({ quiz, questionCount, progress, onStart, onResume, onRestart }) {
  const answeredCount = getAnsweredCount(progress?.answers || {});
  const progressPercent = getQuizProgressPercent(questionCount, progress);
  const hasProgress = Boolean(progress);

  return (
    <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm border border-slate-200">
      <View className="flex-row items-start">
        <View className="w-16 h-16 bg-teal-900 rounded-2xl items-center justify-center mr-4">
          <BookOpen size={30} color="white" />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <View className="bg-amber-100 px-2 py-1 rounded-full mr-2">
              <Text className="text-amber-800 text-xs font-bold">Practice</Text>
            </View>
            {hasProgress && (
              <Text className="text-xs font-semibold text-teal-700">In progress</Text>
            )}
          </View>
          <Text className="text-xl font-bold text-slate-950 leading-6">{quiz.title}</Text>
          <Text className="text-sm text-slate-500 mt-1">{questionCount} questions</Text>
        </View>
      </View>

      <View className="mt-5">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xs font-bold text-slate-500 uppercase">Progress</Text>
          <Text className="text-sm font-bold text-slate-800">{progressPercent}%</Text>
        </View>
        <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-teal-600 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </View>
      </View>

      <View className="flex-row mt-4 gap-4">
        <View className="flex-row items-center flex-1">
          <Clock3 size={15} color="#64748b" />
          <Text className="text-xs text-slate-500 ml-1">{answeredCount} answered</Text>
        </View>
        <View className="flex-row items-center flex-1">
          <TrendingUp size={15} color="#64748b" />
          <Text className="text-xs text-slate-500 ml-1">70% target</Text>
        </View>
      </View>

      <View className="flex-row gap-3 mt-5">
        <TouchableOpacity
          onPress={onStart}
          activeOpacity={0.88}
          className={`${hasProgress ? 'flex-1 bg-white border border-teal-700' : 'flex-1 bg-teal-700'} py-3 rounded-xl flex-row items-center justify-center gap-2`}
        >
          <Play size={18} color={hasProgress ? '#0f766e' : 'white'} />
          <Text className={`${hasProgress ? 'text-teal-700' : 'text-white'} font-semibold`}>
            Start
          </Text>
        </TouchableOpacity>

        {onResume && (
          <TouchableOpacity
            onPress={onResume}
            activeOpacity={0.88}
            className="flex-1 bg-teal-700 py-3 rounded-xl flex-row items-center justify-center gap-2"
          >
            <Play size={18} color="white" />
            <Text className="text-white font-semibold">Resume</Text>
          </TouchableOpacity>
        )}

        {onRestart && (
          <TouchableOpacity
            onPress={onRestart}
            activeOpacity={0.88}
            className="flex-1 bg-slate-100 py-3 rounded-xl flex-row items-center justify-center gap-2"
          >
            <RotateCcw size={18} color="#334155" />
            <Text className="text-slate-700 font-semibold">Restart</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
