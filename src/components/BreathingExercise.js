import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { BREATHING_PHASES, COLORS } from '../constants';

export default function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  const currentPhase = BREATHING_PHASES[phaseIndex];

  useEffect(() => {
    let timeout;
    if (isActive) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.4, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.4, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 4000 }),
          withTiming(0.6, { duration: 2000 }),
          withTiming(1, { duration: 4000 }),
          withTiming(0.6, { duration: 2000 })
        ),
        -1,
        false
      );

      timeout = setTimeout(() => {
        setPhaseIndex((prev) => (prev + 1) % BREATHING_PHASES.length);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, currentPhase.duration);
    } else {
      scale.value = withTiming(1, { duration: 300 });
      opacity.value = withTiming(0.6, { duration: 300 });
    }

    return () => clearTimeout(timeout);
  }, [isActive, phaseIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const toggleBreathing = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsActive(!isActive);
    if (!isActive) {
      setPhaseIndex(0);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Breathing Exercise</Text>
      <Text style={styles.subtitle}>Take a moment to center yourself</Text>

      <View style={styles.circleContainer}>
        <Animated.View style={[styles.circle, animatedStyle]}>
          <LinearGradient
            colors={['#6ee7b7', '#c4b5fd']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.phaseText}>
              {isActive ? currentPhase.text : 'Ready'}
            </Text>
          </LinearGradient>
        </Animated.View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={toggleBreathing}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#6ee7b7', '#c4b5fd']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>
            {isActive ? 'Stop Exercise' : 'Start Exercise'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(110, 231, 183, 0.08)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(110, 231, 183, 0.2)',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textLight,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 24,
  },
  circleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.midnight,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.midnight,
  },
});