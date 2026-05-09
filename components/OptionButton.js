import React from 'react';
import { TouchableOpacity, Text, View } from './ui';
import { CheckCircle2 } from 'lucide-react-native';
import { getOptionLetter } from '../utils/helpers';

export default function OptionButton({ option, index, isSelected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      className={`p-4 rounded-2xl border flex-row items-start ${
        isSelected
          ? 'border-teal-600 bg-teal-700'
          : 'border-slate-200 bg-white'
      }`}
    >
      <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 border ${
        isSelected ? 'border-white bg-teal-600' : 'border-slate-200 bg-slate-50'
      }`}>
        <Text className={`font-bold ${isSelected ? 'text-white' : 'text-slate-700'}`}>
          {getOptionLetter(index)}
        </Text>
      </View>
      <Text className={`text-base leading-6 flex-1 ${isSelected ? 'text-white' : 'text-slate-800'}`}>
        {option}
      </Text>
      {isSelected && (
        <View className="ml-3 pt-1">
          <CheckCircle2 size={22} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
}
