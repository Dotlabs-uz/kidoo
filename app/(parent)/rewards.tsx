import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn } from '../../components/Btn';
import { Icon } from '../../components/Icon';
import { useApp } from '../../context/AppContext';
import { CardShadow, Colors } from '../../lib/colors';
import { Reward } from '../../types';

function RewardRow({ reward, onDelete }: { reward: Reward; onDelete: (id: string) => void }) {
  return (
    <View style={styles.card}>
      <View style={[styles.rewardIcon, { backgroundColor: reward.color + '33' }]}>
        <Text style={{ fontSize: 30 }}>{reward.icon}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.rewardTitle}>{reward.title}</Text>
        <View style={styles.pill}>
          <Icon name="star" size={14} color="#FFC700" />
          <Text style={styles.pillText}>{reward.cost}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => onDelete(reward.id)} style={styles.deleteBtn}>
        <Icon name="trash" size={18} color={Colors.ink4} />
      </TouchableOpacity>
    </View>
  );
}

export default function ParentRewardsScreen() {
  const router = useRouter();
  const { rewards, deleteReward } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerCaption}>Магазин</Text>
          <Text style={styles.headerTitle}>Награды</Text>
        </View>
        <Btn label="Приз" variant="pink" small onPress={() => router.push('/add-reward')}>
          <Icon name="plus" size={16} color="#fff" />
        </Btn>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {rewards.map(r => <RewardRow key={r.id} reward={r} onDelete={deleteReward} />)}
        <View style={{ height: 8 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: Colors.line,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerCaption: { fontSize: 12, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.5 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.ink },
  scroll: { padding: 20 },
  card: {
    backgroundColor: '#fff', borderRadius: 28,
    borderWidth: 1, borderColor: 'rgba(124,92,255,0.07)',
    padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12,
    ...CardShadow,
  },
  rewardIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rewardTitle: { fontSize: 17, fontWeight: '800', color: Colors.ink, marginBottom: 6 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFF4D1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
    alignSelf: 'flex-start',
  },
  pillText: { fontSize: 13, fontWeight: '800', color: '#8A6D14' },
  deleteBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
