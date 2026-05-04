import * as Haptics from 'expo-haptics';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { Colors } from '../lib/colors';

type BtnVariant = 'primary' | 'success' | 'pink' | 'ghost' | 'star';

interface BtnProps extends TouchableOpacityProps {
  variant?: BtnVariant;
  label: string;
  small?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

const variantStyles: Record<BtnVariant, { bg: string; shadow: string; text: string }> = {
  primary: { bg: Colors.primary,  shadow: Colors.primaryDark, text: '#fff' },
  success: { bg: Colors.success,  shadow: Colors.successDark,  text: '#fff' },
  pink:    { bg: Colors.pink,     shadow: Colors.pinkDark,     text: '#fff' },
  ghost:   { bg: '#fff',          shadow: Colors.line,         text: Colors.ink },
  star:    { bg: Colors.star,     shadow: Colors.starDark,     text: '#5A4515' },
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
      activeOpacity={0.8}
      onPress={handlePress}
      style={[
        styles.base,
        small && styles.small,
        { backgroundColor: v.bg, shadowColor: v.shadow, borderColor: variant === 'ghost' ? Colors.line : 'transparent' },
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
    borderRadius: 18, paddingVertical: 16, paddingHorizontal: 22,
    minHeight: 58, borderWidth: 2,
    shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1, shadowRadius: 0,
    elevation: 5,
  },
  small: { paddingVertical: 10, paddingHorizontal: 16, minHeight: 42, borderRadius: 14 },
  text: { fontFamily: 'System', fontWeight: '800', fontSize: 17, letterSpacing: 0.4, textTransform: 'uppercase' },
  textSm: { fontSize: 14 },
});
