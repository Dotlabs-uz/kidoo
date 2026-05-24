import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn } from '../components/Btn';
import { GradientScreen } from '../components/GradientScreen';
import { Icon } from '../components/Icon';
import { useApp } from '../context/AppContext';
import { CardShadow, Colors } from '../lib/colors';

export default function ParentRegisterScreen() {
  const router = useRouter();
  const { registerParent } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !email.trim() || !password) return;
    setBusy(true);
    try {
      await registerParent(name.trim(), email.trim(), password);
      router.push('/family-code');
    } catch (err: any) {
      Alert.alert('Ошибка', err.message ?? 'Не удалось создать аккаунт');
    } finally {
      setBusy(false);
    }
  };

  return (
    <GradientScreen>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="back" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Создать семью</Text>
          <Text style={styles.sub}>Зарегистрируйтесь, чтобы добавлять задания и награды</Text>

          <View style={styles.formCard}>
            <Text style={styles.label}>Имя</Text>
            <TextInput style={styles.field} value={name} onChangeText={setName} placeholder="Ваше имя" placeholderTextColor={Colors.ink3} />

            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.field} value={email} onChangeText={setEmail} placeholder="email@example.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={Colors.ink3} />

            <Text style={styles.label}>Пароль</Text>
            <TextInput style={[styles.field, { marginBottom: 0 }]} value={password} onChangeText={setPassword} placeholder="Минимум 6 символов" secureTextEntry placeholderTextColor={Colors.ink3} />
          </View>

          <Btn
            label="Создать семью"
            loading={busy}
            disabled={!name.trim() || !email.trim() || password.length < 6}
            onPress={handleCreate}
            style={{ width: '100%', marginBottom: 16 }}
          />

          <Text style={styles.hint}>После регистрации появится семейный код для детей</Text>

          <TouchableOpacity onPress={() => router.replace('/parent-login')} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Уже есть аккаунт? </Text>
            <Text style={[styles.loginLinkText, { color: Colors.purple, fontWeight: '800' }]}>Войти</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  topBar: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 0 },
  backBtn: {
    width: 42, height: 42, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: 24, paddingBottom: 30 },
  title: { fontSize: 30, fontWeight: '900', color: '#fff', marginBottom: 8, marginTop: 20, letterSpacing: -0.5 },
  sub: { fontSize: 15, fontWeight: '500', color: Colors.textMuted, marginBottom: 24, lineHeight: 22 },

  formCard: { backgroundColor: '#fff', borderRadius: 28, padding: 20, marginBottom: 20, ...CardShadow },
  label: { fontSize: 13, fontWeight: '700', color: Colors.ink3, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 },
  field: {
    width: '100%', padding: 14, backgroundColor: Colors.bg,
    borderWidth: 1.5, borderColor: Colors.line, borderRadius: 16,
    fontSize: 16, fontWeight: '600', color: Colors.ink, marginBottom: 16,
  },

  hint: { textAlign: 'center', fontSize: 12, fontWeight: '600', color: Colors.textMuted, marginBottom: 16 },
  loginLink: { flexDirection: 'row', justifyContent: 'center' },
  loginLinkText: { fontSize: 14, fontWeight: '600', color: Colors.textMuted },
});
