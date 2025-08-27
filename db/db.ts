/*
 * @Author: xiaojun
 * @Date: 2025-08-27 17:52:58
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-27 18:30:03
 * @Description: 对应操作
 */
import * as SQLite from "expo-sqlite";

// 类型定义
interface Account {
	id?: number;
	name: string;
	balance: number;
	currency: string;
	description?: string;
	created_at?: string;
}

interface Category {
	id?: number;
	name: string;
	type: "income" | "expense";
	icon?: string;
	color?: string;
	created_at?: string;
}

interface Transaction {
	id?: number;
	amount: number;
	account_id: number;
	category_id: number;
	date?: string;
	description?: string;
}

interface Transfer {
	id?: number;
	from_account_id: number;
	to_account_id: number;
	amount: number;
	date?: string;
	description?: string;
}

// 初始化数据库表结构
export const initDatabase = async (): Promise<any[]> => {
  const db = SQLite.openDatabaseSync('expenseTracker.db');

	return Promise.all([
		// 1. A new transaction begins
    // 创建账户表
    db.execAsync(
      `CREATE TABLE IF NOT EXISTS accounts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          balance REAL DEFAULT 0,
          currency TEXT DEFAULT 'CNY',
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
    ),
    // 创建分类表
    db.execAsync(
      `CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
          icon TEXT,
          color TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
    ),
    // 创建交易记录表
    db.execAsync(
      `CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          amount REAL NOT NULL,
          account_id INTEGER NOT NULL,
          category_id INTEGER NOT NULL,
          date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          description TEXT,
          FOREIGN KEY (account_id) REFERENCES accounts (id),
          FOREIGN KEY (category_id) REFERENCES categories (id)
        );`
    ),
    // 创建转账记录表
    db.execAsync(
      `CREATE TABLE IF NOT EXISTS transfers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          from_account_id INTEGER NOT NULL,
          to_account_id INTEGER NOT NULL,
          amount REAL NOT NULL,
          date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          description TEXT,
          FOREIGN KEY (from_account_id) REFERENCES accounts (id),
          FOREIGN KEY (to_account_id) REFERENCES accounts (id)
        );`
    ),
	]);
};

export default initDatabase;
