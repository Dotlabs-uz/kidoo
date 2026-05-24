import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AvatarCircle } from '../../components/AvatarCircle';
import { GradientScreen } from '../../components/GradientScreen';
import { Icon } from '../../components/Icon';
import { StarGroup } from '../../components/StarGroup';
import { useApp } from '../../context/AppContext';
import { CardShadow, Colors } from '../../lib/colors';
import { Child, Task } from '../../types';

function ChildProgressCard({ child, tasks }: { child: Child; tasks: Task[] }) {
  const childTasks = tasks.filter(t => t.child_id === child.id);
  const done = childTasks.filter(t => t.status === 'done');
  const review = childTasks.filter(t => t.status === 'review');
  const pending = childTasks.filter(t => t.status === 'pending');

  return (
    <View style={styles.childCard}>
      <View style={styles.childHeader}>
        <AvatarCircle id={child.avatar} size={52} ring />
        <View style={{ flex: 1 }}>
          <Text style={styles.childName}>{child.name}</Text>
          <View style={styles.childMeta}>
            <Text style={styles.childMetaText}>⭐ {child.stars}</Text>
            <Text style={styles.childMetaDot}>·</Text>
            <Text style={styles.childMetaText}>🔥 {child.streak} дней</Text>
          </View>
        </View>
      </View>

      <View style={styles.miniStats}>
        <View style={[styles.miniStat, { backgroundColor: '#DFFBE9' }]}>
          <Text style={[styles.miniStatNum, { color: Colors.success }]}>{done.length}</Text>
          <Text style={styles.miniStatLabel}>Готово</Text>
        </View>
        <View style={[styles.miniStat, { backgroundColor: '#FFE5EE' }]}>
          <Text style={[styles.miniStatNum, { color: Colors.pink }]}>{review.length}</Text>
          <Text style={styles.miniStatLabel}>На проверку</Text>
        </View>
        <View style={[styles.miniStat, { backgroundColor: Colors.bg }]}>
          <Text style={[styles.miniStatNum, { color: Colors.purple }]}>{pending.length}</Text>
          <Text style={styles.miniStatLabel}>Активных</Text>
        </View>
      </View>

      {done.length > 0 && (
        <>
          <Text style={styles.doneLabel}>Выполненные задания</Text>
          {done.map(t => (
            <View key={t.id} style={styles.taskRow}>
              <View style={styles.checkIcon}>
                <Icon name="check" size={14} color="#1A8048" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.taskTitle}>{t.title}</Text>
                <Text style={styles.taskDue}>{t.due}</Text>
              </View>
              <StarGroup count={t.stars} size={13} />
            </View>
          ))}
        </>
      )}

      {review.length > 0 && (
        <>
          <Text style={[styles.doneLabel, { color: Colors.pink }]}>Ждут проверки</Text>
          {review.map(t => (
            <View key={t.id} style={styles.taskRow}>
              <View style={[styles.checkIcon, { backgroundColor: '#FFE5EE' }]}>
                <Text style={{ fontSize: 14 }}>⏳</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.taskTitle}>{t.title}</Text>
                <Text style={styles.taskDue}>{t.due}</Text>
              </View>
              <StarGroup count={t.stars} size={13} />
            </View>
          ))}
        </>
      )}

      {done.length === 0 && review.length === 0 && (
        <Text style={styles.emptyText}>Пока нет выполненных заданий</Text>
      )}
    </View>
  );
}

export default function ParentProgressScreen() {
  const insets = useSafeAreaInsets();
  const { children, tasks } = useApp();
  const totalDone = tasks.filter(t => t.status === 'done').length;
  const totalStars = tasks.filter(t => t.status === 'done').reduce((s, t) => s + t.stars, 0);
  const totalReview = tasks.filter(t => t.status === 'review').length;

  return (
    <GradientScreen>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerCaption}>Обзор</Text>
          <Text style={styles.headerTitle}>Прогресс</Text>
        </View>

        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 110 }]} showsVerticalScrollIndicator={false}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={[styles.statNum, { color: Colors.success }]}>{totalDone}</Text>
              <Text style={styles.statLabel}>Выполнено</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNum, { color: Colors.pink }]}>{totalReview}</Text>
              <Text style={styles.statLabel}>На проверку</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNum, { color: Colors.starDark }]}>⭐{totalStars}</Text>
              <Text style={styles.statLabel}>Заработано</Text>
            </View>
          </View>

          {children.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.emptyText}>Добавьте детей в профиле, чтобы видеть прогресс</Text>
            </View>
          ) : (
            children.map(child => <ChildProgressCard key={child.id} child={child} tasks={tasks} />)
          )}

          <View style={{ height: 16 }} />
        </ScrollView>
      </SafeAreaView>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20 },
  headerCaption: { fontSize: 13, fontWeight: '600', color: Colors.textMuted, marginBottom: 2 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },

  scroll: { paddingHorizontal: 20, paddingBottom: 24 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 22, paddingVertical: 14, alignItems: 'center', ...CardShadow },
  statNum: { fontSize: 22, fontWeight: '900', lineHeight: 26 },
  statLabel: { fontSize: 9, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.3, marginTop: 4, textAlign: 'center' },

  card: { backgroundColor: '#fff', borderRadius: 28, padding: 20, marginBottom: 14, ...CardShadow },
  emptyText: { fontSize: 13, fontWeight: '600', color: Colors.ink3, textAlign: 'center', paddingVertical: 8 },

  childCard: { backgroundColor: '#fff', borderRadius: 28, padding: 20, marginBottom: 14, ...CardShadow },
  childHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  childName: { fontSize: 18, fontWeight: '800', color: Colors.ink, marginBottom: 4 },
  childMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  childMetaText: { fontSize: 12, fontWeight: '700', color: Colors.ink2 },
  childMetaDot: { fontSize: 12, color: Colors.ink3 },

  miniStats: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  miniStat: { flex: 1, borderRadius: 16, paddingVertical: 10, alignItems: 'center' },
  miniStatNum: { fontSize: 22, fontWeight: '900', lineHeight: 24 },
  miniStatLabel: { fontSize: 9, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.3, marginTop: 2 },

  doneLabel: { fontSize: 11, fontWeight: '800', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8, marginTop: 4 },
  taskRow: { backgroundColor: Colors.bg, borderRadius: 14, padding: 10, marginBottom: 6, flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#DFFBE9', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  taskTitle: { fontWeight: '700', fontSize: 14, color: Colors.ink },
  taskDue: { fontSize: 11, fontWeight: '600', color: Colors.ink3, marginTop: 1 },
});
