import React from 'react';
import {
  ActivityIndicator as RNActivityIndicator,
  RefreshControl as RNRefreshControl,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableOpacity as RNTouchableOpacity,
  View as RNView
} from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const colors = {
  'white': '#ffffff',
  'slate-50': '#f8fafc',
  'slate-100': '#f1f5f9',
  'slate-200': '#e2e8f0',
  'slate-300': '#cbd5e1',
  'slate-500': '#64748b',
  'slate-600': '#475569',
  'slate-700': '#334155',
  'slate-800': '#1e293b',
  'slate-950': '#020617',
  'teal-50': '#f0fdfa',
  'teal-200': '#99f6e4',
  'teal-600': '#0d9488',
  'teal-700': '#0f766e',
  'teal-900': '#134e4a',
  'amber-50': '#fffbeb',
  'amber-100': '#fef3c7',
  'amber-200': '#fde68a',
  'amber-300': '#fcd34d',
  'amber-500': '#f59e0b',
  'amber-700': '#b45309',
  'amber-800': '#92400e',
  'amber-900': '#78350f',
  'green-50': '#f0fdf4',
  'green-200': '#bbf7d0',
  'green-300': '#86efac',
  'green-600': '#16a34a',
  'green-800': '#166534',
  'red-50': '#fef2f2',
  'red-200': '#fecaca',
  'red-600': '#dc2626',
  'red-800': '#991b1b',
  'gray-500': '#6b7280'
};

const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  11: 44,
  16: 64,
  20: 80,
  28: 112
};

const textSizes = {
  'xs': { fontSize: 12, lineHeight: 16 },
  'sm': { fontSize: 14, lineHeight: 20 },
  'base': { fontSize: 16, lineHeight: 24 },
  'lg': { fontSize: 18, lineHeight: 28 },
  'xl': { fontSize: 20, lineHeight: 28 },
  '2xl': { fontSize: 24, lineHeight: 32 },
  '3xl': { fontSize: 30, lineHeight: 36 },
  '4xl': { fontSize: 36, lineHeight: 40 }
};

const numberFromToken = (token) => {
  if (spacing[token] !== undefined) return spacing[token];
  if (token?.startsWith('[') && token.endsWith('px]')) {
    return Number(token.slice(1, -3));
  }
  return undefined;
};

export const tw = (className = '') => {
  if (!className || typeof className !== 'string') {
    return null;
  }

  return className.split(/\s+/).filter(Boolean).reduce((style, name) => {
    if (name === 'flex-1') style.flex = 1;
    else if (name === 'flex-row') style.flexDirection = 'row';
    else if (name === 'items-start') style.alignItems = 'flex-start';
    else if (name === 'items-center') style.alignItems = 'center';
    else if (name === 'justify-center') style.justifyContent = 'center';
    else if (name === 'justify-between') style.justifyContent = 'space-between';
    else if (name === 'absolute') style.position = 'absolute';
    else if (name === 'overflow-hidden') style.overflow = 'hidden';
    else if (name === 'uppercase') style.textTransform = 'uppercase';
    else if (name === 'text-center') style.textAlign = 'center';
    else if (name === 'text-right') style.textAlign = 'right';
    else if (name === 'font-medium') style.fontWeight = '500';
    else if (name === 'font-semibold') style.fontWeight = '600';
    else if (name === 'font-bold') style.fontWeight = '700';
    else if (name === 'rounded-full') style.borderRadius = 9999;
    else if (name === 'rounded-xl') style.borderRadius = 12;
    else if (name === 'rounded-2xl') style.borderRadius = 16;
    else if (name === 'border') style.borderWidth = 1;
    else if (name === 'border-b') style.borderBottomWidth = 1;
    else if (name === 'border-t') style.borderTopWidth = 1;
    else if (name === 'border-r') style.borderRightWidth = 1;
    else if (name === 'shadow-sm') {
      style.shadowColor = '#0f172a';
      style.shadowOpacity = 0.08;
      style.shadowRadius = 6;
      style.shadowOffset = { width: 0, height: 2 };
      style.elevation = 2;
    } else if (name === 'shadow-lg') {
      style.shadowColor = '#0f172a';
      style.shadowOpacity = 0.18;
      style.shadowRadius = 14;
      style.shadowOffset = { width: 0, height: 8 };
      style.elevation = 8;
    } else if (name.startsWith('bg-')) {
      style.backgroundColor = colors[name.slice(3)] || style.backgroundColor;
    } else if (name.startsWith('text-') && textSizes[name.slice(5)]) {
      Object.assign(style, textSizes[name.slice(5)]);
    } else if (name.startsWith('text-')) {
      style.color = colors[name.slice(5)] || style.color;
    } else if (name.startsWith('border-')) {
      style.borderColor = colors[name.slice(7)] || style.borderColor;
    } else if (name.startsWith('opacity-')) {
      style.opacity = Number(name.slice(8)) / 100;
    } else if (name.startsWith('leading-')) {
      style.lineHeight = numberFromToken(name.slice(8));
    } else if (name.startsWith('gap-')) {
      style.gap = numberFromToken(name.slice(4));
    } else if (name.startsWith('min-h-')) {
      style.minHeight = numberFromToken(name.slice(6));
    } else if (name.startsWith('h-')) {
      style.height = name === 'h-full' ? '100%' : numberFromToken(name.slice(2));
    } else if (name.startsWith('w-')) {
      style.width = numberFromToken(name.slice(2));
    } else if (name.startsWith('bottom-')) {
      style.bottom = numberFromToken(name.slice(7));
    } else if (name.startsWith('right-')) {
      style.right = numberFromToken(name.slice(6));
    } else if (name.startsWith('mx-')) {
      const value = numberFromToken(name.slice(3));
      style.marginHorizontal = value;
    } else if (name.startsWith('px-')) {
      const value = numberFromToken(name.slice(3));
      style.paddingHorizontal = value;
    } else if (name.startsWith('py-')) {
      const value = numberFromToken(name.slice(3));
      style.paddingVertical = value;
    } else if (name.startsWith('p-')) {
      style.padding = numberFromToken(name.slice(2));
    } else if (name.startsWith('mt-')) {
      style.marginTop = numberFromToken(name.slice(3));
    } else if (name.startsWith('mb-')) {
      style.marginBottom = numberFromToken(name.slice(3));
    } else if (name.startsWith('ml-')) {
      style.marginLeft = numberFromToken(name.slice(3));
    } else if (name.startsWith('mr-')) {
      style.marginRight = numberFromToken(name.slice(3));
    } else if (name.startsWith('pt-')) {
      style.paddingTop = numberFromToken(name.slice(3));
    } else if (name.startsWith('pb-')) {
      style.paddingBottom = numberFromToken(name.slice(3));
    }

    return style;
  }, {});
};

const styled = (Component) => {
  return React.forwardRef(({ className, style, ...props }, ref) => (
    <Component ref={ref} style={[tw(className), style]} {...props} />
  ));
};

export const View = styled(RNView);
export const Text = styled(RNText);
export const ScrollView = styled(RNScrollView);
export const TouchableOpacity = styled(RNTouchableOpacity);
export const TextInput = styled(RNTextInput);
export const SafeAreaView = styled(RNSafeAreaView);
export const ActivityIndicator = RNActivityIndicator;
export const RefreshControl = RNRefreshControl;
