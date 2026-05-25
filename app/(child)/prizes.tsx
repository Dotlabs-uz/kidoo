import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Btn } from '../../components/Btn';
import { GradientScreen } from '../../components/GradientScreen';
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
  const insets = useSafeAreaInsets();
  const { child, rewards, claimPrize } = useApp();

  return (
    <GradientScreen>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.pillRow}>
          <View style={styles.starPill}>
            <Text style={{ fontSize: 16 }}>⭐</Text>
            <Text style={styles.starPillText}>{child.stars}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 110 }]} showsVerticalScrollIndicator={false}>
          {rewards.map(r => (
            <RewardCard key={r.id} reward={r} stars={child.stars} onClaim={claimPrize} />
          ))}
          <View style={{ height: 16 }} />
        </ScrollView>
      </SafeAreaView>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  pillRow: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12, alignItems: 'flex-end' },
  starPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 999,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
  },
  starPillText: { fontSize: 17, fontWeight: '800', color: '#fff' },

  scroll: { paddingHorizontal: 20, paddingBottom: 24 },

  card: {
    backgroundColor: '#fff', borderRadius: 24, padding: 16, marginBottom: 12, ...CardShadow,
  },
  cardUnlocked: { borderWidth: 2, borderColor: Colors.success },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  rewardIcon: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rewardTitle: { fontSize: 17, fontWeight: '800', color: Colors.ink, marginBottom: 4 },
  progressMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  progressText: { fontSize: 13, fontWeight: '800', color: Colors.ink2 },
  unlockedBadge: { backgroundColor: '#DFFBE9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  unlockedText: { fontSize: 10, fontWeight: '800', color: '#1A8048', textTransform: 'uppercase', letterSpacing: 0.4 },
  lockIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.line, alignItems: 'center', justifyContent: 'center' },
  progressBar: { height: 10, backgroundColor: Colors.line, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.success, borderRadius: 999 },
});
