/*
 * @Author: xiaojun
 * @Date: 2025-09-02 11:42:42
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-09-02 13:44:00
 * @Description: 对应操作
 */
// import { request } from "../dbUtils";
import { request } from "../dbUtils";
import { CategoryType } from "./categories";

const TABLE_NAME = "transactions";

export interface Transaction {
	id: number;
	amount: number;
	description?: string;
	// 类别数据
	category_Id: number;
	// category_name: string;
	// icon?: string;
	type: CategoryType;
	// 所属账本id
	ledger_Id: number;

	create_at: string;
	update_at: string;
}

export type TransactionReq = Partial<Transaction> & {
	category_Id: number;
	ledger_Id: number;
	type: CategoryType;
};

export type TransactionParam = {
  description?: string;
  type?: CategoryType;
}

export const transactionPage = (data: TransactionParam & PageParams) => {
	return request.selectByPage<Transaction>(TABLE_NAME, data, [
		{ field: "description", fieldType: "string" },
    { field: 'type' }
	]);
};

export const getTransaction = (id: number) => {
	return request.selectOne<Transaction>(TABLE_NAME, { field: "id", value: id });
};

export const createTransaction = (category: TransactionReq) => {
	return request.insert(TABLE_NAME, category);
};

export const updateTransaction = (category: TransactionReq) => {
	return request.update(TABLE_NAME, category, { field: "id", value: category.id });
};

export const deleteTransaction = (id: number) => {
	return request.delete(TABLE_NAME, { field: "id", value: id });
};
