import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AvatarCircle } from '../../components/AvatarCircle';
import { Icon } from '../../components/Icon';
import { StarGroup } from '../../components/StarGroup';
import { useApp } from '../../context/AppContext';
import { Colors } from '../../lib/colors';
import { Child, Task } from '../../types';

function ChildProgressCard({ child, tasks }: { child: Child; tasks: Task[] }) {
  const childTasks = tasks.filter(t => t.child_id === child.id);
  const done = childTasks.filter(t => t.status === 'done');
  const review = childTasks.filter(t => t.status === 'review');
  const pending = childTasks.filter(t => t.status === 'pending');

  return (
    <View style={styles.childSection}>
      {/* Child header */}
      <View style={styles.childHeader}>
        <AvatarCircle id={child.avatar} size={52} ring />
        <View style={{ flex: 1 }}>
          <Text style={styles.childName}>{child.name}</Text>
          <View style={styles.childMeta}>
            <Text style={styles.childMetaText}>⭐ {child.stars} звёзд</Text>
            <Text style={styles.childMetaDot}>·</Text>
            <Text style={styles.childMetaText}>🔥 {child.streak} дней</Text>
          </View>
        </View>
      </View>

      {/* Mini stats */}
      <View style={styles.miniStats}>
        <View style={[styles.miniStat, { backgroundColor: '#DFFBE9' }]}>
          <Text style={[styles.miniStatNum, { color: Colors.success }]}>{done.length}</Text>
          <Text style={styles.miniStatLabel}>Готово</Text>
        </View>
        <View style={[styles.miniStat, { backgroundColor: '#FFE5EE' }]}>
          <Text style={[styles.miniStatNum, { color: Colors.pink }]}>{review.length}</Text>
          <Text style={styles.miniStatLabel}>На проверку</Text>
        </View>
        <View style={[styles.miniStat, { backgroundColor: Colors.primarySoft }]}>
          <Text style={[styles.miniStatNum, { color: Colors.primary }]}>{pending.length}</Text>
          <Text style={styles.miniStatLabel}>Активных</Text>
        </View>
      </View>

      {/* Completed tasks */}
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

      {/* On review tasks */}
      {review.length > 0 && (
        <>
          <Text style={[styles.doneLabel, { color: Colors.pink }]}>Ждут проверки</Text>
          {review.map(t => (
            <View key={t.id} style={[styles.taskRow, { borderColor: '#FFD6E7' }]}>
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
        <View style={styles.emptyRow}>
          <Text style={styles.emptyText}>Пока нет выполненных заданий</Text>
        </View>
      )}
    </View>
  );
}

export default function ParentProgressScreen() {
  const { children, tasks } = useApp();

  const totalDone = tasks.filter(t => t.status === 'done').length;
  const totalStars = tasks.filter(t => t.status === 'done').reduce((s, t) => s + t.stars, 0);
  const totalReview = tasks.filter(t => t.status === 'review').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerCaption}>Обзор</Text>
        <Text style={styles.headerTitle}>Прогресс</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Global stats */}
        <View style={styles.globalStats}>
          <View style={styles.globalStat}>
            <Text style={[styles.globalNum, { color: Colors.success }]}>{totalDone}</Text>
            <Text style={styles.globalLabel}>Всего выполнено</Text>
          </View>
          <View style={[styles.globalStat, { borderColor: '#FFD6E7' }]}>
            <Text style={[styles.globalNum, { color: Colors.pink }]}>{totalReview}</Text>
            <Text style={styles.globalLabel}>На проверку</Text>
          </View>
          <View style={[styles.globalStat, { borderColor: Colors.starDark + '44' }]}>
            <Text style={[styles.globalNum, { color: '#8A6D14' }]}>⭐{totalStars}</Text>
            <Text style={styles.globalLabel}>Звёзд заработано</Text>
          </View>
        </View>

        {children.length === 0 ? (
          <View style={styles.emptyRow}>
            <Text style={styles.emptyText}>Добавьте детей в профиле, чтобы видеть прогресс</Text>
          </View>
        ) : (
          children.map(child => (
            <ChildProgressCard key={child.id} child={child} tasks={tasks} />
          ))
        )}

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

  globalStats: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  globalStat: {
    flex: 1, backgroundColor: '#fff', borderRadius: 20, borderWidth: 2, borderColor: Colors.line,
    paddingVertical: 14, paddingHorizontal: 10, alignItems: 'center',
  },
  globalNum: { fontSize: 22, fontWeight: '900', lineHeight: 26 },
  globalLabel: { fontSize: 9, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.3, marginTop: 4, textAlign: 'center' },

  childSection: {
    backgroundColor: '#fff', borderRadius: 28, borderWidth: 2, borderColor: Colors.line,
    padding: 16, marginBottom: 14,
  },
  childHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  childName: { fontSize: 18, fontWeight: '800', color: Colors.ink, marginBottom: 4 },
  childMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  childMetaText: { fontSize: 12, fontWeight: '700', color: Colors.ink2 },
  childMetaDot: { fontSize: 12, color: Colors.ink3 },

  miniStats: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  miniStat: { flex: 1, borderRadius: 16, paddingVertical: 10, alignItems: 'center' },
  miniStatNum: { fontSize: 22, fontWeight: '900', lineHeight: 24 },
  miniStatLabel: { fontSize: 9, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.3, marginTop: 2 },

  doneLabel: { fontSize: 12, fontWeight: '800', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8, marginTop: 4 },

  taskRow: {
    backgroundColor: Colors.bg, borderRadius: 16, borderWidth: 2, borderColor: Colors.line,
    padding: 10, marginBottom: 6, flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  checkIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#DFFBE9', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  taskTitle: { fontWeight: '700', fontSize: 14, color: Colors.ink },
  taskDue: { fontSize: 11, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.3, marginTop: 1 },

  emptyRow: {
    paddingVertical: 16, alignItems: 'center',
  },
  emptyText: { fontSize: 13, fontWeight: '600', color: Colors.ink3, textAlign: 'center' },
});
