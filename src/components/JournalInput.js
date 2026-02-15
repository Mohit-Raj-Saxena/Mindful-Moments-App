import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

export default function JournalInput({ value, onChangeText, placeholder }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Reflection</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || "What's on your mind? Express your thoughts, gratitude, or concerns..."}
        placeholderTextColor={COLORS.textMuted}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textLight,
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    color: COLORS.textLight,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 140,
  },
});