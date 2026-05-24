import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "../../components/Icon";
import { Colors } from "../../lib/colors";

const TABS = [
	{ name: "tasks",   label: "Главная",  icon: "tasks" },
	{ name: "prizes",  label: "Магазин",  icon: "gift" },
	{ name: "profile", label: "Профиль",  icon: "profile" },
];

function ChildTabBar({ state, navigation }: any) {
	const insets = useSafeAreaInsets();
	return (
		<View style={[styles.wrapper, { paddingBottom: insets.bottom + 12 }]} pointerEvents="box-none">
			<View style={styles.pill}>
				{TABS.map((tab, index) => {
					const active = state.index === index;
					return (
						<TouchableOpacity
							key={tab.name}
							style={styles.tab}
							onPress={() => navigation.navigate(tab.name)}
							activeOpacity={0.7}
						>
							{active && <View style={styles.activeDot} />}
							<Icon name={tab.icon} size={26} active={active} mode="child" />
							<Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
								{tab.label}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		</View>
	);
}

export default function ChildLayout() {
	return (
		<Tabs
			tabBar={(props) => <ChildTabBar {...props} />}
			screenOptions={{ headerShown: false }}
		>
			<Tabs.Screen name="tasks" />
			<Tabs.Screen name="prizes" />
			<Tabs.Screen name="profile" />
		</Tabs>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		paddingHorizontal: 20,
		paddingTop: 8,
		backgroundColor: 'transparent',
	},
	pill: {
		flexDirection: "row",
		backgroundColor: "#fff",
		borderRadius: 28,
		paddingVertical: 10,
		paddingHorizontal: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.12,
		shadowRadius: 24,
		elevation: 14,
	},
	tab: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: 4,
		paddingVertical: 4,
		position: "relative",
	},
	activeDot: {
		position: "absolute",
		top: 0,
		width: 5,
		height: 5,
		borderRadius: 999,
		backgroundColor: Colors.purple,
	},
	tabLabel: {
		fontSize: 11,
		fontWeight: "600",
		color: Colors.ink3,
	},
	tabLabelActive: {
		color: Colors.purple,
		fontWeight: "800",
	},
});
