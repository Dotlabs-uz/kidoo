import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn } from '../../components/Btn';
import { CelebrationOverlay } from '../../components/CelebrationOverlay';
import { Icon } from '../../components/Icon';
import { ParentLockDialog } from '../../components/ParentLockDialog';
import { StarGroup } from '../../components/StarGroup';
import { useApp } from '../../context/AppContext';
import { Colors } from '../../lib/colors';
import { Task } from '../../types';

function StatCard({ num, label, color }: { num: number; label: string; color: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statNum, { color }]}>{num}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function TaskRow({ task, onApprove }: { task: Task; onApprove?: (id: string) => void }) {
  const badgeStyle = {
    pending: { bg: '#FFF1D6', text: '#A56500', label: 'Ожидает' },
    review:  { bg: '#FFE5EE', text: '#B82A6B', label: 'На проверку' },
    done:    { bg: '#DFFBE9', text: '#1A8048', label: 'Готово ✓' },
  }[task.status];

  return (
    <View style={styles.taskCard}>
      <View style={styles.taskRow}>
        <View style={[styles.taskIcon, { backgroundColor: task.color + '22' }]}>
          <Text style={{ fontSize: 22 }}>{task.icon}</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="calendar" size={12} color={Colors.ink3} />
            <Text style={styles.taskDue}>{task.due}</Text>
          </View>
        </View>
        <StarGroup count={task.stars} size={16} />
      </View>
      <View style={styles.taskFooter}>
        <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
          <Text style={[styles.badgeText, { color: badgeStyle.text }]}>{badgeStyle.label}</Text>
        </View>
        {task.status === 'review' && (
          <Btn label="Подтвердить ✓" variant="success" small onPress={() => onApprove?.(task.id)} />
        )}
      </View>
    </View>
  );
}

export default function ParentTasksScreen() {
  const router = useRouter();
  const { family, tasks, approveTask, celebration, setCelebration, showLock, setShowLock } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: '#FFD23F33' }]}>
          <Text style={{ fontSize: 22 }}>👋</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.greeting}>Привет,</Text>
          <Text style={styles.name}>{family.parent_name}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard num={tasks.filter(t => t.status === 'pending').length} label="Активных" color={Colors.primary} />
          <StatCard num={tasks.filter(t => t.status === 'review').length} label="На проверку" color={Colors.pink} />
          <StatCard num={tasks.filter(t => t.status === 'done').length} label="Готово" color={Colors.success} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Задания</Text>
          <Btn label="Новое" small onPress={() => router.push('/create-task')}>
            <Icon name="plus" size={16} color="#fff" />
          </Btn>
        </View>

        {tasks.map(t => <TaskRow key={t.id} task={t} onApprove={approveTask} />)}
        <View style={{ height: 8 }} />
      </ScrollView>

      {celebration && <CelebrationOverlay stars={celebration.stars} onDone={() => setCelebration(null)} />}
      {showLock && <ParentLockDialog onCancel={() => setShowLock(false)} onUnlock={() => { setShowLock(false); router.replace('/(child)/tasks'); }} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14,
    backgroundColor: '#fff', borderBottomWidth: 2, borderBottomColor: Colors.line,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  avatar: { width: 48, height: 48, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  greeting: { fontSize: 12, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { fontSize: 20, fontWeight: '800', color: Colors.ink },
  scroll: { padding: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderWidth: 2, borderColor: Colors.line,
    borderRadius: 18, paddingVertical: 12, alignItems: 'center',
  },
  statNum: { fontSize: 26, fontWeight: '900', lineHeight: 28 },
  statLabel: { fontSize: 10, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', marginTop: 4 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: Colors.ink },
  taskCard: {
    backgroundColor: '#fff', borderRadius: 28, borderWidth: 2, borderColor: Colors.line,
    padding: 16, marginBottom: 10, gap: 10,
  },
  taskRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  taskIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  taskTitle: { fontSize: 17, fontWeight: '800', color: Colors.ink, marginBottom: 2 },
  taskDue: { fontSize: 12, color: Colors.ink3, fontWeight: '700' },
  taskFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
});
