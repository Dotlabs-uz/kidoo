import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AvatarCircle } from '../../components/AvatarCircle';
import { Btn } from '../../components/Btn';
import { GradientScreen } from '../../components/GradientScreen';
import { Icon } from '../../components/Icon';
import { ParentLockDialog } from '../../components/ParentLockDialog';
import { StarGroup } from '../../components/StarGroup';
import { useApp } from '../../context/AppContext';
import { CardShadow, Colors } from '../../lib/colors';
import { Task } from '../../types';

function getBadges(totalDone: number, totalEarned: number) {
  return [
    { e: '🌟', t: 'Первое\nзадание', got: totalDone >= 1 },
    { e: '🚀', t: '5 заданий',       got: totalDone >= 5 },
    { e: '🏆', t: '10 звёзд',        got: totalEarned >= 10 },
    { e: '👑', t: '50 звёзд',        got: totalEarned >= 50 },
  ];
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
  const insets = useSafeAreaInsets();
  const { child, tasks, showLock, setShowLock, logout } = useApp();

  const doneTasks = tasks.filter(t => t.status === 'done' && t.child_id === child.id);
  const totalDone = doneTasks.length;
  const totalEarned = doneTasks.reduce((s, t) => s + t.stars, 0);
  const historyTasks = tasks.filter(t => (t.status === 'done' || t.status === 'review') && t.child_id === child.id);
  const badges = getBadges(totalDone, totalEarned);

  return (
    <GradientScreen>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 110 }]} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <AvatarCircle id={child.avatar} size={110} ring />
            <Text style={styles.name}>{child.name}</Text>
            <View style={styles.streakPill}>
              <Text style={styles.streakText}>🔥 {child.streak} дней подряд</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNum, { color: Colors.star }]}>⭐ {totalEarned}</Text>
                <Text style={styles.statLabel}>Всего звёзд</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNum, { color: Colors.success }]}>{totalDone}</Text>
                <Text style={styles.statLabel}>Выполнено</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Значки</Text>
            <View style={styles.badgesGrid}>
              {badges.map((b, i) => (
                <View key={i} style={[styles.badge, !b.got && styles.badgeLocked]}>
                  <Text style={[styles.badgeEmoji, !b.got && { opacity: 0.4 }]}>{b.e}</Text>
                  <Text style={styles.badgeLabel}>{b.t}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>История заданий</Text>
            {historyTasks.length === 0 ? (
              <Text style={styles.emptyText}>Пока нет выполненных заданий</Text>
            ) : (
              historyTasks.map(t => <HistoryRow key={t.id} task={t} />)
            )}
          </View>

          <View style={{ height: 8 }} />

          <Btn label="Режим родителя" variant="ghost" onPress={() => setShowLock(true)} style={{ width: '100%', marginBottom: 12 }}>
            <Icon name="switch" size={18} color="#fff" />
          </Btn>

          <Btn label="Выйти" variant="ghost" onPress={async () => { await logout(); router.replace('/welcome'); }} style={{ width: '100%' }}>
            <Icon name="logout" size={18} color="rgba(255,255,255,0.7)" />
          </Btn>

          <View style={{ height: 16 }} />
        </ScrollView>
      </SafeAreaView>

      {showLock && (
        <ParentLockDialog
          onCancel={() => setShowLock(false)}
          onUnlock={() => { setShowLock(false); router.replace('/(parent)/tasks'); }}
        />
      )}
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },

  hero: { alignItems: 'center', marginBottom: 20 },
  name: { fontSize: 28, fontWeight: '900', color: '#fff', marginTop: 14, marginBottom: 8 },
  streakPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 999,
    paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
  },
  streakText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  card: { backgroundColor: '#fff', borderRadius: 28, padding: 20, marginBottom: 14, ...CardShadow },
  cardTitle: { fontSize: 17, fontWeight: '800', color: Colors.ink, marginBottom: 14 },

  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.line },
  statNum: { fontSize: 24, fontWeight: '900', marginBottom: 4 },
  statLabel: { fontSize: 11, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.3 },

  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badge: {
    width: '22%', backgroundColor: Colors.bg,
    borderWidth: 1.5, borderColor: Colors.star,
    borderRadius: 18, paddingVertical: 12, paddingHorizontal: 6, alignItems: 'center', gap: 4,
  },
  badgeLocked: { borderColor: Colors.line, opacity: 0.5 },
  badgeEmoji: { fontSize: 28 },
  badgeLabel: { fontSize: 9, fontWeight: '800', color: Colors.ink2, textAlign: 'center', lineHeight: 13 },

  historyRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.line,
  },
  historyIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  historyTitle: { fontSize: 15, fontWeight: '700', color: Colors.ink, marginBottom: 2 },
  historyDue: { fontSize: 11, fontWeight: '600', color: Colors.ink3 },
  historyRight: { alignItems: 'flex-end', gap: 4 },
  reviewBadge: { backgroundColor: '#FFE5EE', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  reviewBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.pink },
  emptyText: { fontSize: 13, fontWeight: '600', color: Colors.ink3, textAlign: 'center', paddingVertical: 12 },
});
