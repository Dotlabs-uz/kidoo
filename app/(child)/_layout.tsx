import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "../../components/Icon";
import { CardShadow, Colors } from "../../lib/colors";

const TABS = [
	{ name: "tasks", label: "Задания", icon: "tasks" },
	{ name: "prizes", label: "Призы", icon: "gift" },
	{ name: "profile", label: "Профиль", icon: "profile" },
];

function ChildTabBar({ state, navigation }: any) {
	const insets = useSafeAreaInsets();
	return (
		<View style={[styles.wrapper, { paddingBottom: insets.bottom + 8 }]}>
			<View style={styles.pill}>
				{TABS.map((tab, index) => {
					const active = state.index === index;
					return (
						<TouchableOpacity
							key={tab.name}
							style={[styles.tab, active && styles.tabActive]}
							onPress={() => navigation.navigate(tab.name)}
						>
							<Icon
								name={tab.icon}
								size={24}
								active={active}
								mode="child"
							/>
							<Text
								style={[
									styles.tabLabel,
									active && styles.tabLabelActive,
								]}
							>
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
		backgroundColor: "transparent",
		paddingHorizontal: 16,
		paddingTop: 0,
	},
	pill: {
		flexDirection: "row",
		backgroundColor: "#fff",
		borderRadius: 26,
		paddingHorizontal: 8,
		paddingVertical: 8,
		...CardShadow,
		shadowOpacity: 0.14,
		shadowRadius: 28,
		elevation: 12,
		borderWidth: 1,
		borderColor: Colors.line,
	},
	tab: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: 2,
		borderRadius: 18,
		paddingVertical: 6,
	},
	tabActive: { backgroundColor: Colors.tealSoft },
	tabLabel: {
		fontSize: 10,
		fontWeight: "800",
		color: Colors.ink3,
		textTransform: "uppercase",
		letterSpacing: 0.3,
	},
	tabLabelActive: { color: Colors.tealMid },
});
