/*
 * @Author: xiaojun
 * @Date: 2025-08-25 15:38:34
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-26 17:55:28
 * @Description: 对应操作
 */
import { useColorScheme } from "@/hooks/useColorScheme";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
// 在App.js或项目入口文件最顶部添加
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
	// 屏蔽pointerEvents警告
	if (
		args[0] === "props.pointerEvents is deprecated. Use style.pointerEvents"
	) {
		return;
	}
	// 屏蔽shadow相关警告
	if (
		args[0]?.includes?.("View has unused shadow props") ||
		args[0]?.includes?.("shadowOffset") ||
		args[0]?.includes?.("shadowOpacity") ||
		args[0]?.includes?.("shadowRadius") ||
		args[0]?.includes?.("shadowColor") ||
		args[0]?.includes?.("shadow*")
	) {
		return;
	}
	originalConsoleWarn(...args);
};

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		// SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	if (!loaded) {
		// Async font loading only occurs in development.
		return null;
	}

	return (
		<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="+not-found" />
			</Stack>
			<StatusBar style="auto" />
		</ThemeProvider>
	);
}
