import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AvatarCircle } from '../components/AvatarCircle';
import { Btn } from '../components/Btn';
import { Icon } from '../components/Icon';
import { Mascot } from '../components/Mascot';
import { useApp } from '../context/AppContext';
import { AVATARS, Colors } from '../lib/colors';
import { supabase } from '../lib/supabase';

export default function ChildLoginScreen() {
  const router = useRouter();
  const { loginAsChild } = useApp();
  const [step, setStep] = useState(0);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('fox');
  const [busy, setBusy] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  const setDigit = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...code];
    next[i] = v;
    setCode(next);
    if (v && i < 5) inputs.current[i + 1]?.focus();
  };

  const onKeyPress = (i: number, key: string) => {
    if (key === 'Backspace' && !code[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const codeFilled = code.every(c => c !== '');

  // Validate code before going to step 2
  const handleCodeNext = async () => {
    if (!codeFilled) return;
    setBusy(true);
    const { data, error } = await supabase.from('families').select('id').eq('code', code.join('')).maybeSingle();
    setBusy(false);
    if (error || !data) {
      Alert.alert('Неверный код', 'Такой семьи не существует. Попроси родителя проверить код.');
      return;
    }
    setStep(1);
  };

  const handleLogin = async () => {
    if (!name.trim()) return;
    setBusy(true);
    const result = await loginAsChild(code.join(''), name.trim(), avatar);
    setBusy(false);
    if (result.error) {
      Alert.alert('Ошибка', result.error);
    } else {
      router.replace('/(child)/tasks');
    }
  };

  if (step === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="back" size={20} color={Colors.ink2} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.mascotCenter}>
            <Mascot mood="happy" size={110} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Введи семейный код</Text>
          <Text style={styles.sub}>Спроси у мамы или папы — это 6 цифр</Text>

          <View style={styles.codeRow}>
            {code.map((d, i) => (
              <TextInput
                key={i}
                ref={el => { inputs.current[i] = el; }}
                value={d}
                onChangeText={v => setDigit(i, v)}
                onKeyPress={({ nativeEvent }) => onKeyPress(i, nativeEvent.key)}
                keyboardType="numeric"
                maxLength={1}
                style={[styles.codeInput, d ? styles.codeInputFilled : null]}
              />
            ))}
          </View>

          <Btn
            label="Дальше"
            variant="success"
            loading={busy}
            disabled={!codeFilled}
            onPress={handleCodeNext}
            style={{ width: '100%' }}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setStep(0)} style={styles.backBtn}>
          <Icon name="back" size={20} color={Colors.ink2} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Как тебя зовут?</Text>
        <Text style={styles.sub}>И выбери своего питомца!</Text>

        <TextInput
          style={[styles.field, { marginBottom: 24 }]}
          value={name}
          onChangeText={setName}
          placeholder="Твоё имя"
          placeholderTextColor={Colors.ink4}
        />

        <Text style={styles.label}>Аватар</Text>
        <View style={styles.avatarGrid}>
          {AVATARS.map(av => (
            <TouchableOpacity
              key={av.id}
              onPress={() => setAvatar(av.id)}
              style={[styles.avatarBtn, avatar === av.id && { backgroundColor: av.color + '22', borderColor: av.color }]}
            >
              <AvatarCircle id={av.id} size={52} ring={avatar === av.id} />
              <Text style={[styles.avatarName, avatar === av.id && { color: av.color }]}>{av.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Btn
          label="Поехали! 🚀"
          variant="success"
          loading={busy}
          disabled={!name.trim()}
          onPress={handleLogin}
          style={{ width: '100%' }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 4 },
  backBtn: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: '#fff',
    borderWidth: 2, borderColor: Colors.line, alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: 24, paddingBottom: 30 },
  mascotCenter: { alignItems: 'center', marginBottom: 8, marginTop: 12 },
  title: { fontSize: 28, fontWeight: '900', color: Colors.ink, marginBottom: 8, marginTop: 12, textAlign: 'center' },
  sub: { fontSize: 15, fontWeight: '600', color: Colors.ink2, marginBottom: 28, textAlign: 'center' },
  codeRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 30 },
  codeInput: {
    width: 44, height: 56, borderRadius: 16, borderWidth: 2,
    borderColor: Colors.line, backgroundColor: '#fff',
    textAlign: 'center', fontSize: 26, fontWeight: '900', color: Colors.primary,
  },
  codeInputFilled: { borderColor: Colors.primary },
  field: {
    width: '100%', padding: 16, backgroundColor: '#fff',
    borderWidth: 2, borderColor: Colors.line, borderRadius: 18,
    fontSize: 18, fontWeight: '600', color: Colors.ink,
  },
  label: { fontSize: 14, fontWeight: '700', color: Colors.ink2, marginBottom: 12 },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  avatarBtn: {
    width: '30%', padding: 14, borderRadius: 22,
    borderWidth: 3, borderColor: Colors.line, backgroundColor: '#fff',
    alignItems: 'center', gap: 6,
  },
  avatarName: { fontSize: 12, fontWeight: '800', color: Colors.ink3 },
});
