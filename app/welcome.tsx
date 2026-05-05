import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn } from '../components/Btn';
import { Icon } from '../components/Icon';
import { Mascot } from '../components/Mascot';
import { Colors } from '../lib/colors';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scroll}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Icon name="star" size={26} color="#FFD23F" />
          </View>
          <Text style={styles.logoText}>Bolajon</Text>
        </View>
        <Text style={styles.tagline}>Превращаем дела в приключение ✨</Text>

        {/* Hero */}
        <View style={styles.hero}>
          {/* Parent silhouette */}
          <View style={styles.parentFigure}>
            <View style={styles.parentHead}>
              <View style={[styles.eye, { left: 14 }]} />
              <View style={[styles.eye, { right: 14 }]} />
              <View style={styles.smile} />
            </View>
          </View>

          {/* Mascot */}
          <View style={styles.mascotWrap}>
            <Mascot mood="wave" size={160} color={Colors.primary} />
          </View>

          <Text style={[styles.sparkle, { top: 10, left: 10 }]}>✨</Text>
          <Text style={[styles.sparkle, { top: 36, right: 12 }]}>⭐</Text>
          <Text style={[styles.sparkle, { top: 80, left: 70, fontSize: 14 }]}>✨</Text>
        </View>

        <View style={{ flex: 1 }} />

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
  container: { flex: 1, backgroundColor: '#EDE7FF' },
  scroll: { flex: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 },

  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 12 },
  logoBox: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0,
    elevation: 4,
  },
  logoText: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5, color: Colors.ink },
  tagline: { textAlign: 'center', fontSize: 15, fontWeight: '600', color: Colors.ink2, marginBottom: 20 },

  hero: { height: 240, position: 'relative', alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: 8 },
  parentFigure: {
    position: 'absolute', left: 30, bottom: 0,
    width: 130, height: 200, borderRadius: 60,
    backgroundColor: Colors.star,
    alignItems: 'center', paddingTop: 8,
  },
  parentHead: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: '#F5C49A', borderWidth: 4, borderColor: Colors.star,
    position: 'relative',
  },
  eye: { position: 'absolute', top: 28, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.ink },
  smile: { position: 'absolute', top: 44, left: 18, right: 18, height: 6, borderRadius: 4, backgroundColor: Colors.ink },
  mascotWrap: { position: 'absolute', right: 10, bottom: 0 },
  sparkle: { position: 'absolute', fontSize: 22 },

  title: { fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 6, color: Colors.ink },
  subtitle: { fontSize: 15, fontWeight: '600', color: Colors.ink2, textAlign: 'center', marginBottom: 24 },
  btn: { width: '100%', marginBottom: 14 },
  loginLink: { flexDirection: 'row', justifyContent: 'center', marginTop: 4 },
  loginLinkText: { fontSize: 14, fontWeight: '600', color: Colors.ink2 },
});
