import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { AppProvider, useApp } from "../context/AppContext";
import { Colors } from "../lib/colors";

function RootNavigator() {
	const { loading } = useApp();

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: Colors.primarySoft,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				animation: "slide_from_right",
			}}
		/>
	);
}

export default function RootLayout() {
	return (
		<AppProvider>
			<StatusBar style="dark" />
			<RootNavigator />
		</AppProvider>
	);
}
