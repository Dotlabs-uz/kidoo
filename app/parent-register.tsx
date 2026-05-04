import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn } from '../components/Btn';
import { Icon } from '../components/Icon';
import { useApp } from '../context/AppContext';
import { Colors } from '../lib/colors';

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="back" size={20} color={Colors.ink2} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Создать семью</Text>
        <Text style={styles.sub}>Зарегистрируйтесь, чтобы добавлять задания и награды</Text>

        <Text style={styles.label}>Имя</Text>
        <TextInput
          style={styles.field}
          value={name}
          onChangeText={setName}
          placeholder="Ваше имя"
          placeholderTextColor={Colors.ink4}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.field}
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={Colors.ink4}
        />

        <Text style={styles.label}>Пароль</Text>
        <TextInput
          style={styles.field}
          value={password}
          onChangeText={setPassword}
          placeholder="Минимум 6 символов"
          secureTextEntry
          placeholderTextColor={Colors.ink4}
        />

        <View style={{ height: 28 }} />
        <Btn
          label="Создать семью"
          loading={busy}
          disabled={!name.trim() || !email.trim() || password.length < 6}
          onPress={handleCreate}
          style={{ width: '100%' }}
        />

        <Text style={styles.hint}>После регистрации появится семейный код для детей</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 0 },
  backBtn: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: '#fff',
    borderWidth: 2, borderColor: Colors.line,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: 24, paddingBottom: 30 },
  title: { fontSize: 28, fontWeight: '900', color: Colors.ink, marginBottom: 6, marginTop: 20 },
  sub: { fontSize: 15, fontWeight: '600', color: Colors.ink2, marginBottom: 24, lineHeight: 22 },
  label: { fontSize: 14, fontWeight: '700', color: Colors.ink2, marginBottom: 8 },
  field: {
    width: '100%', padding: 16, backgroundColor: '#fff',
    borderWidth: 2, borderColor: Colors.line, borderRadius: 18,
    fontSize: 16, fontWeight: '600', color: Colors.ink, marginBottom: 16,
  },
  hint: { textAlign: 'center', fontSize: 12, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 18 },
});
