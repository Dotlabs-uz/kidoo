import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AvatarCircle } from '../../components/AvatarCircle';
import { Btn } from '../../components/Btn';
import { Icon } from '../../components/Icon';
import { ParentLockDialog } from '../../components/ParentLockDialog';
import { StarGroup } from '../../components/StarGroup';
import { useApp } from '../../context/AppContext';
import { Colors } from '../../lib/colors';
import { Task } from '../../types';

const BADGES = [
  { e: '🌟', t: 'Первое\nзадание', got: true },
  { e: '🚀', t: '5 в\nнеделю',    got: true },
  { e: '🏆', t: '10 звёзд',        got: true },
  { e: '👑', t: '50 звёзд',        got: false },
];

function ProfileStat({ icon, num, label, color, wide }: { icon: string; num: number | string; label: string; color: string; wide?: boolean }) {
  return (
    <View style={[styles.stat, wide && styles.statWide]}>
      <Text style={[styles.statIcon, wide && { marginBottom: 0 }]}>{icon}</Text>
      <View>
        <Text style={[styles.statNum, { color, fontSize: wide ? 22 : 26 }]}>{num}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

function HistoryRow({ task }: { task: Task }) {
  const isReview = task.status === 'review';
  return (
    <View style={styles.historyRow}>
      <View style={[styles.historyIcon, { backgroundColor: task.color + '22' }]}>
        <Text style={{ fontSize: 20 }}>{task.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.historyTitle}>{task.title}</Text>
        <Text style={styles.historyDue}>{task.due}</Text>
      </View>
      <View style={styles.historyRight}>
        <StarGroup count={task.stars} size={13} />
        {isReview && (
          <View style={styles.reviewBadge}>
            <Text style={styles.reviewBadgeText}>Ждёт</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function ChildProfileScreen() {
  const router = useRouter();
  const { child, tasks, showLock, setShowLock, logout } = useApp();

  const totalDone = tasks.filter(t => t.status === 'done' && t.child_id === child.id).length;
  const totalEarned = tasks.filter(t => t.status === 'done' && t.child_id === child.id).reduce((s, t) => s + t.stars, 0);
  const historyTasks = tasks.filter(t => (t.status === 'done' || t.status === 'review') && t.child_id === child.id);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <AvatarCircle id={child.avatar} size={120} ring />
          <Text style={styles.name}>{child.name}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <ProfileStat icon="⭐" num={totalEarned} label="Всего звёзд" color="#FFC700" />
          <ProfileStat icon="✓" num={totalDone}    label="Выполнено"   color={Colors.success} />
        </View>
        <View style={styles.wideStatRow}>
          <ProfileStat icon="🔥" num={`${child.streak} дней`} label="Серия побед" color="#FF6B3D" wide />
        </View>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>Значки</Text>
        <View style={styles.badgesGrid}>
          {BADGES.map((b, i) => (
            <View key={i} style={[styles.badge, !b.got && styles.badgeLocked]}>
              <Text style={[styles.badgeEmoji, !b.got && { opacity: 0.4 }]}>{b.e}</Text>
              <Text style={styles.badgeLabel}>{b.t}</Text>
            </View>
          ))}
        </View>

        {/* Task history */}
        <Text style={styles.sectionTitle}>История заданий</Text>
        {historyTasks.length === 0 ? (
          <View style={styles.emptyHistory}>
            <Text style={styles.emptyHistoryText}>Пока нет выполненных заданий</Text>
          </View>
        ) : (
          historyTasks.map(t => <HistoryRow key={t.id} task={t} />)
        )}

        <View style={{ height: 18 }} />

        <Btn label="Режим родителя" variant="ghost" onPress={() => setShowLock(true)} style={{ width: '100%', marginBottom: 12 }}>
          <Icon name="switch" size={18} color={Colors.ink2} />
        </Btn>

        <Btn label="Выйти" variant="ghost" onPress={async () => { await logout(); router.replace('/welcome'); }} style={{ width: '100%' }}>
          <Icon name="logout" size={18} color={Colors.danger} />
        </Btn>

        <View style={{ height: 8 }} />
      </ScrollView>

      {showLock && (
        <ParentLockDialog
          onCancel={() => setShowLock(false)}
          onUnlock={() => { setShowLock(false); router.replace('/(parent)/tasks'); }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },
  avatarSection: { alignItems: 'center', marginBottom: 20 },
  name: { fontSize: 28, fontWeight: '900', color: Colors.ink, marginTop: 12, marginBottom: 4 },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  wideStatRow: { marginBottom: 18 },
  stat: {
    flex: 1, backgroundColor: '#fff', borderWidth: 2, borderColor: Colors.line,
    borderRadius: 22, padding: 16,
  },
  statWide: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statIcon: { fontSize: 30, lineHeight: 34, marginBottom: 6 },
  statNum: { fontWeight: '900', lineHeight: 28 },
  statLabel: { fontSize: 10, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', marginTop: 4 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.ink, marginBottom: 10 },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 22 },
  badge: {
    width: '22%', backgroundColor: '#fff', borderWidth: 2, borderColor: Colors.star,
    borderRadius: 18, paddingVertical: 12, paddingHorizontal: 6, alignItems: 'center', gap: 4,
  },
  badgeLocked: { borderColor: Colors.line, opacity: 0.5 },
  badgeEmoji: { fontSize: 30 },
  badgeLabel: { fontSize: 10, fontWeight: '800', color: Colors.ink2, textAlign: 'center', lineHeight: 14 },

  historyRow: {
    backgroundColor: '#fff', borderRadius: 18, borderWidth: 2, borderColor: Colors.line,
    padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  historyIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  historyTitle: { fontSize: 15, fontWeight: '800', color: Colors.ink, marginBottom: 2 },
  historyDue: { fontSize: 11, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.3 },
  historyRight: { alignItems: 'flex-end', gap: 4 },
  reviewBadge: { backgroundColor: '#FFE5EE', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  reviewBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.pink, textTransform: 'uppercase', letterSpacing: 0.3 },
  emptyHistory: {
    backgroundColor: '#fff', borderRadius: 18, borderWidth: 2, borderColor: Colors.line,
    padding: 20, alignItems: 'center', marginBottom: 8,
  },
  emptyHistoryText: { fontSize: 13, fontWeight: '600', color: Colors.ink3 },
});
