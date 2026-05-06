import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn } from '../components/Btn';
import { Icon } from '../components/Icon';
import { Mascot } from '../components/Mascot';
import { CardShadow, Colors } from '../lib/colors';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scroll}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Icon name="star" size={22} color="#FFD23F" />
          </View>
          <Text style={styles.logoText}>Kidoo</Text>
        </View>

        {/* Hero card — dark green like the app icon */}
        <View style={styles.heroCard}>
          {/* Glow circle behind mascot */}
          <View style={styles.glow} />
          <View style={styles.glowSmall} />

          <Mascot mood="wave" size={200} color={Colors.teal} />

          <Text style={styles.heroTagline}>Превращаем дела в приключение ✨</Text>

          {/* Decorative sparkles */}
          <Text style={[styles.sparkle, { top: 18, left: 20 }]}>⭐</Text>
          <Text style={[styles.sparkle, { top: 28, right: 22, fontSize: 14 }]}>✨</Text>
          <Text style={[styles.sparkle, { bottom: 48, right: 30, fontSize: 12 }]}>✨</Text>
          <Text style={[styles.sparkle, { bottom: 40, left: 26, fontSize: 18 }]}>🌿</Text>
        </View>

        <View style={{ flex: 1, minHeight: 20 }} />

        <Text style={styles.title}>Кто ты?</Text>
        <Text style={styles.subtitle}>Выбери свою роль, чтобы начать</Text>

        <Btn label="👨‍👩‍👧  Я родитель" onPress={() => router.push('/parent-register')} style={styles.btn} />
        <Btn label="🧒  Я ребёнок" variant="success" onPress={() => router.push('/child-login')} style={styles.btn} />

        <TouchableOpacity onPress={() => router.push('/parent-login')} style={styles.loginLink}>
          <Text style={styles.loginLinkText}>Уже есть аккаунт? </Text>
          <Text style={[styles.loginLinkText, { color: Colors.primary, fontWeight: '800' }]}>Войти</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },

  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 16 },
  logoBox: {
    width: 40, height: 40, borderRadius: 13, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0,
    elevation: 4,
  },
  logoText: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5, color: Colors.ink },

  heroCard: {
    backgroundColor: Colors.tealDark,
    borderRadius: 36,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 24,
    paddingTop: 20,
    minHeight: 300,
    position: 'relative',
    ...CardShadow,
    shadowOpacity: 0.22,
    shadowRadius: 30,
    elevation: 8,
  },
  glow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.teal,
    opacity: 0.12,
    top: -40,
    alignSelf: 'center',
  },
  glowSmall: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.teal,
    opacity: 0.18,
    top: 20,
    alignSelf: 'center',
  },
  heroTagline: {
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.2,
  },
  sparkle: { position: 'absolute', fontSize: 20 },

  title: { fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 6, color: Colors.ink, marginTop: 20 },
  subtitle: { fontSize: 15, fontWeight: '600', color: Colors.ink2, textAlign: 'center', marginBottom: 22 },
  btn: { width: '100%', marginBottom: 12 },
  loginLink: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  loginLinkText: { fontSize: 14, fontWeight: '600', color: Colors.ink2 },
});
