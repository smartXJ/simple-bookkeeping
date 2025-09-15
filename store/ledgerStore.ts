/*
 * @Author: xiaojun
 * @Date: 2025-09-02 20:58:07
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-09-02 21:19:24
 * @Description: 对应操作
 */
import { Ledger } from "@/db/services/ledgers";
import { create } from "zustand";

export const useLedgerStore = create<{
	ledger: Ledger;
	setLedger: (ledger: Ledger) => void;
}>((set) => ({
	ledger: {
		id: 0,
		name: "",
		balance: 0,
		currency: "",
		default_flag: 1,
		created_at: "",
		update_at: "",
	},
	setLedger: (ledger: Ledger) =>
		set({
			ledger,
		}),
}));
