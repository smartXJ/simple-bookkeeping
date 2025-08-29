/*
 * @Author: xiaojun
 * @Date: 2025-08-25 15:38:34
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-29 11:51:35
 * @Description: 对应操作
 */
import { initDb } from "@/db/db";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { Suspense } from "react";
import "react-native-reanimated";

// 设置全局语言为中文
dayjs.locale("zh-cn");
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
	//  useEffect(() => {
	//   initDb(db);
	// }, []);
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
			<Suspense fallback={<Stack.Screen name="loading" />}>
				<SQLiteProvider databaseName="expense_tracker.db" onInit={initDb}>
					<Stack>
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						<Stack.Screen name="+not-found" />
					</Stack>
					<StatusBar style="auto" />
				</SQLiteProvider>
			</Suspense>
		</ThemeProvider>
	);
}
