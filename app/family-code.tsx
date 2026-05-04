import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn } from '../components/Btn';
import { Icon } from '../components/Icon';
import { Mascot } from '../components/Mascot';
import { useApp } from '../context/AppContext';
import { Colors } from '../lib/colors';

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
    <SafeAreaView style={styles.container}>
      <View style={styles.scroll}>
        <View style={styles.mascotWrap}>
          <Mascot mood="cheer" size={140} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Семья создана! 🎉</Text>
        <Text style={styles.sub}>Покажите этот код ребёнку, чтобы он мог войти в свой режим</Text>

        <View style={styles.card}>
          <Text style={styles.codeLabel}>Семейный код</Text>
          <Text style={styles.code}>{family.code}</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={copy}>
            <Icon name="copy" size={16} color={Colors.ink2} />
            <Text style={styles.copyText}>{copied ? 'Скопировано!' : 'Скопировать'}</Text>
          </TouchableOpacity>
        </View>

        <Btn label="Продолжить" onPress={() => router.replace('/(parent)/tasks')} style={{ width: '100%' }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDE7FF' },
  scroll: { flex: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 30, alignItems: 'center' },
  mascotWrap: { marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '900', color: Colors.ink, marginBottom: 8, textAlign: 'center' },
  sub: { fontSize: 15, fontWeight: '600', color: Colors.ink2, marginBottom: 28, textAlign: 'center', lineHeight: 22 },
  card: {
    backgroundColor: '#fff', borderRadius: 28, padding: 28,
    marginBottom: 24, width: '100%', alignItems: 'center',
    borderWidth: 2, borderColor: Colors.line,
    shadowColor: Colors.line, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 0,
    elevation: 4,
  },
  codeLabel: { fontSize: 12, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  code: { fontSize: 44, fontWeight: '900', letterSpacing: 8, color: Colors.primary, marginBottom: 16 },
  copyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: 14, borderWidth: 2, borderColor: Colors.line, backgroundColor: '#fff',
  },
  copyText: { fontSize: 14, fontWeight: '800', color: Colors.ink2 },
});
