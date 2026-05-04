import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn } from '../components/Btn';
import { Icon } from '../components/Icon';
import { useApp } from '../context/AppContext';
import { Colors } from '../lib/colors';

const ICONS = ['🎁', '🍦', '🎮', '🏞️', '🎨', '🎬', '🍕', '🧸'];
const PRESETS = [5, 10, 20, 50];

export default function AddRewardScreen() {
  const router = useRouter();
  const { addReward } = useApp();
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState(10);
  const [icon, setIcon] = useState('🎁');

  const handleSave = () => {
    addReward({ id: 'r' + Date.now(), family_id: 'f1', title, cost, icon, color: Colors.pink });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="back" size={20} color={Colors.ink2} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Новый приз</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Иконка</Text>
        <View style={styles.iconRow}>
          {ICONS.map(ic => (
            <TouchableOpacity key={ic} onPress={() => setIcon(ic)} style={[styles.iconBtn, icon === ic && styles.iconBtnActive]}>
              <Text style={{ fontSize: 24 }}>{ic}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Название приза</Text>
        <TextInput style={styles.field} value={title} onChangeText={setTitle} placeholder="Например: Поход в парк" placeholderTextColor={Colors.ink4} />

        <Text style={styles.label}>Стоимость (звёзд)</Text>
        <View style={styles.costRow}>
          <TouchableOpacity onPress={() => setCost(Math.max(1, cost - 1))} style={styles.costMinus}>
            <Text style={styles.costBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.costValue}>⭐ {cost}</Text>
          <TouchableOpacity onPress={() => setCost(cost + 1)} style={styles.costPlus}>
            <Text style={styles.costBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.presetsRow}>
          {PRESETS.map(v => (
            <TouchableOpacity key={v} onPress={() => setCost(v)} style={[styles.presetBtn, cost === v && styles.presetBtnActive]}>
              <Text style={[styles.presetText, cost === v && { color: '#5A4515' }]}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 8 }} />
        <Btn label="Добавить приз" variant="pink" disabled={!title} onPress={handleSave} style={{ width: '100%' }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 4, paddingBottom: 12, gap: 8 },
  backBtn: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: '#fff',
    borderWidth: 2, borderColor: Colors.line, alignItems: 'center', justifyContent: 'center',
  },
  topTitle: { flex: 1, fontSize: 22, fontWeight: '800', textAlign: 'center', color: Colors.ink },
  scroll: { paddingHorizontal: 20, paddingBottom: 30 },
  label: { fontSize: 14, fontWeight: '700', color: Colors.ink2, marginBottom: 8 },
  field: {
    width: '100%', padding: 16, backgroundColor: '#fff',
    borderWidth: 2, borderColor: Colors.line, borderRadius: 18,
    fontSize: 16, fontWeight: '600', color: Colors.ink, marginBottom: 18,
  },
  iconRow: { flexDirection: 'row', gap: 8, marginBottom: 18, flexWrap: 'wrap' },
  iconBtn: {
    width: 48, height: 48, borderRadius: 14, borderWidth: 2,
    borderColor: Colors.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  iconBtnActive: { borderColor: Colors.pink, backgroundColor: '#FFE5EE' },
  costRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8,
    backgroundColor: '#fff', borderWidth: 2, borderColor: Colors.line, borderRadius: 18, padding: 8,
  },
  costMinus: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.line, alignItems: 'center', justifyContent: 'center' },
  costPlus: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.star, alignItems: 'center', justifyContent: 'center' },
  costBtnText: { fontSize: 22, fontWeight: '900', color: Colors.ink },
  costValue: { flex: 1, textAlign: 'center', fontSize: 28, fontWeight: '900', color: '#8A6D14' },
  presetsRow: { flexDirection: 'row', gap: 8, marginBottom: 28 },
  presetBtn: {
    flex: 1, paddingVertical: 8, borderWidth: 2, borderColor: Colors.line,
    borderRadius: 12, backgroundColor: '#fff', alignItems: 'center',
  },
  presetBtnActive: { backgroundColor: Colors.star, borderColor: Colors.star },
  presetText: { fontSize: 13, fontWeight: '800', color: Colors.ink3 },
});
