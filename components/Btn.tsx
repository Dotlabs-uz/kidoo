import * as Haptics from 'expo-haptics';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { Colors } from '../lib/colors';

type BtnVariant = 'primary' | 'orange' | 'success' | 'pink' | 'ghost' | 'star' | 'blue' | 'white';

interface BtnProps extends TouchableOpacityProps {
  variant?: BtnVariant;
  label: string;
  small?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

const variantStyles: Record<BtnVariant, { bg: string; shadow: string; text: string; border?: string }> = {
  primary: { bg: Colors.purple,   shadow: Colors.purpleLight, text: '#fff' },
  orange:  { bg: Colors.orange,   shadow: Colors.orangeLight, text: '#fff' },
  success: { bg: Colors.success,  shadow: Colors.successDark, text: '#fff' },
  pink:    { bg: Colors.pink,     shadow: Colors.pinkDark,    text: '#fff' },
  star:    { bg: Colors.star,     shadow: Colors.starDark,    text: '#5A4515' },
  blue:    { bg: Colors.blue,     shadow: '#5B73E8',          text: '#fff' },
  ghost:   { bg: 'rgba(255,255,255,0.20)', shadow: 'transparent', text: '#fff', border: 'rgba(255,255,255,0.45)' },
  white:   { bg: '#fff',          shadow: '#E5E7EB',          text: Colors.ink },
};

export function Btn({ variant = 'primary', label, small, loading, disabled, style, onPress, children, ...rest }: BtnProps) {
  const v = variantStyles[variant];
  const handlePress = async (e: any) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(e);
  };
  return (
    <TouchableOpacity
      {...rest}
      disabled={disabled || loading}
      activeOpacity={0.82}
      onPress={handlePress}
      style={[
        styles.base,
        small && styles.small,
        {
          backgroundColor: v.bg,
          shadowColor: v.shadow !== 'transparent' ? v.shadow : undefined,
          borderColor: v.border ?? 'transparent',
          borderWidth: v.border ? 1.5 : 0,
        },
        (disabled || loading) && { opacity: 0.45 },
        style,
      ]}
    >
      {children}
      {loading
        ? <ActivityIndicator color={v.text} />
        : <Text style={[styles.text, small && styles.textSm, { color: v.text }]}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: 999,
    paddingVertical: 18, paddingHorizontal: 28,
    minHeight: 58,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  small: { paddingVertical: 11, paddingHorizontal: 20, minHeight: 44, borderRadius: 999 },
  text: { fontWeight: '700', fontSize: 17, letterSpacing: 0.2 },
  textSm: { fontSize: 14 },
});
