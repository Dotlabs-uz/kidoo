import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../lib/colors';
import { Mascot } from './Mascot';

interface CelebrationOverlayProps {
  stars: number;
  onDone: () => void;
}

export function CelebrationOverlay({ stars, onDone }: CelebrationOverlayProps) {
  const scale = useRef(new Animated.Value(0.4)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.inner, { transform: [{ scale }], opacity }]}>
        <Mascot mood="cheer" size={180} color={Colors.primary} />
        <Text style={styles.title}>Молодец!</Text>
        <Text style={styles.sub}>Бола в восторге 🎉</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>+{stars} ⭐</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    backgroundColor: 'rgba(209,73,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  inner: { alignItems: 'center' },
  title: { fontSize: 36, fontWeight: '900', color: '#fff', marginTop: 16, marginBottom: 6 },
  sub: { fontSize: 18, fontWeight: '700', color: 'rgba(255,255,255,0.95)', marginBottom: 14 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.star, paddingHorizontal: 22, paddingVertical: 14,
    borderRadius: 999, shadowColor: Colors.starDark, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1, shadowRadius: 0, elevation: 6,
  },
  pillText: { fontSize: 24, fontWeight: '900', color: '#5A4515' },
});
