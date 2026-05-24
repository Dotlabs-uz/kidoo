import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn } from '../components/Btn';
import { GradientScreen } from '../components/GradientScreen';
import { Icon } from '../components/Icon';
import { StarGroup } from '../components/StarGroup';
import { useApp } from '../context/AppContext';
import { CardShadow, Colors } from '../lib/colors';
import { TaskRepeat } from '../types';

const ICONS = ['🧹', '📚', '🛏️', '🦷', '🐕', '🥦', '🚿', '🧺'];
const DUE_OPTIONS = ['Сегодня', 'Завтра', 'Эта неделя'];

export default function EditTaskScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, updateTask } = useApp();
  const task = tasks.find(t => t.id === id);

  const [title, setTitle] = useState(task?.title ?? '');
  const [desc, setDesc] = useState(task?.description ?? '');
  const [due, setDue] = useState(task?.due ?? 'Сегодня');
  const [stars, setStars] = useState(task?.stars ?? 2);
  const [icon, setIcon] = useState(task?.icon ?? '🧹');
  const [repeat, setRepeat] = useState<TaskRepeat>(task?.repeat ?? null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!task) router.back(); }, [task]);
  if (!task) return null;

  const handleSave = async () => {
    if (!title.trim()) return;
    setBusy(true);
    try {
      await updateTask({ ...task, title: title.trim(), description: desc, due, stars, icon, repeat });
      router.back();
    } catch (err: any) {
      Alert.alert('Ошибка', err.message ?? 'Не удалось сохранить');
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
          <Text style={styles.topTitle}>Изменить задание</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.label}>Иконка</Text>
            <View style={styles.iconRow}>
              {ICONS.map(ic => (
                <TouchableOpacity key={ic} onPress={() => setIcon(ic)} style={[styles.iconBtn, icon === ic && styles.iconBtnActive]}>
                  <Text style={{ fontSize: 24 }}>{ic}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Название</Text>
            <TextInput style={styles.field} value={title} onChangeText={setTitle} placeholder="Например: Убрать комнату" placeholderTextColor={Colors.ink3} />
            <Text style={styles.label}>Описание (необязательно)</Text>
            <TextInput style={[styles.field, { height: 80, textAlignVertical: 'top', marginBottom: 0 }]} value={desc} onChangeText={setDesc} placeholder="Подробности задания..." multiline placeholderTextColor={Colors.ink3} />
          </View>

          <View style={styles.card}>
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
            <Text style={styles.label}>Повтор</Text>
            <View style={styles.repeatRow}>
              {([null, 'daily', 'weekly'] as TaskRepeat[]).map((r) => {
                const label = r === null ? 'Без повтора' : r === 'daily' ? '🔁 Каждый день' : '📅 Раз в неделю';
                const active = repeat === r;
                return (
                  <TouchableOpacity key={String(r)} onPress={() => setRepeat(r)} style={[styles.repeatBtn, active && styles.repeatBtnActive]}>
                    <Text style={[styles.repeatBtnText, active && styles.repeatBtnTextActive]}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Btn label="Сохранить" loading={busy} disabled={!title.trim()} onPress={handleSave} style={{ width: '100%' }} />
          <View style={{ height: 16 }} />
        </ScrollView>
      </SafeAreaView>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 4, paddingBottom: 16, gap: 8 },
  backBtn: {
    width: 42, height: 42, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  topTitle: { flex: 1, fontSize: 20, fontWeight: '800', textAlign: 'center', color: '#fff' },

  scroll: { paddingHorizontal: 20, paddingBottom: 30 },
  card: { backgroundColor: '#fff', borderRadius: 28, padding: 20, marginBottom: 14, ...CardShadow },
  label: { fontSize: 13, fontWeight: '700', color: Colors.ink3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 },
  field: { width: '100%', padding: 14, backgroundColor: Colors.bg, borderWidth: 1.5, borderColor: Colors.line, borderRadius: 16, fontSize: 16, fontWeight: '600', color: Colors.ink, marginBottom: 18 },

  iconRow: { flexDirection: 'row', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  iconBtn: { width: 50, height: 50, borderRadius: 14, borderWidth: 2, borderColor: Colors.line, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  iconBtnActive: { borderColor: Colors.purple, backgroundColor: Colors.primarySoft },

  dueRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  dueBtn: { flex: 1, paddingVertical: 12, borderWidth: 2, borderColor: Colors.line, borderRadius: 14, backgroundColor: Colors.bg, alignItems: 'center' },
  dueBtnActive: { borderColor: Colors.purple, backgroundColor: Colors.primarySoft },
  dueBtnText: { fontSize: 13, fontWeight: '800', color: Colors.ink2 },
  dueBtnTextActive: { color: Colors.purple },

  starsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  starBtn: { flex: 1, paddingVertical: 14, borderWidth: 2, borderColor: Colors.line, borderRadius: 16, backgroundColor: Colors.bg, alignItems: 'center', gap: 6 },
  starBtnActive: { borderColor: '#FFC700', backgroundColor: '#FFF4D1' },
  starBtnLabel: { fontSize: 12, fontWeight: '800', color: Colors.ink3 },

  repeatRow: { flexDirection: 'column', gap: 8 },
  repeatBtn: { paddingVertical: 12, paddingHorizontal: 16, borderWidth: 2, borderColor: Colors.line, borderRadius: 14, backgroundColor: Colors.bg },
  repeatBtnActive: { borderColor: Colors.purple, backgroundColor: Colors.primarySoft },
  repeatBtnText: { fontSize: 14, fontWeight: '700', color: Colors.ink2 },
  repeatBtnTextActive: { color: Colors.purple, fontWeight: '800' },
});
