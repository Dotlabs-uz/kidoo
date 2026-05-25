import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Btn } from '../../components/Btn';
import { CelebrationOverlay } from '../../components/CelebrationOverlay';
import { GradientScreen } from '../../components/GradientScreen';
import { Icon } from '../../components/Icon';
import { ParentLockDialog } from '../../components/ParentLockDialog';
import { StarGroup } from '../../components/StarGroup';
import { useApp } from '../../context/AppContext';
import { AVATARS, CardShadow, Colors } from '../../lib/colors';
import { Child, Task } from '../../types';

function StatCard({ num, label, color }: { num: number; label: string; color: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statNum, { color }]}>{num}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function TaskRow({ task, onApprove, onEdit, onDelete }: {
  task: Task;
  onApprove?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
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
            {task.repeat && (
              <Text style={styles.repeatBadge}>{task.repeat === 'daily' ? '🔁 ежедневно' : '📅 еженедельно'}</Text>
            )}
          </View>
        </View>
        <StarGroup count={task.stars} size={16} />
      </View>
      <View style={styles.taskFooter}>
        <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
          <Text style={[styles.badgeText, { color: badgeStyle.text }]}>{badgeStyle.label}</Text>
        </View>
        <View style={styles.actions}>
          {task.status === 'review' && (
            <Btn label="Подтвердить ✓" variant="success" small onPress={() => onApprove?.(task.id)} />
          )}
          {task.status === 'pending' && (
            <>
              <TouchableOpacity onPress={() => onEdit?.(task.id)} style={styles.actionBtn}>
                <Icon name="edit" size={16} color={Colors.ink2} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete?.(task.id)} style={[styles.actionBtn, styles.actionBtnDanger]}>
                <Icon name="trash" size={16} color={Colors.danger} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

function ChildFilterBar({ children, tasks, selectedId, onSelect }: {
  children: Child[];
  tasks: Task[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  if (children.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterScroll}
      contentContainerStyle={styles.filterBar}
    >
      {children.map(kid => {
        const reviewCount = tasks.filter(t => t.child_id === kid.id && t.status === 'review').length;
        const avatarEmoji = AVATARS.find(a => a.id === kid.avatar)?.emoji ?? '🧒';
        const isActive = selectedId === kid.id;
        return (
          <TouchableOpacity
            key={kid.id}
            style={[styles.filterChip, isActive && styles.filterChipActive]}
            onPress={() => onSelect(kid.id)}
            activeOpacity={0.75}
          >
            <Text style={styles.filterChipEmoji}>{avatarEmoji}</Text>
            <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
              {kid.name}
            </Text>
            {reviewCount > 0 && (
              <View style={styles.reviewBadge}>
                <Text style={styles.reviewBadgeText}>{reviewCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export default function ParentTasksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { family, children, tasks, approveTask, deleteTask, celebration, setCelebration, showLock, setShowLock } = useApp();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(
    children.length > 0 ? children[0].id : null
  );

  const filteredTasks = selectedChildId
    ? tasks.filter(t => t.child_id === selectedChildId)
    : tasks;

  const handleDelete = (id: string) => {
    Alert.alert('Удалить задание?', 'Это действие нельзя отменить.', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: () => deleteTask(id) },
    ]);
  };

  return (
    <GradientScreen>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ChildFilterBar
          children={children}
          tasks={tasks}
          selectedId={selectedChildId}
          onSelect={setSelectedChildId}
        />

        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 110 }]} showsVerticalScrollIndicator={false}>
          <View style={styles.statsRow}>
            <StatCard num={filteredTasks.filter(t => t.status === 'pending').length} label="Активных" color={Colors.purple} />
            <StatCard num={filteredTasks.filter(t => t.status === 'review').length} label="На проверку" color={Colors.pink} />
            <StatCard num={filteredTasks.filter(t => t.status === 'done').length} label="Готово" color={Colors.success} />
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Задания</Text>
              <Btn label="Новое" small onPress={() => router.push('/create-task')}>
                <Icon name="plus" size={16} color="#fff" />
              </Btn>
            </View>

            {filteredTasks.length === 0 ? (
              <Text style={styles.emptyText}>Заданий пока нет</Text>
            ) : (
              filteredTasks.map(t => (
                <TaskRow
                  key={t.id}
                  task={t}
                  onApprove={approveTask}
                  onEdit={(id) => router.push(`/edit-task?id=${id}`)}
                  onDelete={handleDelete}
                />
              ))
            )}
          </View>

          <View style={{ height: 16 }} />
        </ScrollView>
      </SafeAreaView>

      {celebration && <CelebrationOverlay stars={celebration.stars} onDone={() => setCelebration(null)} />}
      {showLock && <ParentLockDialog onCancel={() => setShowLock(false)} onUnlock={() => { setShowLock(false); router.replace('/(child)/tasks'); }} />}
    </GradientScreen>
  );
}

const styles = StyleSheet.create({

  scroll: { paddingHorizontal: 20, paddingBottom: 24 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 22, paddingVertical: 14, alignItems: 'center', ...CardShadow },
  statNum: { fontSize: 26, fontWeight: '900', lineHeight: 28 },
  statLabel: { fontSize: 10, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', marginTop: 4 },

  card: { backgroundColor: '#fff', borderRadius: 28, padding: 20, marginBottom: 16, ...CardShadow },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.ink },
  emptyText: { fontSize: 14, fontWeight: '600', color: Colors.ink3, textAlign: 'center', paddingVertical: 12 },

  taskCard: { borderBottomWidth: 1, borderBottomColor: Colors.line, paddingVertical: 12, gap: 10 },
  taskRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  taskIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  taskTitle: { fontSize: 16, fontWeight: '800', color: Colors.ink, marginBottom: 2 },
  taskDue: { fontSize: 12, color: Colors.ink3, fontWeight: '700' },
  taskFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  repeatBadge: { fontSize: 11, fontWeight: '700', color: Colors.purple },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionBtn: { width: 34, height: 34, borderRadius: 11, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.line },
  actionBtnDanger: { backgroundColor: '#FFF0F0', borderColor: '#FFCDD2' },

  filterScroll: { height: 62, flexGrow: 0 },
  filterBar: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 14, gap: 8, alignItems: 'center' },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    height: 40, paddingHorizontal: 14, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)',
  },
  filterChipActive: {
    backgroundColor: '#fff', borderColor: '#fff',
  },
  filterChipEmoji: { fontSize: 15 },
  filterChipText: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.90)' },
  filterChipTextActive: { color: Colors.ink },
  reviewBadge: {
    minWidth: 18, height: 18, borderRadius: 999,
    backgroundColor: Colors.pink, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  reviewBadgeText: { fontSize: 10, fontWeight: '900', color: '#fff' },
});
