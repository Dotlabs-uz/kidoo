import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn } from '../components/Btn';
import { GradientScreen } from '../components/GradientScreen';
import { Mascot } from '../components/Mascot';
import { Colors } from '../lib/colors';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <GradientScreen>
      <SafeAreaView style={styles.safe}>
        {/* Logo */}
        <Text style={styles.logo}>Kidoo ⭐</Text>

        {/* Mascot */}
        <View style={styles.mascotWrap}>
          <Mascot mood="wave" size={260} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Добро пожаловать!</Text>
        <Text style={styles.subtitle}>Кто будет использовать приложение?</Text>

        {/* Buttons */}
        <View style={styles.btns}>
          <Btn
            label="👨‍👩‍👧  Я родитель"
            variant="primary"
            onPress={() => router.push('/parent-register')}
            style={styles.btn}
          />
          <Btn
            label="🧒  Я ребёнок"
            variant="orange"
            onPress={() => router.push('/child-login')}
            style={styles.btn}
          />
        </View>

        <TouchableOpacity onPress={() => router.push('/parent-login')} style={styles.loginLink}>
          <Text style={styles.loginText}>Уже есть аккаунт? </Text>
          <Text style={[styles.loginText, styles.loginBold]}>Войти</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, alignItems: 'center', paddingHorizontal: 24 },

  logo: { fontSize: 24, fontWeight: '800', color: '#fff', marginTop: 16, letterSpacing: -0.3 },

  mascotWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 240 },

  title: { fontSize: 30, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, fontWeight: '500', color: Colors.textMuted, textAlign: 'center', marginBottom: 36 },

  btns: { width: '100%', gap: 14, marginBottom: 24 },
  btn: { width: '100%' },

  loginLink: { flexDirection: 'row', marginBottom: 16 },
  loginText: { fontSize: 14, fontWeight: '600', color: Colors.textMuted },
  loginBold: { color: '#fff', fontWeight: '800' },
});
