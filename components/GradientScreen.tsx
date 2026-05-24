import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../lib/colors';

interface GradientScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function GradientScreen({ children, style }: GradientScreenProps) {
  return (
    <LinearGradient
      colors={[Colors.bgTop, Colors.bgBottom]}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={[styles.root, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
