/*
 * @Author: xiaojun
 * @Date: 2025-08-27 17:52:58
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-31 10:36:24
 * @Description: 对应操作
 */
import * as SQLite from "expo-sqlite";
import schema from "./schema";

export const DATABASE_NAME = "expense_tracker.db";
// 数据库版本，当schema发生变化时，需要增加版本号
const DATABASE_VERSION = schema.length;

export let db: SQLite.SQLiteDatabase;

export const getDb = () => db;

/**
 * 初始化数据库
 */
export const initDb = async (database: SQLite.SQLiteDatabase) => {
	db = database

		// 获取当前版本
	const data = await database.getFirstAsync<{ user_version: number }>(
		"PRAGMA user_version"
	);

	let currentDbVersion = data?.user_version || 0;

	// 无需升级
	if (currentDbVersion === DATABASE_VERSION) {
		return;
	}

	const newSchemas = schema.slice(currentDbVersion);

	await db.execAsync(`PRAGMA journal_mode = 'wal';`);

	for (const { explanation, list } of newSchemas) {
		console.log(explanation);
		for (const { sql, note } of list) {
			console.log(note);
			await db.execAsync(sql);
		}
	}
	// 更新版本号
	await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
	console.log("✅ 数据库更新完成");
};

export const deleteDd = async () => {
	await db.closeAsync();
	await SQLite.deleteDatabaseAsync(DATABASE_NAME);
}