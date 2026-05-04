import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AvatarCircle } from '../../components/AvatarCircle';
import { Icon } from '../../components/Icon';
import { StarGroup } from '../../components/StarGroup';
import { useApp } from '../../context/AppContext';
import { Colors } from '../../lib/colors';

function BigStat({ num, label, color }: { num: number | string; label: string; color: string }) {
  return (
    <View style={styles.bigStat}>
      <Text style={[styles.bigStatNum, { color }]}>{num}</Text>
      <Text style={styles.bigStatLabel}>{label}</Text>
    </View>
  );
}

export default function ParentProgressScreen() {
  const { child, tasks } = useApp();
  const completed = tasks.filter(t => t.status === 'done');
  const stars = completed.reduce((s, t) => s + t.stars, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerCaption}>Прогресс</Text>
        <Text style={styles.headerTitle}>Дети</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Child card */}
        <View style={styles.childCard}>
          <AvatarCircle id={child.avatar} size={64} ring />
          <View style={{ flex: 1 }}>
            <Text style={styles.childName}>{child.name}</Text>
            <Text style={styles.childSub}>8 лет · с июня</Text>
          </View>
          <View style={styles.starPillBig}>
            <Text style={styles.starPillText}>⭐ {stars}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <BigStat num={completed.length} label="Готово на этой неделе" color={Colors.success} />
          <BigStat num={child.streak} label="Дней подряд 🔥" color={Colors.orange} />
        </View>

        <Text style={styles.sectionTitle}>Выполнено</Text>

        {completed.length === 0 && (
          <View style={[styles.taskDone, { justifyContent: 'center', paddingVertical: 28 }]}>
            <Text style={{ textAlign: 'center', color: Colors.ink3, fontWeight: '600' }}>Пока нет выполненных заданий</Text>
          </View>
        )}

        {completed.map(t => (
          <View key={t.id} style={styles.taskDone}>
            <View style={styles.checkIcon}>
              <Icon name="check" size={18} color="#1A8048" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.taskTitle}>{t.title}</Text>
              <Text style={styles.taskDue}>{t.due}</Text>
            </View>
            <StarGroup count={t.stars} size={14} />
          </View>
        ))}

        <View style={{ height: 8 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14,
    backgroundColor: '#fff', borderBottomWidth: 2, borderBottomColor: Colors.line,
  },
  headerCaption: { fontSize: 12, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.5 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.ink },
  scroll: { padding: 20 },
  childCard: {
    backgroundColor: '#fff', borderRadius: 28, borderWidth: 2, borderColor: Colors.line,
    padding: 18, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  childName: { fontSize: 17, fontWeight: '800', color: Colors.ink, marginBottom: 2 },
  childSub: { fontSize: 12, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.5 },
  starPillBig: {
    backgroundColor: Colors.star, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
    shadowColor: Colors.starDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3,
  },
  starPillText: { fontSize: 16, fontWeight: '900', color: '#5A4515' },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  bigStat: {
    flex: 1, backgroundColor: '#fff', borderRadius: 22, borderWidth: 2, borderColor: Colors.line, padding: 16,
  },
  bigStatNum: { fontSize: 32, fontWeight: '900', lineHeight: 34 },
  bigStatLabel: { fontSize: 11, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', marginTop: 6 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.ink, marginBottom: 10 },
  taskDone: {
    backgroundColor: '#fff', borderRadius: 20, borderWidth: 2, borderColor: Colors.line,
    padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  checkIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#DFFBE9', alignItems: 'center', justifyContent: 'center' },
  taskTitle: { fontWeight: '800', fontSize: 15, color: Colors.ink },
  taskDue: { fontSize: 12, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.5 },
});
