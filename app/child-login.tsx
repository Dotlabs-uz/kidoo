import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AvatarCircle } from '../components/AvatarCircle';
import { Btn } from '../components/Btn';
import { Icon } from '../components/Icon';
import { Mascot } from '../components/Mascot';
import { useApp } from '../context/AppContext';
import { Colors } from '../lib/colors';
import { supabase } from '../lib/supabase';
import { Child } from '../types';

export default function ChildLoginScreen() {
  const router = useRouter();
  const { loginAsChild } = useApp();
  const [step, setStep] = useState(0);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [familyChildren, setFamilyChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  const codeStr = code.join('');

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

  const handleCodeNext = async () => {
    if (!codeFilled) return;
    setBusy(true);
    const { data: fam } = await supabase.from('families').select('id').eq('code', codeStr).maybeSingle();
    if (!fam) {
      setBusy(false);
      Alert.alert('Неверный код', 'Такой семьи не существует. Попроси родителя проверить код.');
      return;
    }
    const { data: kids } = await supabase.from('children').select('*').eq('family_id', fam.id);
    setBusy(false);
    if (!kids || kids.length === 0) {
      Alert.alert('Нет профилей', 'Родитель ещё не добавил детей. Попроси создать твой профиль.');
      return;
    }
    setFamilyChildren(kids);
    setSelectedChildId(kids[0].id);
    setStep(1);
  };

  const handleLogin = async () => {
    if (!selectedChildId) return;
    setBusy(true);
    const result = await loginAsChild(codeStr, selectedChildId);
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
        <Text style={styles.title}>Это ты?</Text>
        <Text style={styles.sub}>Выбери свой профиль</Text>

        <View style={styles.childGrid}>
          {familyChildren.map(kid => (
            <TouchableOpacity
              key={kid.id}
              onPress={() => setSelectedChildId(kid.id)}
              style={[
                styles.childCard,
                selectedChildId === kid.id && styles.childCardActive,
              ]}
            >
              <AvatarCircle id={kid.avatar} size={64} ring={selectedChildId === kid.id} />
              <Text style={[styles.childName, selectedChildId === kid.id && { color: Colors.primary }]}>
                {kid.name}
              </Text>
              {selectedChildId === kid.id && (
                <View style={styles.checkBadge}>
                  <Icon name="check" size={14} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Btn
          label="Поехали! 🚀"
          variant="success"
          loading={busy}
          disabled={!selectedChildId}
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
  childGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 32, justifyContent: 'center' },
  childCard: {
    width: 110, paddingVertical: 20, paddingHorizontal: 10,
    borderRadius: 24, borderWidth: 3, borderColor: Colors.line,
    backgroundColor: '#fff', alignItems: 'center', gap: 10, position: 'relative',
  },
  childCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySoft },
  childName: { fontSize: 15, fontWeight: '800', color: Colors.ink, textAlign: 'center' },
  checkBadge: {
    position: 'absolute', top: 8, right: 8,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
});
