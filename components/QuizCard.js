import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from './ui';
import { BookOpen, Clock, Play, RotateCcw, Award, ChevronRight, ChevronDown, Eye } from 'lucide-react-native';
import { getAnsweredCount, getQuizProgressPercent } from '../utils/helpers';

const COLORS = [
  { bg: 'bg-blue-50', border: 'border-l-blue-500', icon: 'bg-blue-500', badge: 'bg-blue-100', badgeText: 'text-blue-700', progress: 'bg-blue-500', btn: 'bg-blue-500', btnText: 'text-white' },
  { bg: 'bg-purple-50', border: 'border-l-purple-500', icon: 'bg-purple-500', badge: 'bg-purple-100', badgeText: 'text-purple-700', progress: 'bg-purple-500', btn: 'bg-purple-500', btnText: 'text-white' },
  { bg: 'bg-teal-50', border: 'border-l-teal-500', icon: 'bg-teal-500', badge: 'bg-teal-100', badgeText: 'text-teal-700', progress: 'bg-teal-500', btn: 'bg-teal-500', btnText: 'text-white' },
  { bg: 'bg-amber-50', border: 'border-l-amber-500', icon: 'bg-amber-500', badge: 'bg-amber-100', badgeText: 'text-amber-700', progress: 'bg-amber-500', btn: 'bg-amber-500', btnText: 'text-white' },
  { bg: 'bg-indigo-50', border: 'border-l-indigo-500', icon: 'bg-indigo-500', badge: 'bg-indigo-100', badgeText: 'text-indigo-700', progress: 'bg-indigo-500', btn: 'bg-indigo-500', btnText: 'text-white' },
  { bg: 'bg-green-50', border: 'border-l-green-500', icon: 'bg-green-500', badge: 'bg-green-100', badgeText: 'text-green-700', progress: 'bg-green-500', btn: 'bg-green-500', btnText: 'text-white' },
];

function getColorScheme(title) {
  let hash = 0;
  for (let i = 0; i < (title || '').length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function QuizCard({ quiz, questionCount, progress, onStart, onResume, onRestart, isDev, onShowAll }) {
  const answeredCount = getAnsweredCount(progress?.answers || {});
  const progressPercent = getQuizProgressPercent(questionCount, progress);
  const hasProgress = Boolean(progress);
  const attemptCount = progress?.selectedCount || questionCount;
  const scheme = getColorScheme(quiz.title);
  const [showDevTools, setShowDevTools] = useState(false);

  return (
    <View className={`bg-white rounded-2xl mb-5 shadow-sm border border-slate-200 border-l-4 ${scheme.border} overflow-hidden`}>
      {/* Main content */}
      <View className="px-5 pt-5 pb-4">
        {/* Top row: icon + title + badge */}
        <View className="flex-row items-start mb-4">
          <View className={`w-12 h-12 ${scheme.icon} rounded-xl items-center justify-center mr-3.5 shadow-sm`}>
            <BookOpen size={22} color="white" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center flex-wrap gap-2 mb-1">
              <View className={`${scheme.badge} px-2.5 py-0.5 rounded-full`}>
                <Text className={`${scheme.badgeText} text-xs font-bold`}>Practice</Text>
              </View>
              {hasProgress && (
                <Text className="text-xs font-semibold text-amber-600">● In progress</Text>
              )}
            </View>
            <Text className="text-lg font-bold text-slate-900 leading-6 mt-0.5">{quiz.title}</Text>
            <Text className="text-sm text-slate-400 mt-0.5">
              {hasProgress ? `${attemptCount} question attempt` : `${questionCount} questions`}
            </Text>
          </View>
        </View>

        {/* Progress section */}
        {hasProgress && (
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-xs font-semibold text-slate-500 uppercase">Progress</Text>
              <Text className="text-sm font-bold text-slate-700">{progressPercent}%</Text>
            </View>
            <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <View
                className={`h-full ${scheme.progress} rounded-full`}
                style={{ width: `${progressPercent}%` }}
              />
            </View>
          </View>
        )}

        {/* Stats row */}
        <View className="flex-row items-center">
          <View className="flex-row items-center mr-6">
            <Clock size={14} color="#94a3b8" />
            <Text className="text-xs text-slate-400 ml-1.5">
              {hasProgress ? `${answeredCount} of ${attemptCount}` : `${questionCount} total`}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Award size={14} color="#94a3b8" />
            <Text className="text-xs text-slate-400 ml-1.5">70% to pass</Text>
          </View>
        </View>
      </View>

      {/* Bottom action bar */}
      <View className="flex-row items-center bg-slate-50 border-t border-slate-100 px-5 py-3">
        <TouchableOpacity
          onPress={onStart}
          activeOpacity={0.85}
          className={`flex-row items-center justify-center py-2.5 px-5 ${hasProgress ? 'rounded-lg border border-slate-300 mr-2' : `${scheme.btn} rounded-lg mr-2 flex-1`}`}
        >
          <Play size={16} color={hasProgress ? '#475569' : 'white'} />
          <Text className={`ml-2 text-sm font-semibold ${hasProgress ? 'text-slate-600' : scheme.btnText}`}>
            {hasProgress ? 'New Attempt' : 'Start Exam'}
          </Text>
        </TouchableOpacity>

        {onResume && (
          <TouchableOpacity
            onPress={onResume}
            activeOpacity={0.85}
            className={`flex-row items-center justify-center py-2.5 px-5 ${scheme.btn} rounded-lg mr-2 flex-1`}
          >
            <Play size={16} color="white" />
            <Text className={`ml-2 text-sm font-semibold ${scheme.btnText}`}>Resume</Text>
          </TouchableOpacity>
        )}

        {onRestart && (
          <TouchableOpacity
            onPress={onRestart}
            activeOpacity={0.85}
            className="flex-row items-center justify-center py-2.5 px-3 rounded-lg bg-white border border-slate-200"
          >
            <RotateCcw size={15} color="#64748b" />
          </TouchableOpacity>
        )}

        <View className="flex-1" />

        <ChevronRight size={18} color="#cbd5e1" />
      </View>

      {/* Dev Tools — only visible in development mode */}
      {isDev && (
        <View className="border-t border-dashed border-amber-200">
          <TouchableOpacity
            onPress={() => setShowDevTools(!showDevTools)}
            activeOpacity={0.7}
            className="flex-row items-center justify-between px-5 py-3 bg-amber-50/50"
          >
            <Text className="text-xs font-bold text-amber-700 uppercase tracking-wider">Dev Tools</Text>
            {showDevTools ? (
              <ChevronDown size={16} color="#b45309" />
            ) : (
              <ChevronRight size={16} color="#b45309" />
            )}
          </TouchableOpacity>

          {showDevTools && (
            <View className="px-5 pb-4 pt-2 bg-amber-50/30">
              <TouchableOpacity
                onPress={onShowAll}
                activeOpacity={0.85}
                className="flex-row items-center justify-center py-2.5 px-4 bg-amber-100 border border-amber-300 rounded-lg"
              >
                <Eye size={16} color="#b45309" />
                <Text className="ml-2 text-sm font-semibold text-amber-800">Show All Questions</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
