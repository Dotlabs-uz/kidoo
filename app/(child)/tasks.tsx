import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AvatarCircle } from '../../components/AvatarCircle';
import { Btn } from '../../components/Btn';
import { CelebrationOverlay } from '../../components/CelebrationOverlay';
import { Icon } from '../../components/Icon';
import { Mascot } from '../../components/Mascot';
import { ParentLockDialog } from '../../components/ParentLockDialog';
import { StarGroup } from '../../components/StarGroup';
import { useApp } from '../../context/AppContext';
import { CardShadow, Colors } from '../../lib/colors';
import { Task } from '../../types';

function ChildTaskCard({ task, onComplete }: { task: Task; onComplete: (id: string) => void }) {
  return (
    <View style={styles.taskCard}>
      <View style={styles.taskRow}>
        <View style={[styles.taskIcon, { backgroundColor: task.color + '22' }]}>
          <Text style={{ fontSize: 30 }}>{task.icon}</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <View style={styles.taskMeta}>
            <View style={styles.starPill}>
              <StarGroup count={task.stars} size={12} />
              <Text style={styles.starPillText}>+{task.stars}</Text>
            </View>
            <Text style={styles.taskDue}>{task.due}</Text>
          </View>
        </View>
      </View>
      <Btn label="Готово!" variant="success" onPress={() => onComplete(task.id)} style={{ width: '100%' }}>
        <Icon name="check" size={20} color="#fff" />
      </Btn>
    </View>
  );
}

export default function ChildTasksScreen() {
  const router = useRouter();
  const { child, tasks, completeChildTask, undoChildTask, celebration, setCelebration, showLock, setShowLock } = useApp();
  const pending = tasks.filter(t => t.status === 'pending' && t.child_id === child.id);
  const inReview = tasks.filter(t => t.status === 'review' && t.child_id === child.id);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <AvatarCircle id={child.avatar} size={52} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.greeting}>Привет!</Text>
            <Text style={styles.name}>{child.name} 👋</Text>
          </View>
          <TouchableOpacity onPress={() => setShowLock(true)} style={styles.switchBtn}>
            <Icon name="switch" size={20} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.starCard}>
            <Text style={{ fontSize: 28 }}>⭐</Text>
            <View>
              <Text style={styles.starCount}>{child.stars}</Text>
              <Text style={styles.starLabel}>Звёзд</Text>
            </View>
          </View>
          <View style={styles.streakCard}>
            <Text style={{ fontSize: 28 }}>🔥</Text>
            <View>
              <Text style={styles.streakCount}>{child.streak}</Text>
              <Text style={styles.streakLabel}>Дней подряд</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Сегодня</Text>
          <Text style={styles.sectionSub}>{pending.length} осталось</Text>
        </View>

        {pending.length === 0 ? (
          <View style={styles.emptyCard}>
            <Mascot mood="happy" size={120} color={Colors.primary} />
            <Text style={styles.emptyTitle}>Заданий пока нет!</Text>
            <Text style={styles.emptyText}>Пока всё чисто! 💤{'\n'}Скоро появятся новые приключения</Text>
          </View>
        ) : (
          pending.map(t => <ChildTaskCard key={t.id} task={t} onComplete={completeChildTask} />)
        )}

        {inReview.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>На проверке</Text>
              <Text style={styles.sectionSub}>{inReview.length} ждут</Text>
            </View>
            {inReview.map(t => (
              <View key={t.id} style={styles.reviewCard}>
                <View style={styles.taskRow}>
                  <View style={[styles.taskIcon, { backgroundColor: '#FFE5EE' }]}>
                    <Text style={{ fontSize: 30 }}>{t.icon}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.taskTitle}>{t.title}</Text>
                    <Text style={styles.reviewStatus}>⏳ Ждёт одобрения родителя</Text>
                  </View>
                </View>
                <Btn
                  label="Отменить"
                  variant="ghost"
                  small
                  onPress={() => undoChildTask(t.id)}
                  style={{ width: '100%' }}
                />
              </View>
            ))}
          </>
        )}

        <View style={{ height: 4 }} />
      </ScrollView>

      {celebration && <CelebrationOverlay stars={celebration.stars} onDone={() => setCelebration(null)} />}
      {showLock && <ParentLockDialog onCancel={() => setShowLock(false)} onUnlock={() => { setShowLock(false); router.replace('/(parent)/tasks'); }} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16, backgroundColor: Colors.tealDark },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  greeting: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { fontSize: 22, fontWeight: '800', color: '#fff' },
  switchBtn: {
    width: 40, height: 40, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  statsRow: { flexDirection: 'row', gap: 10 },
  starCard: {
    flex: 1, backgroundColor: Colors.star, borderRadius: 22,
    padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10,
    ...CardShadow, shadowOpacity: 0.2, elevation: 4,
  },
  starCount: { fontSize: 24, fontWeight: '900', color: '#5A4515', lineHeight: 26 },
  starLabel: { fontSize: 11, fontWeight: '800', color: '#8A6D14', textTransform: 'uppercase', letterSpacing: 0.4 },
  streakCard: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 22,
    padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  streakCount: { fontSize: 24, fontWeight: '900', color: '#fff', lineHeight: 26 },
  streakLabel: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.4 },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, backgroundColor: Colors.bg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 6 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.ink },
  sectionSub: { fontSize: 12, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.5 },
  taskCard: {
    backgroundColor: '#fff', borderRadius: 26,
    borderWidth: 1, borderColor: 'rgba(124,92,255,0.07)',
    padding: 16, marginBottom: 12, gap: 12,
    ...CardShadow,
  },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  taskIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  taskTitle: { fontSize: 17, fontWeight: '800', color: Colors.ink, marginBottom: 4 },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  starPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999,
    backgroundColor: '#FFF4D1',
  },
  starPillText: { fontSize: 12, fontWeight: '800', color: '#8A6D14' },
  taskDue: { fontSize: 12, color: Colors.ink3, fontWeight: '700' },
  emptyCard: {
    backgroundColor: '#fff', borderRadius: 28,
    borderWidth: 1, borderColor: 'rgba(124,92,255,0.07)',
    padding: 30, alignItems: 'center', ...CardShadow,
  },
  reviewCard: {
    backgroundColor: '#FFF8FA', borderRadius: 26,
    borderWidth: 1.5, borderColor: '#FFD6E7',
    padding: 16, marginBottom: 12, gap: 12, opacity: 0.9,
  },
  reviewStatus: { fontSize: 12, fontWeight: '700', color: Colors.pink, marginTop: 2 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: Colors.ink, marginBottom: 6, marginTop: 8 },
  emptyText: { fontSize: 13, fontWeight: '600', color: Colors.ink2, textAlign: 'center', lineHeight: 20 },
});
