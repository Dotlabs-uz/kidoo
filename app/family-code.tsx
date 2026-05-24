import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn } from '../components/Btn';
import { GradientScreen } from '../components/GradientScreen';
import { Icon } from '../components/Icon';
import { Mascot } from '../components/Mascot';
import { useApp } from '../context/AppContext';
import { CardShadow, Colors } from '../lib/colors';

export default function FamilyCodeScreen() {
  const router = useRouter();
  const { family } = useApp();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await Clipboard.setStringAsync(family.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <GradientScreen>
      <SafeAreaView style={styles.safe}>
        <View style={styles.mascotWrap}>
          <Mascot mood="cheer" size={160} />
        </View>
        <Text style={styles.title}>Семья создана! 🎉</Text>
        <Text style={styles.sub}>Покажите этот код ребёнку, чтобы он мог войти в свой режим</Text>

        <View style={styles.card}>
          <Text style={styles.codeLabel}>Семейный код</Text>
          <Text style={styles.code}>{family.code}</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={copy}>
            <Icon name="copy" size={16} color={copied ? Colors.success : Colors.ink2} />
            <Text style={[styles.copyText, copied && { color: Colors.success }]}>
              {copied ? 'Скопировано!' : 'Скопировать'}
            </Text>
          </TouchableOpacity>
        </View>

        <Btn label="Продолжить" onPress={() => router.replace('/(parent)/tasks')} style={{ width: '100%' }} />
      </SafeAreaView>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 30, alignItems: 'center' },
  mascotWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', maxHeight: 220 },
  title: { fontSize: 30, fontWeight: '900', color: '#fff', marginBottom: 10, textAlign: 'center', letterSpacing: -0.5 },
  sub: { fontSize: 15, fontWeight: '500', color: Colors.textMuted, marginBottom: 28, textAlign: 'center', lineHeight: 22 },
  card: { backgroundColor: '#fff', borderRadius: 28, padding: 28, marginBottom: 24, width: '100%', alignItems: 'center', ...CardShadow },
  codeLabel: { fontSize: 12, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  code: { fontSize: 44, fontWeight: '900', letterSpacing: 8, color: Colors.purple, marginBottom: 16 },
  copyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: 14, borderWidth: 2, borderColor: Colors.line, backgroundColor: Colors.bg,
  },
  copyText: { fontSize: 14, fontWeight: '800', color: Colors.ink2 },
});
