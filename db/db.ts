/*
 * @Author: xiaojun
 * @Date: 2025-08-27 17:52:58
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-30 11:28:48
 * @Description: 对应操作
 */
import * as SQLite from "expo-sqlite";
import schema from "./schema";


export const DATABASE_NAME = "expense_tracker.db";
// 数据库版本，当schema发生变化时，需要增加版本号
const DATABASE_VERSION = 2;

export let db: SQLite.SQLiteDatabase;

export const getDb = () => db;

/**
 * 检查表是否存在
 */
async function tableExists(db: SQLite.SQLiteDatabase, table: string) {
	const result = await db.getAllAsync(
		`SELECT name FROM sqlite_master WHERE type='table' AND name=?;`,
		[table]
	);
	return result.length > 0;
}

/**
 * 检查表中是否有某个字段
 */
async function columnExists(db: SQLite.SQLiteDatabase, table: string, column: string) {
	const result = await db.getAllAsync(`PRAGMA table_info(${table});`);
	return result.some((row: any) => row.name === column);
}

/**
 * 检查触发器是否存在
 */
async function triggerExists(db: SQLite.SQLiteDatabase, triggerName: string) {
	const result = await db.getAllAsync(
		`SELECT name FROM sqlite_master WHERE type='trigger' AND name=?;`,
		[triggerName]
	);
	return result.length > 0;
}

/**
 * 运行迁移
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

	await db.execAsync(`PRAGMA journal_mode = 'wal';`);

	for (const [table, def] of Object.entries(schema)) {
		// 1. 确保表存在
		if (!(await tableExists(db, table))) {
			console.log(`📦 创建表: ${table}`);
			await db.execAsync(def.createSQL);
		}

		// 2. 确保每个列存在
		for (const [col, sql] of Object.entries(def.columns)) {
			if (!(await columnExists(db, table, col))) {
				console.log(`➕ 添加列: ${table}.${col}`);
				await db.execAsync(sql as string);
			}
		}

		// 3. 确保触发器存在
		for (const [name, sql] of Object.entries(def.triggers || {})) {
			if (!(await triggerExists(db, name))) {
				console.log(`⚡ 创建触发器: ${name}`);
				await db.execAsync(sql);
			}
		}
	}
	await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
	console.log("✅ 数据库合并完成");
};

export const deleteDd = async () => {
	await db.closeAsync();
	await SQLite.deleteDatabaseAsync(DATABASE_NAME);
}