import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../components/Icon';
import { Colors } from '../../lib/colors';

const TABS = [
  { name: 'tasks',    label: 'Задания',  icon: 'tasks' },
  { name: 'rewards',  label: 'Награды',  icon: 'gift' },
  { name: 'progress', label: 'Прогресс', icon: 'chart' },
  { name: 'profile',  label: 'Профиль',  icon: 'profile' },
];

function ParentTabBar({ state, navigation }: any) {
  return (
    <View style={styles.tabbar}>
      {TABS.map((tab, index) => {
        const active = state.index === index;
        return (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tab, active && styles.tabActive]}
            onPress={() => navigation.navigate(tab.name)}
          >
            <Icon name={tab.icon} size={26} active={active} mode="parent" />
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function ParentLayout() {
  return (
    <Tabs tabBar={(props) => <ParentTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="tasks" />
      <Tabs.Screen name="rewards" />
      <Tabs.Screen name="progress" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: 'row', gap: 4, paddingHorizontal: 10, paddingTop: 8, paddingBottom: 22,
    backgroundColor: '#fff', borderTopWidth: 2, borderTopColor: Colors.line,
  },
  tab: {
    flex: 1, alignItems: 'center', gap: 2, paddingVertical: 8, paddingHorizontal: 2,
    borderRadius: 14,
  },
  tabActive: { backgroundColor: Colors.primarySoft },
  tabLabel: { fontSize: 10, fontWeight: '800', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.2 },
  tabLabelActive: { color: Colors.primary },
});
