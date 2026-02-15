import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { getEntries, deleteEntry } from '../utils/storage';
import { COLORS } from '../constants';

export default function HistoryScreen() {
  const [entries, setEntries] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadEntries();
    }, [])
  );

  const loadEntries = async () => {
    const data = await getEntries();
    setEntries(data);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleDeleteEntry = (entryId, date) => {
    Alert.alert(
      'Delete Entry',
      `Delete your entry from ${formatDate(date)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            const updated = await deleteEntry(entryId);
            setEntries(updated);
          },
        },
      ]
    );
  };

  const renderEntry = ({ item }) => (
    <View style={styles.entryCard}>
      <LinearGradient
        colors={['rgba(196, 181, 253, 0.05)', 'rgba(110, 231, 183, 0.05)']}
        style={styles.entryGradient}
      >
        <View style={styles.entryHeader}>
          <View style={styles.entryInfo}>
            <Text style={styles.entryDate}>{formatDate(item.date)}</Text>
            <Text style={styles.entryTime}>{formatTime(item.date)}</Text>
          </View>
          <View style={styles.entryActions}>
            <Text style={styles.entryMood}>{item.mood.emoji}</Text>
            <TouchableOpacity
              onPress={() => handleDeleteEntry(item.id, item.date)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.coral} />
            </TouchableOpacity>
          </View>
        </View>

        {item.journal && (
          <Text style={styles.entryText} numberOfLines={4}>
            {item.journal}
          </Text>
        )}

        <View style={styles.moodBadge}>
          <View
            style={[
              styles.moodIndicator,
              { backgroundColor: item.mood.color || COLORS.softLavender },
            ]}
          />
          <Text style={styles.moodLabel}>{item.mood.label}</Text>
        </View>
      </LinearGradient>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="document-text-outline"
        size={80}
        color={COLORS.textMuted}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>No Entries Yet</Text>
      <Text style={styles.emptyText}>
        Start tracking your mood daily to see your wellness journey here.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <LinearGradient
        colors={[COLORS.midnight, COLORS.deepPurple]}
        style={styles.gradient}
      >
        <FlatList
          data={entries}
          renderItem={renderEntry}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
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
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  entryCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  entryGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryDate: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textLight,
    marginBottom: 4,
  },
  entryTime: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  entryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  entryMood: {
    fontSize: 32,
  },
  entryText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textLight,
    opacity: 0.9,
    marginBottom: 12,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  moodIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  moodLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    opacity: 0.3,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textLight,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
});