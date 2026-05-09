import React from 'react';
import { View, Text } from './ui';

export default function ProgressBar({ current, total }) {
  const percentage = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <View>
      <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-teal-600 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </View>
      <Text className="text-xs font-semibold text-slate-500 mt-2 text-right">
        {current + 1} of {total}
      </Text>
    </View>
  );
}
