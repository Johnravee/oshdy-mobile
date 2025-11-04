import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StyleSheet, Dimensions } from 'react-native';
import { IMAGES } from '@/constants/Images.js';

const { width } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onHidden?: () => void;
  title?: string;
  tagline?: string;
};

export default function SplashScreenOverlay({ visible, onHidden, title = 'OSHDY', tagline = 'Event Catering Services' }: Props) {
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      // Pulse the logo while visible
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.05, duration: 700, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.98, duration: 700, useNativeDriver: true }),
        ])
      ).start();
    } else {
      // Fade out and notify hidden
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start(() => onHidden?.());
    }
  }, [visible]);

  // Keep mounted during fade-out; parent controls visibility lifecycle

  return (
    <Animated.View style={[styles.overlay, { opacity }] } pointerEvents="none">
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <Image source={IMAGES.oshdyLogo} style={styles.logo} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.tagline}>{tagline}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logo: {
    width: width * 0.38,
    height: width * 0.38,
    borderRadius: (width * 0.38) / 2,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2E3A8C', // brand deep blue
    letterSpacing: 1,
  },
  tagline: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
  },
});
