import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { AppProvider, useApp } from "../context/AppContext";
import { Colors } from "../lib/colors";

function RootNavigator() {
	const { loading, networkError, retryInit } = useApp();

	if (networkError) {
		return (
			<View style={{ flex: 1, backgroundColor: '#fff', justifyContent: "center", alignItems: "center", padding: 32 }}>
				<Text style={{ fontSize: 48, marginBottom: 16 }}>📡</Text>
				<Text style={{ fontSize: 20, fontWeight: '800', color: Colors.ink, marginBottom: 8, textAlign: 'center' }}>
					Нет подключения
				</Text>
				<Text style={{ fontSize: 15, color: Colors.ink3, textAlign: 'center', marginBottom: 32, lineHeight: 22 }}>
					Проверьте интернет и попробуйте снова
				</Text>
				<TouchableOpacity
					onPress={retryInit}
					style={{ backgroundColor: Colors.primary, borderRadius: 999, paddingVertical: 16, paddingHorizontal: 36 }}
				>
					<Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Перезапустить</Text>
				</TouchableOpacity>
			</View>
		);
	}

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
