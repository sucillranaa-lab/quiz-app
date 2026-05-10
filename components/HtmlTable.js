import React from 'react';
import { View, Text } from './ui';
import { parseHtmlTable } from '../utils/helpers';

/**
 * Renders an HTML table parsed from text as native View-based components.
 * If the text contains no <table> tag, it renders as plain Text.
 */
export function HtmlTable({ rows }) {
  if (!rows || rows.length === 0) return null;

  const isHeaderStyle = (rowIndex) =>
    rowIndex === 0 ? 'bg-slate-100' : rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50';

  return (
    <View className="border border-slate-300 rounded-xl overflow-hidden mt-3 mb-1">
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          className={`flex-row ${isHeaderStyle(rowIndex)} ${rowIndex > 0 ? 'border-t border-slate-200' : ''}`}
        >
          {row.map((cell, cellIndex) => (
            <View
              key={cellIndex}
              className={`flex-1 p-2.5 ${cellIndex < row.length - 1 ? 'border-r border-slate-200' : ''}`}
            >
              <Text
                className={`text-xs leading-4 ${rowIndex === 0 ? 'font-bold text-slate-700' : 'text-slate-800'}`}
                numberOfLines={2}
              >
                {cell}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

/**
 * Renders question text, automatically converting embedded HTML tables
 * into native table views. Use this as a drop-in replacement for <Text>
 * when displaying question content.
 */
export default function RichQuestionText({ text, textClassName }) {
  const parsed = parseHtmlTable(text);

  if (!parsed) {
    return (
      <Text className={textClassName}>
        {text}
      </Text>
    );
  }

  return (
    <>
      {parsed.before && (
        <Text className={textClassName}>
          {parsed.before}
        </Text>
      )}
      {parsed.rows.length > 0 && <HtmlTable rows={parsed.rows} />}
      {parsed.after && (
        <Text className={`${textClassName || ''} mt-3`}>
          {parsed.after}
        </Text>
      )}
    </>
  );
}
