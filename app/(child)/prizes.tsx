import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn } from '../../components/Btn';
import { Icon } from '../../components/Icon';
import { useApp } from '../../context/AppContext';
import { CardShadow, Colors } from '../../lib/colors';
import { Reward } from '../../types';

function RewardCard({ reward, stars, onClaim }: { reward: Reward; stars: number; onClaim: (id: string) => void }) {
  const unlocked = stars >= reward.cost;
  const pct = Math.min(100, (stars / reward.cost) * 100);

  return (
    <View style={[styles.card, unlocked && styles.cardUnlocked]}>
      <View style={styles.cardRow}>
        <View style={[styles.rewardIcon, { backgroundColor: reward.color + '33', opacity: unlocked ? 1 : 0.7 }]}>
          <Text style={{ fontSize: 32 }}>{reward.icon}</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.rewardTitle}>{reward.title}</Text>
          <View style={styles.progressMeta}>
            <Icon name="star" size={14} color="#FFC700" />
            <Text style={styles.progressText}>{Math.min(stars, reward.cost)}/{reward.cost}</Text>
          </View>
        </View>
        {unlocked ? (
          <View style={styles.unlockedBadge}>
            <Text style={styles.unlockedText}>Открыто!</Text>
          </View>
        ) : (
          <View style={styles.lockIcon}>
            <Icon name="lock" size={18} color={Colors.ink3} />
          </View>
        )}
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${pct}%` as any }]} />
      </View>

      {unlocked && (
        <Btn label="🎁 Получить приз" variant="pink" small onPress={() => onClaim(reward.id)} style={{ width: '100%', marginTop: 10 }} />
      )}
    </View>
  );
}

export default function ChildPrizesScreen() {
  const { child, rewards, claimPrize } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerCaption}>Магазин ⭐</Text>
          <Text style={styles.headerTitle}>Мои призы</Text>
        </View>
        <View style={styles.starPillBig}>
          <Text style={styles.starPillText}>⭐ {child.stars}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {rewards.map(r => (
          <RewardCard key={r.id} reward={r} stars={child.stars} onClaim={claimPrize} />
        ))}
        <View style={{ height: 8 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16,
    backgroundColor: Colors.tealDark,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerCaption: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 0.5 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  starPillBig: {
    backgroundColor: Colors.star, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999,
    ...CardShadow, shadowOpacity: 0.2, elevation: 4,
  },
  starPillText: { fontSize: 20, fontWeight: '900', color: '#5A4515' },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, backgroundColor: Colors.bg },
  card: {
    backgroundColor: '#fff', borderRadius: 24,
    borderWidth: 1, borderColor: 'rgba(124,92,255,0.07)',
    padding: 14, marginBottom: 12, ...CardShadow,
  },
  cardUnlocked: { borderColor: Colors.teal, borderWidth: 1.5 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  rewardIcon: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rewardTitle: { fontSize: 17, fontWeight: '800', color: Colors.ink, marginBottom: 4 },
  progressMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  progressText: { fontSize: 13, fontWeight: '800', color: Colors.ink2 },
  unlockedBadge: { backgroundColor: '#DFFBE9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  unlockedText: { fontSize: 10, fontWeight: '800', color: '#1A8048', textTransform: 'uppercase', letterSpacing: 0.4 },
  lockIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.line, alignItems: 'center', justifyContent: 'center' },
  progressBar: { height: 12, backgroundColor: Colors.line, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.teal, borderRadius: 999 },
});
