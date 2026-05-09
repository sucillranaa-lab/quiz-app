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
  'black': '#000000',
  'slate-50': '#f8fafc',
  'slate-100': '#f1f5f9',
  'slate-200': '#e2e8f0',
  'slate-300': '#cbd5e1',
  'slate-400': '#94a3b8',
  'slate-500': '#64748b',
  'slate-600': '#475569',
  'slate-700': '#334155',
  'slate-800': '#1e293b',
  'slate-900': '#0f172a',
  'slate-950': '#020617',
  'gray-50': '#f9fafb',
  'gray-100': '#f3f4f6',
  'gray-200': '#e5e7eb',
  'gray-300': '#d1d5db',
  'gray-400': '#9ca3af',
  'gray-500': '#6b7280',
  'gray-600': '#4b5563',
  'gray-700': '#374151',
  'gray-800': '#1f2937',
  'gray-900': '#111827',
  'blue-50': '#eff6ff',
  'blue-100': '#dbeafe',
  'blue-200': '#bfdbfe',
  'blue-300': '#93c5fd',
  'blue-400': '#60a5fa',
  'blue-500': '#3b82f6',
  'blue-600': '#2563eb',
  'blue-700': '#1d4ed8',
  'blue-800': '#1e40af',
  'blue-900': '#1e3a8a',
  'indigo-50': '#eef2ff',
  'indigo-100': '#e0e7ff',
  'indigo-400': '#818cf8',
  'indigo-500': '#6366f1',
  'indigo-600': '#4f46e5',
  'indigo-700': '#4338ca',
  'indigo-800': '#3730a3',
  'indigo-900': '#312e81',
  'purple-50': '#faf5ff',
  'purple-100': '#f3e8ff',
  'purple-500': '#a855f7',
  'purple-600': '#9333ea',
  'purple-700': '#7e22ce',
  'purple-900': '#581c87',
  'violet-50': '#f5f3ff',
  'violet-100': '#ede9fe',
  'violet-600': '#7c3aed',
  'violet-700': '#6d28d9',
  'teal-50': '#f0fdfa',
  'teal-100': '#ccfbf1',
  'teal-200': '#99f6e4',
  'teal-500': '#14b8a6',
  'teal-600': '#0d9488',
  'teal-700': '#0f766e',
  'teal-800': '#115e59',
  'teal-900': '#134e4a',
  'amber-50': '#fffbeb',
  'amber-100': '#fef3c7',
  'amber-200': '#fde68a',
  'amber-300': '#fcd34d',
  'amber-400': '#fbbf24',
  'amber-500': '#f59e0b',
  'amber-600': '#d97706',
  'amber-700': '#b45309',
  'amber-800': '#92400e',
  'amber-900': '#78350f',
  'green-50': '#f0fdf4',
  'green-100': '#dcfce7',
  'green-200': '#bbf7d0',
  'green-300': '#86efac',
  'green-400': '#4ade80',
  'green-500': '#22c55e',
  'green-600': '#16a34a',
  'green-700': '#15803d',
  'green-800': '#166534',
  'red-50': '#fef2f2',
  'red-100': '#fee2e2',
  'red-200': '#fecaca',
  'red-400': '#f87171',
  'red-500': '#ef4444',
  'red-600': '#dc2626',
  'red-700': '#b91c1c',
  'red-800': '#991b1b',
  'orange-50': '#fff7ed',
  'orange-100': '#ffedd5',
  'orange-400': '#fb923c',
  'orange-500': '#f97316',
  'orange-600': '#ea580c',
  'orange-700': '#c2410c'
};

const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384
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
    else if (name === 'flex-col') style.flexDirection = 'column';
    else if (name === 'flex-wrap') style.flexWrap = 'wrap';
    else if (name === 'flex-nowrap') style.flexWrap = 'nowrap';
    else if (name === 'items-start') style.alignItems = 'flex-start';
    else if (name === 'items-center') style.alignItems = 'center';
    else if (name === 'items-end') style.alignItems = 'flex-end';
    else if (name === 'items-stretch') style.alignItems = 'stretch';
    else if (name === 'self-start') style.alignSelf = 'flex-start';
    else if (name === 'self-center') style.alignSelf = 'center';
    else if (name === 'self-end') style.alignSelf = 'flex-end';
    else if (name === 'self-stretch') style.alignSelf = 'stretch';
    else if (name === 'justify-center') style.justifyContent = 'center';
    else if (name === 'justify-between') style.justifyContent = 'space-between';
    else if (name === 'justify-around') style.justifyContent = 'space-around';
    else if (name === 'justify-end') style.justifyContent = 'flex-end';
    else if (name === 'absolute') style.position = 'absolute';
    else if (name === 'relative') style.position = 'relative';
    else if (name === 'overflow-hidden') style.overflow = 'hidden';
    else if (name === 'overflow-visible') style.overflow = 'visible';
    else if (name === 'uppercase') style.textTransform = 'uppercase';
    else if (name === 'text-center') style.textAlign = 'center';
    else if (name === 'text-right') style.textAlign = 'right';
    else if (name === 'font-medium') style.fontWeight = '500';
    else if (name === 'font-semibold') style.fontWeight = '600';
    else if (name === 'font-bold') style.fontWeight = '700';
    else if (name === 'rounded-sm') style.borderRadius = 2;
    else if (name === 'rounded') style.borderRadius = 4;
    else if (name === 'rounded-md') style.borderRadius = 6;
    else if (name === 'rounded-lg') style.borderRadius = 8;
    else if (name === 'rounded-xl') style.borderRadius = 12;
    else if (name === 'rounded-2xl') style.borderRadius = 16;
    else if (name === 'rounded-3xl') style.borderRadius = 24;
    else if (name === 'rounded-full') style.borderRadius = 9999;
    else if (name === 'border') style.borderWidth = 1;
    else if (name === 'border-0') style.borderWidth = 0;
    else if (name === 'border-2') style.borderWidth = 2;
    else if (name === 'border-4') style.borderWidth = 4;
    else if (name === 'border-b') style.borderBottomWidth = 1;
    else if (name === 'border-b-0') style.borderBottomWidth = 0;
    else if (name === 'border-b-2') style.borderBottomWidth = 2;
    else if (name === 'border-t') style.borderTopWidth = 1;
    else if (name === 'border-t-0') style.borderTopWidth = 0;
    else if (name === 'border-t-2') style.borderTopWidth = 2;
    else if (name === 'border-r') style.borderRightWidth = 1;
    else if (name === 'border-l-0') style.borderLeftWidth = 0;
    else if (name === 'border-l-4') style.borderLeftWidth = 4;
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
    } else if (name.startsWith('h-') && name !== 'h-full') {
      style.height = numberFromToken(name.slice(2));
    } else if (name.startsWith('w-')) {
      style.width = numberFromToken(name.slice(2));
    } else if (name === 'inset-0') {
      style.top = 0; style.bottom = 0; style.left = 0; style.right = 0;
    } else if (name === 'w-full') {
      style.width = '100%';
    } else if (name === 'h-full') {
      style.height = '100%';
    } else if (name.startsWith('top-')) {
      style.top = numberFromToken(name.slice(4));
    } else if (name.startsWith('left-')) {
      style.left = numberFromToken(name.slice(5));
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
