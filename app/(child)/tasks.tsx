import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AvatarCircle } from '../../components/AvatarCircle';
import { Btn } from '../../components/Btn';
import { CelebrationOverlay } from '../../components/CelebrationOverlay';
import { GradientScreen } from '../../components/GradientScreen';
import { Icon } from '../../components/Icon';
import { Mascot } from '../../components/Mascot';
import { ParentLockDialog } from '../../components/ParentLockDialog';
import { StarGroup } from '../../components/StarGroup';
import { useApp } from '../../context/AppContext';
import { CardShadow, Colors } from '../../lib/colors';
import { Task } from '../../types';

function TaskRow({ task, onComplete }: { task: Task; onComplete: (id: string) => void }) {
  return (
    <TouchableOpacity
      style={styles.taskRow}
      onPress={() => onComplete(task.id)}
      activeOpacity={0.75}
    >
      <View style={[styles.taskIcon, { backgroundColor: task.color + '22' }]}>
        <Text style={{ fontSize: 26 }}>{task.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskDue}>{task.due}</Text>
      </View>
      <View style={styles.reward}>
        <Text style={styles.rewardText}>+{task.stars}</Text>
        <Text style={{ fontSize: 14 }}>⭐</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ChildTasksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { child, tasks, completeChildTask, undoChildTask, celebration, setCelebration, showLock, setShowLock } = useApp();
  const pending = tasks.filter(t => t.status === 'pending' && t.child_id === child.id);
  const inReview = tasks.filter(t => t.status === 'review' && t.child_id === child.id);

  return (
    <GradientScreen>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.coinPill}>
            <Text style={{ fontSize: 16 }}>⭐</Text>
            <Text style={styles.coinText}>{child.stars}</Text>
          </View>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => setShowLock(true)}>
            <AvatarCircle id={child.avatar} size={46} ring />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 110 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Tasks card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Твои задания</Text>
              <Text style={styles.cardCount}>{pending.length} осталось</Text>
            </View>

            {pending.length === 0 ? (
              <View style={styles.emptyState}>
                <Mascot mood="happy" size={100} />
                <Text style={styles.emptyTitle}>Все задания выполнены!</Text>
                <Text style={styles.emptyText}>Отличная работа 🎉</Text>
              </View>
            ) : (
              <View style={styles.taskList}>
                {pending.map(t => <TaskRow key={t.id} task={t} onComplete={completeChildTask} />)}
              </View>
            )}
          </View>

          {/* Review card */}
          {inReview.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>На проверке</Text>
                <Text style={styles.cardCount}>{inReview.length} ждут</Text>
              </View>
              <View style={styles.taskList}>
                {inReview.map(t => (
                  <View key={t.id} style={[styles.taskRow, { opacity: 0.85 }]}>
                    <View style={[styles.taskIcon, { backgroundColor: '#FEF9C3' }]}>
                      <Text style={{ fontSize: 26 }}>{t.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.taskTitle}>{t.title}</Text>
                      <Text style={[styles.taskDue, { color: Colors.orange }]}>⏳ Ждёт одобрения</Text>
                    </View>
                    <TouchableOpacity onPress={() => undoChildTask(t.id)} style={styles.undoBtn}>
                      <Text style={styles.undoBtnText}>Отмена</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Streak */}
          <View style={[styles.card, styles.streakCard]}>
            <Text style={{ fontSize: 32 }}>🔥</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.streakNum}>{child.streak} дней подряд</Text>
              <Text style={styles.streakSub}>Продолжай в том же духе!</Text>
            </View>
          </View>

          <View style={{ height: 16 }} />
        </ScrollView>
      </SafeAreaView>

      {celebration && <CelebrationOverlay stars={celebration.stars} onDone={() => setCelebration(null)} />}
      {showLock && <ParentLockDialog onCancel={() => setShowLock(false)} onUnlock={() => { setShowLock(false); router.replace('/(parent)/tasks'); }} />}
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 4 },

  coinPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
  },
  coinText: { fontSize: 17, fontWeight: '800', color: '#fff' },

  scroll: { paddingHorizontal: 20, paddingBottom: 24 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    ...CardShadow,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: Colors.ink },
  cardCount: { fontSize: 13, fontWeight: '700', color: Colors.ink3 },

  taskList: { gap: 4 },
  taskRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.line,
  },
  taskIcon: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  taskTitle: { fontSize: 16, fontWeight: '700', color: Colors.ink, marginBottom: 2 },
  taskDue: { fontSize: 12, fontWeight: '500', color: Colors.ink3 },
  reward: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  rewardText: { fontSize: 16, fontWeight: '800', color: Colors.starDark },

  emptyState: { alignItems: 'center', paddingVertical: 16, gap: 6 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: Colors.ink },
  emptyText: { fontSize: 13, fontWeight: '500', color: Colors.ink3 },

  undoBtn: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 999, backgroundColor: Colors.line,
  },
  undoBtnText: { fontSize: 12, fontWeight: '700', color: Colors.ink2 },

  streakCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  streakNum: { fontSize: 18, fontWeight: '800', color: Colors.ink },
  streakSub: { fontSize: 13, fontWeight: '500', color: Colors.ink3, marginTop: 2 },
});
