/*
 * @Author: xiaojun
 * @Date: 2025-08-30 14:02:39
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-30 18:11:45
 * @Description: 对应操作
 */

import { SQLiteDatabase } from "expo-sqlite";
import { Alert } from "react-native";
import { getDb } from "../db";

type Data = Record<string, any>;
type Condition = { field: string; value: any };
type QueryCondition = {
	field: string;
	value: any;
	fieldType?: "string" | "date";
};
export class Request {
	constructor(private db: SQLiteDatabase) {
		this.db = db;
	}

	private extractKeyValuePairs(data: Data): [string[], any[]] {
		const keys = Object.keys(data);
		const values = Object.values(data);
		return [keys, values];
	}
	private buildSelectQuery(
		tableName: string,
    data: Data,
		conditions?: QueryCondition[],
    sqlPrefix?: string // 默认 *, 可指定字段
	): { sql: string; params: any[] } {
		let sql = `${sqlPrefix || 'SELECT *'} FROM ${tableName}`;
		const params: any[] = [];
		if (conditions && conditions.length > 0) {
      const whereClauses: string[] = [];
      
			conditions.forEach((cond) => {
        const value = data[cond.field];
				if ( value === null || value === undefined || value === "" ) return;

				if (cond.fieldType === "date") {
					const [start, end] = Array.isArray(value)
						? value
						: [value, null];

					if (start) {
						whereClauses.push(`${cond.field} >= ?`);
						params.push(start);
					}
					if (end) {
						whereClauses.push(`${cond.field} <= ?`);
						params.push(end);
					}
				} else if (cond.fieldType === "string") {
					whereClauses.push(`${cond.field} LIKE ?`);
					params.push(`%${value}%`);
				} else {
					whereClauses.push(`${cond.field} = ?`);
					params.push(value);
				}
			});

			if (whereClauses.length > 0) {
				sql += ` WHERE ${whereClauses.join(" AND ")}`;
			}
		}

		sql += ";";
		return { sql, params };
	}

	public async runAsync<T>(
		callback: (db: SQLiteDatabase) => Promise<T>
	): Promise<T> {
		try {
			const db = getDb();
			return await callback(db);
		} catch (error) {
			let errorMessage = "Database operation failed";

			if (error instanceof Error) {
				console.error(`SQL Error: ${error.message}`);
				errorMessage = `Database error: ${error.message}`;

				if (error.message.includes("no such table")) {
					errorMessage = "Required database table is missing";
				} else if (error.message.includes("syntax error")) {
					errorMessage = "Invalid SQL query syntax";
				}
			}

			Alert.alert("Error", errorMessage);
			return Promise.reject(error);
		}
	}

	public async inset(tableName: string, data: Data) {
		const [insertFields, insertValues] = this.extractKeyValuePairs(data);
		const sql = `INSERT INTO ${tableName} (${insertFields.join(
			", "
		)}) VALUES (${insertFields.map(() => "?").join(", ")});`;
		const result = await this.runAsync((db) => db.runAsync(sql, insertValues));
		return result.lastInsertRowId;
	}

	public async update(tableName: string, data: Data, condition: Condition) {
		const [updateFields, updateValues] = this.extractKeyValuePairs(data);
		const setClause = updateFields.map((f) => `${f} = ?`).join(", ");
		const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${condition.field} = ?;`;
		const result = await this.runAsync((db) =>
			db.runAsync(sql, [...updateValues, condition.value])
		);
		return result.changes;
	}

	public async delete(tableName: string, condition: Condition) {
		const sql = `DELETE FROM ${tableName} WHERE ${condition.field} = ?;`;
		const result = await this.runAsync((db) =>
			db.runAsync(sql, [condition.value])
		);
		return result.changes;
	}

	public async selectAll<T>(
		tableName: string,
    data: Data,
		conditions?: QueryCondition[]
	): Promise<T[]> {
    const { sql, params } = this.buildSelectQuery(tableName, data, conditions);
		return this.runAsync((db) => db.getAllAsync<T>(sql, params));
	}

	public async selectByPage<T>(
		tableName: string,
		data: Data & PageParams,
		conditions?: QueryCondition[]
	): Promise<PageResult<T>> {
    // 分页处理
    const { sql, params } = this.buildSelectQuery(tableName, data, conditions);
    const { sql: countSql } = this.buildSelectQuery(tableName, data, conditions, 'SELECT COUNT(*) AS total');
    const { pageNum, pageSize } = data;
    const offset = (pageNum - 1) * pageSize;
    const newSql = sql + ` LIMIT ${pageSize} OFFSET ${offset}`;
    const list = await this.runAsync((db) => db.getAllAsync<T>(newSql, params));
    const total = await this.runAsync((db) => db.getFirstAsync<{total: number}>(countSql, params));

    return { list, pageNum, pageSize, total: total?.total || 0 };
  }

	public async selectOne<T>(
		tableName: string,
		condition: Condition
	): Promise<T | null> {
		const sql = `SELECT * FROM ${tableName} WHERE ${condition.field} = ?;`;
		return this.runAsync((db) => db.getFirstAsync<T>(sql, [condition.value]));
	}
}
