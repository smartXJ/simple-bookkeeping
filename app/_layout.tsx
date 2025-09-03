/*
 * @Author: xiaojun
 * @Date: 2025-08-25 15:38:34
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-09-02 21:16:49
 * @Description: 对应操作
 */
import { DATABASE_NAME, initDb } from "@/db/db";
import { getAllCategories } from "@/db/services/categories";
import { useCategoryStore } from "@/store/categoryStore";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
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
		args[0]?.includes?.("shadow")
	) {
		return;
	}
	originalConsoleWarn(...args);
};

export default function RootLayout() {
	const setCategories = useCategoryStore((state) => state.setCategories);

	const initialization = async (db: SQLiteDatabase) => {
		await initDb(db);
		const list = await getAllCategories();
		setCategories(list);
	};
	return (
		<SQLiteProvider databaseName={DATABASE_NAME} onInit={initialization}>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen
						name="bookkeeping/[id]"
						options={{ headerShown: false }}
					/>
					<Stack.Screen name="+not-found" />
				</Stack>
				<StatusBar style="auto" />
		</SQLiteProvider>
	);
}
