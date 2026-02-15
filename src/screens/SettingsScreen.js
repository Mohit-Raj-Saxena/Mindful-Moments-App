import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { clearAllEntries } from '../utils/storage';
import { COLORS } from '../constants';

export default function SettingsScreen() {
  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your entries. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllEntries();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data.');
            }
          },
        },
      ]
    );
  };

  const handleRateApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Rate Mindful Moments',
      'Thank you for using our app! Please rate us on your app store.',
      [{ text: 'OK' }]
    );
  };

  const handleGetHelp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Mental Health Resources',
      '🇺🇸 US: 988 Suicide & Crisis Lifeline\n\n🌍 International: findahelpline.com\n\nRemember: This app is a tool for self-awareness, not a replacement for professional care.',
      [
        { text: 'OK' },
        {
          text: 'Visit Website',
          onPress: () => Linking.openURL('https://findahelpline.com'),
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, danger }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          danger && styles.iconContainerDanger,
        ]}
      >
        <Ionicons
          name={icon}
          size={24}
          color={danger ? COLORS.coral : COLORS.softLavender}
        />
      </View>
      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, danger && styles.settingTitleDanger]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
    </TouchableOpacity>
  );

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
          <View style={styles.appInfoCard}>
            <LinearGradient
              colors={['rgba(196, 181, 253, 0.1)', 'rgba(110, 231, 183, 0.1)']}
              style={styles.appInfoGradient}
            >
              <Text style={styles.appIcon}>🧘‍♀️</Text>
              <Text style={styles.appName}>Mindful Moments</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
              <Text style={styles.appTagline}>
                Your daily mental wellness companion
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General</Text>
            
            <SettingItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="Get daily reminders to check in"
              onPress={() =>
                Alert.alert('Coming Soon', 'Notification settings will be available in the next update.')
              }
            />

            <SettingItem
              icon="color-palette-outline"
              title="Theme"
              subtitle="Customize your app appearance"
              onPress={() =>
                Alert.alert('Coming Soon', 'Theme customization will be available soon.')
              }
            />

            <SettingItem
              icon="download-outline"
              title="Export Data"
              subtitle="Download your entries as JSON"
              onPress={() =>
                Alert.alert('Coming Soon', 'Data export feature will be available soon.')
              }
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>

            <SettingItem
              icon="help-circle-outline"
              title="Get Help"
              subtitle="Crisis resources and support"
              onPress={handleGetHelp}
            />

            <SettingItem
              icon="star-outline"
              title="Rate This App"
              subtitle="Share your feedback"
              onPress={handleRateApp}
            />

            <SettingItem
              icon="information-circle-outline"
              title="About"
              subtitle="Learn more about Mindful Moments"
              onPress={() =>
                Alert.alert(
                  'About',
                  'Mindful Moments is a privacy-first mental wellness app that helps you track your mood, journal your thoughts, and practice mindfulness.\n\nAll your data is stored locally on your device for complete privacy.',
                  [{ text: 'OK' }]
                )
              }
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Management</Text>

            <SettingItem
              icon="trash-outline"
              title="Clear All Data"
              subtitle="Permanently delete all entries"
              onPress={handleClearData}
              danger
            />
          </View>

          <View style={styles.privacyCard}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.mint} />
            <Text style={styles.privacyTitle}>Privacy First</Text>
            <Text style={styles.privacyText}>
              All your data is stored locally on your device. We don't collect, share, or sync your personal information.
            </Text>
          </View>

          <Text style={styles.footer}>Made with 💜 for better mental wellness</Text>

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
  appInfoCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
  },
  appInfoGradient: {
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(196, 181, 253, 0.2)',
    borderRadius: 24,
  },
  appIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textLight,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textLight,
    marginBottom: 16,
    paddingLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(196, 181, 253, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerDanger: {
    backgroundColor: 'rgba(251, 113, 133, 0.15)',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 2,
  },
  settingTitleDanger: {
    color: COLORS.coral,
  },
  settingSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  privacyCard: {
    backgroundColor: 'rgba(110, 231, 183, 0.1)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(110, 231, 183, 0.2)',
    alignItems: 'center',
    marginBottom: 24,
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textLight,
    marginTop: 12,
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  bottomPadding: {
    height: 20,
  },
});