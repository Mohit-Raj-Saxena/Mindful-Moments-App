import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import MoodSelector from '../components/MoodSelector';
import JournalInput from '../components/JournalInput';
import BreathingExercise from '../components/BreathingExercise';
import { saveEntry } from '../utils/storage';
import { COLORS } from '../constants';

export default function TodayScreen() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalText, setJournalText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveEntry = async () => {
    if (!selectedMood) {
      Alert.alert('Mood Required', 'Please select how you\'re feeling today.');
      return;
    }

    try {
      setIsSaving(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const entry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        mood: selectedMood,
        journal: journalText.trim(),
        timestamp: Date.now(),
      };

      await saveEntry(entry);

      Alert.alert(
        'Entry Saved! 🎉',
        'Your daily reflection has been recorded.',
        [{ text: 'OK' }]
      );

      setSelectedMood(null);
      setJournalText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient
        colors={[COLORS.midnight, COLORS.deepPurple]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Mindful Moments</Text>
              <Text style={styles.headerSubtitle}>
                Your daily mental wellness companion
              </Text>
              <View style={styles.dateCard}>
                <Ionicons name="calendar" size={18} color={COLORS.softLavender} />
                <Text style={styles.dateText}>{formatDate()}</Text>
              </View>
            </View>

            <MoodSelector
              selectedMood={selectedMood}
              onMoodSelect={setSelectedMood}
            />

            <JournalInput value={journalText} onChangeText={setJournalText} />

            <TouchableOpacity
              style={[styles.saveButton, !selectedMood && styles.saveButtonDisabled]}
              onPress={handleSaveEntry}
              disabled={!selectedMood || isSaving}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  selectedMood
                    ? [COLORS.softLavender, COLORS.warmPeach]
                    : ['rgba(148, 163, 184, 0.5)', 'rgba(148, 163, 184, 0.5)']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButtonGradient}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={selectedMood ? COLORS.midnight : COLORS.textMuted}
                />
                <Text
                  style={[
                    styles.saveButtonText,
                    !selectedMood && styles.saveButtonTextDisabled,
                  ]}
                >
                  {isSaving ? 'Saving...' : 'Save Today\'s Entry'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <BreathingExercise />

            <View style={styles.bottomPadding} />
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.midnight,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '700',
    fontStyle: 'italic',
    color: COLORS.softLavender,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(196, 181, 253, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(196, 181, 253, 0.2)',
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
    elevation: 8,
    shadowColor: COLORS.softLavender,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  saveButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  saveButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.midnight,
  },
  saveButtonTextDisabled: {
    color: COLORS.textMuted,
  },
  bottomPadding: {
    height: 20,
  },
});