import React, { useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../lib/colors';
import { Btn } from './Btn';
import { Icon } from './Icon';

interface ParentLockDialogProps {
  onCancel: () => void;
  onUnlock: () => void;
}

export function ParentLockDialog({ onCancel, onUnlock }: ParentLockDialogProps) {
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(false);

  const submit = () => {
    if (pass.length >= 4) onUnlock();
    else setErr(true);
  };

  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Icon name="lock" size={30} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Только для взрослых</Text>
        <Text style={styles.sub}>Введите пароль родителя</Text>
        <TextInput
          style={[styles.input, err && { borderColor: Colors.danger }]}
          secureTextEntry
          value={pass}
          onChangeText={t => { setPass(t); setErr(false); }}
          placeholder="••••"
          keyboardType="numeric"
          maxLength={6}
          autoFocus
        />
        {err && <Text style={styles.err}>Минимум 4 цифры</Text>}
        <View style={{ height: 12 }} />
        <Btn label="Войти" onPress={submit} style={{ marginBottom: 8 }} />
        <Btn label="Отмена" variant="ghost" onPress={onCancel} small />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject, zIndex: 90,
    backgroundColor: 'rgba(26,19,48,0.6)',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 28, padding: 24, width: '100%',
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.15, shadowRadius: 20,
    elevation: 10,
  },
  iconWrap: {
    width: 60, height: 60, borderRadius: 20, backgroundColor: Colors.primarySoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: '800', color: Colors.ink, marginBottom: 6, textAlign: 'center' },
  sub: { fontSize: 14, fontWeight: '600', color: Colors.ink2, marginBottom: 18, textAlign: 'center' },
  input: {
    width: '100%', padding: 16, borderWidth: 2, borderColor: Colors.line,
    borderRadius: 18, fontSize: 22, fontWeight: '600', textAlign: 'center',
    letterSpacing: 8, color: Colors.ink, marginBottom: 8,
  },
  err: { fontSize: 12, fontWeight: '700', color: Colors.danger, marginBottom: 4 },
});
