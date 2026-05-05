import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AvatarCircle } from '../components/AvatarCircle';
import { Btn } from '../components/Btn';
import { Icon } from '../components/Icon';
import { StarGroup } from '../components/StarGroup';
import { useApp } from '../context/AppContext';
import { Colors } from '../lib/colors';

const ICONS = ['🧹', '📚', '🛏️', '🦷', '🐕', '🥦', '🚿', '🧺'];
const DUE_OPTIONS = ['Сегодня', 'Завтра', 'Эта неделя'];

export default function CreateTaskScreen() {
  const router = useRouter();
  const { addTask, children } = useApp();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [due, setDue] = useState('Сегодня');
  const [stars, setStars] = useState(2);
  const [icon, setIcon] = useState('🧹');
  const [childId, setChildId] = useState<string>('all');
  const [busy, setBusy] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setBusy(true);
    try {
      const base = {
        id: 't' + Date.now(),
        family_id: '',
        title: title.trim(), description: desc, due, stars, icon,
        color: Colors.primary, status: 'pending' as const,
      };

      if (childId === 'all') {
        await Promise.all(children.map((c, i) =>
          addTask({ ...base, id: 't' + Date.now() + i, child_id: c.id })
        ));
      } else {
        await addTask({ ...base, child_id: childId });
      }

      router.back();
    } catch (err: any) {
      Alert.alert('Ошибка', err.message ?? 'Не удалось создать задание');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="back" size={20} color={Colors.ink2} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Новое задание</Text>
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

        <Text style={styles.label}>Название</Text>
        <TextInput style={styles.field} value={title} onChangeText={setTitle} placeholder="Например: Убрать комнату" placeholderTextColor={Colors.ink4} />

        <Text style={styles.label}>Описание (необязательно)</Text>
        <TextInput style={[styles.field, { height: 90, textAlignVertical: 'top' }]} value={desc} onChangeText={setDesc} placeholder="Подробности задания..." multiline placeholderTextColor={Colors.ink4} />

        <Text style={styles.label}>Срок</Text>
        <View style={styles.dueRow}>
          {DUE_OPTIONS.map(d => (
            <TouchableOpacity key={d} onPress={() => setDue(d)} style={[styles.dueBtn, due === d && styles.dueBtnActive]}>
              <Text style={[styles.dueBtnText, due === d && styles.dueBtnTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Награда в звёздах</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3].map(n => (
            <TouchableOpacity key={n} onPress={() => setStars(n)} style={[styles.starBtn, stars === n && styles.starBtnActive]}>
              <StarGroup count={n} size={18} />
              <Text style={[styles.starBtnLabel, stars === n && { color: '#8A6D14' }]}>
                {n === 1 ? 'Лёгкое' : n === 2 ? 'Средне' : 'Сложно'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {children.length > 1 && (
          <>
            <Text style={styles.label}>Для кого</Text>
            <View style={styles.childRow}>
              <TouchableOpacity
                onPress={() => setChildId('all')}
                style={[styles.childBtn, childId === 'all' && styles.childBtnActive]}
              >
                <Text style={{ fontSize: 22 }}>👨‍👩‍👧</Text>
                <Text style={[styles.childBtnLabel, childId === 'all' && { color: Colors.primary }]}>Всем</Text>
              </TouchableOpacity>
              {children.map(c => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => setChildId(c.id)}
                  style={[styles.childBtn, childId === c.id && styles.childBtnActive]}
                >
                  <AvatarCircle id={c.avatar} size={40} ring={childId === c.id} />
                  <Text style={[styles.childBtnLabel, childId === c.id && { color: Colors.primary }]}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 8 }} />
        <Btn label="Создать задание" loading={busy} disabled={!title.trim()} onPress={handleSave} style={{ width: '100%' }} />
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
    fontSize: 16, fontWeight: '600', color: Colors.ink, marginBottom: 16,
  },
  iconRow: { flexDirection: 'row', gap: 8, marginBottom: 18, flexWrap: 'wrap' },
  iconBtn: {
    width: 48, height: 48, borderRadius: 14, borderWidth: 2,
    borderColor: Colors.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  iconBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySoft },
  dueRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  dueBtn: {
    flex: 1, paddingVertical: 14, borderWidth: 2, borderColor: Colors.line,
    borderRadius: 16, backgroundColor: '#fff', alignItems: 'center',
  },
  dueBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySoft },
  dueBtnText: { fontSize: 13, fontWeight: '800', color: Colors.ink2 },
  dueBtnTextActive: { color: Colors.primary },
  starsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  starBtn: {
    flex: 1, paddingVertical: 16, borderWidth: 2, borderColor: Colors.line,
    borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', gap: 6,
  },
  starBtnActive: { borderColor: '#FFC700', backgroundColor: '#FFF4D1' },
  starBtnLabel: { fontSize: 12, fontWeight: '800', color: Colors.ink3 },
  childRow: { flexDirection: 'row', gap: 10, marginBottom: 24, flexWrap: 'wrap' },
  childBtn: {
    paddingVertical: 14, paddingHorizontal: 16, borderWidth: 2, borderColor: Colors.line,
    borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', gap: 6, minWidth: 80,
  },
  childBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySoft },
  childBtnLabel: { fontSize: 12, fontWeight: '800', color: Colors.ink3 },
});
