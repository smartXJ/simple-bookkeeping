/*
 * @Author: xiaojun
 * @Date: 2025-08-29 09:50:44
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-30 16:07:43
 * @Description: 对应操作
 */
import { getDb } from "../db";
import { request } from "../dbUtils";
// import * as SQLite from "expo-sqlite";
export interface Ledger {
  id: number;  // 自增主键，创建时可选
  name: string;  // 必填字段
  balance: number;  // 默认0
  currency: string;  // 默认'CNY'
  default_flag: number;  // 默认0，1表示默认账本
  description?: string | null;  // 可选字段
  created_at: string | Date;  // 时间戳，自动生成
  update_at: string | Date;  // 时间戳，自动生成
}
export type LedgerReq = Partial<Ledger> & { name: string };

export const addLedger = async (ledger: LedgerReq): Promise<number> => {
  // const db = await SQLite.openDatabaseAsync('expense_tracker.db');
  const db = getDb()
  const result = await db.runAsync(
    'INSERT INTO ledgers (name) VALUES (?);',
    ledger.name
  );
  return result.lastInsertRowId
}
export const getAllLedgers = async (): Promise<Ledger[]> => {
  const db = getDb()
  const result = await db.getAllAsync<Ledger>('SELECT * FROM ledgers;');
  return result;
}
export const getLedger = async (id: number): Promise<Ledger | null> => {
  const db = getDb()
  return db.getFirstAsync<Ledger>('SELECT * FROM ledgers WHERE id = ?;', [id]);
}

export const deleteLedger = (id: number) => {
  const db = getDb()
  return db.runAsync("DELETE FROM ledgers WHERE id=?", [id]);
};

export const setDefaultLedger = async (id: number) => {
  const db = getDb();

  // 用事务保证原子操作
  await db.withTransactionAsync(async () => {
    // 先把所有账本取消默认
    await db.runAsync("UPDATE ledgers SET default_flag = 0 WHERE default_flag = 1");
    
    // 再把指定账本设为默认
    await db.runAsync("UPDATE ledgers SET default_flag = 1 WHERE id = ?", [id]);
  });
};

export const ledgerPage = (date: PageParams) => {
  return request.selectByPage<Ledger[]>("ledgers", date, []);
}