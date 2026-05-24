import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Btn } from '../../components/Btn';
import { GradientScreen } from '../../components/GradientScreen';
import { Icon } from '../../components/Icon';
import { useApp } from '../../context/AppContext';
import { CardShadow, Colors } from '../../lib/colors';
import { Reward } from '../../types';

function RewardRow({ reward, onDelete }: { reward: Reward; onDelete: (id: string) => void }) {
  return (
    <View style={styles.rewardCard}>
      <View style={[styles.rewardIcon, { backgroundColor: reward.color + '33' }]}>
        <Text style={{ fontSize: 30 }}>{reward.icon}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.rewardTitle}>{reward.title}</Text>
        <View style={styles.costPill}>
          <Icon name="star" size={14} color="#FFC700" />
          <Text style={styles.costText}>{reward.cost} звёзд</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => onDelete(reward.id)} style={styles.deleteBtn}>
        <Icon name="trash" size={18} color={Colors.danger} />
      </TouchableOpacity>
    </View>
  );
}

export default function ParentRewardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { rewards, deleteReward } = useApp();

  return (
    <GradientScreen>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerCaption}>Магазин</Text>
            <Text style={styles.headerTitle}>Награды</Text>
          </View>
          <Btn label="Добавить" variant="ghost" small onPress={() => router.push('/add-reward')}>
            <Icon name="plus" size={16} color="#fff" />
          </Btn>
        </View>

        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 110 }]} showsVerticalScrollIndicator={false}>
          {rewards.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.emptyText}>Призов пока нет. Добавьте первый!</Text>
            </View>
          ) : (
            <View style={styles.card}>
              {rewards.map(r => <RewardRow key={r.id} reward={r} onDelete={deleteReward} />)}
            </View>
          )}
          <View style={{ height: 16 }} />
        </ScrollView>
      </SafeAreaView>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20,
  },
  headerCaption: { fontSize: 13, fontWeight: '600', color: Colors.textMuted, marginBottom: 2 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },

  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 28, padding: 20, marginBottom: 14, ...CardShadow },
  emptyText: { fontSize: 14, fontWeight: '600', color: Colors.ink3, textAlign: 'center', paddingVertical: 12 },

  rewardCard: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.line },
  rewardIcon: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rewardTitle: { fontSize: 16, fontWeight: '800', color: Colors.ink, marginBottom: 6 },
  costPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF4D1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start' },
  costText: { fontSize: 12, fontWeight: '800', color: '#8A6D14' },
  deleteBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
