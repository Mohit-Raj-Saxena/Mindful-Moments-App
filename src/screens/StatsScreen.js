import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { getEntries } from '../utils/storage';
import { COLORS, MOODS } from '../constants';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState({
    streak: 0,
    avgMood: 0,
    total: 0,
    lastMood: null,
  });

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const data = await getEntries();
    setEntries(data);
    calculateStats(data);
  };

  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats({ streak: 0, avgMood: 0, total: 0, lastMood: null });
      return;
    }

    let streak = 0;
    const today = new Date().setHours(0, 0, 0, 0);
    let currentDate = today;
    const sortedEntries = [...data].sort((a, b) => b.timestamp - a.timestamp);

    for (let entry of sortedEntries) {
      const entryDate = new Date(entry.date).setHours(0, 0, 0, 0);
      if (entryDate === currentDate) {
        streak++;
        currentDate -= 24 * 60 * 60 * 1000;
      } else if (entryDate < currentDate) {
        break;
      }
    }

    const avgMood = (
      data.reduce((sum, e) => sum + e.mood.value, 0) / data.length
    ).toFixed(1);

    const lastMood = data[0]?.mood || null;

    setStats({
      streak,
      avgMood,
      total: data.length,
      lastMood,
    });
  };

  const getMoodDistribution = () => {
    const distribution = MOODS.map((mood) => ({
      ...mood,
      count: entries.filter((e) => e.mood.value === mood.value).length,
      percentage: entries.length
        ? Math.round(
            (entries.filter((e) => e.mood.value === mood.value).length /
              entries.length) *
              100
          )
        : 0,
    }));
    return distribution;
  };

  const moodDistribution = getMoodDistribution();

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <LinearGradient
        colors={[COLORS.midnight, COLORS.deepPurple]}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(196, 181, 253, 0.1)', 'rgba(251, 191, 36, 0.1)']}
                style={styles.statCardGradient}
              >
                <Ionicons name="flame" size={32} color={COLORS.warmPeach} />
                <Text style={styles.statValue}>{stats.streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(110, 231, 183, 0.1)', 'rgba(196, 181, 253, 0.1)']}
                style={styles.statCardGradient}
              >
                <Ionicons name="trending-up" size={32} color={COLORS.mint} />
                <Text style={styles.statValue}>{stats.avgMood}</Text>
                <Text style={styles.statLabel}>Avg Mood</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(251, 113, 133, 0.1)', 'rgba(251, 191, 36, 0.1)']}
                style={styles.statCardGradient}
              >
                <Ionicons name="calendar" size={32} color={COLORS.coral} />
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total Entries</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(196, 181, 253, 0.1)', 'rgba(110, 231, 183, 0.1)']}
                style={styles.statCardGradient}
              >
                <Text style={styles.lastMoodEmoji}>
                  {stats.lastMood?.emoji || '—'}
                </Text>
                <Text style={styles.statLabel}>Latest Mood</Text>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mood Distribution</Text>
            {moodDistribution.map((mood) => (
              <View key={mood.value} style={styles.moodRow}>
                <View style={styles.moodInfo}>
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </View>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        width: `${mood.percentage}%`,
                        backgroundColor: mood.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.percentage}>{mood.count}</Text>
              </View>
            ))}
          </View>

          <View style={styles.insightsCard}>
            <LinearGradient
              colors={['rgba(196, 181, 253, 0.1)', 'rgba(110, 231, 183, 0.1)']}
              style={styles.insightsGradient}
            >
              <Ionicons name="bulb" size={28} color={COLORS.warmPeach} />
              <Text style={styles.insightsTitle}>Your Wellness Journey</Text>
              <Text style={styles.insightsText}>
                {entries.length === 0
                  ? 'Start tracking your mood daily to see insights about your mental wellness patterns.'
                  : stats.streak > 0
                  ? `Amazing! You've been consistent for ${stats.streak} ${
                      stats.streak === 1 ? 'day' : 'days'
                    }. Keep up the great work! 🎉`
                  : 'Welcome back! Building a daily habit takes time. You\'re doing great! 💪'}
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
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
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    width: (width - 52) / 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statCardGradient: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.textLight,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
    textAlign: 'center',
  },
  lastMoodEmoji: {
    fontSize: 48,
    marginTop: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textLight,
    marginBottom: 20,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  moodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    gap: 8,
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  barContainer: {
    flex: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 14,
    opacity: 0.8,
  },
  percentage: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textLight,
    width: 40,
    textAlign: 'right',
  },
  insightsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  insightsGradient: {
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(196, 181, 253, 0.2)',
    borderRadius: 20,
  },
  insightsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textLight,
    marginTop: 12,
    marginBottom: 8,
  },
  insightsText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textMuted,
  },
  bottomPadding: {
    height: 20,
  },
});