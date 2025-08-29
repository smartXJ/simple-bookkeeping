import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

type Transaction = {
	id: string;
	date: string; // 原始格式 yyyy-mm-dd HH:MM:ss
	category: string;
	subCategory: string;
	amount: number;
	note?: string;
	type: "income" | "expense";
};

const AccountBook = () => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const handleAddTransaction = () => {
		router.push("/bookkeeping/expense");
	}

	// 格式化日期显示
	const formatDisplayDate = (dateStr: string) => {
		const date = dayjs(dateStr);
		const today = dayjs();
		const yesterday = today.subtract(1, 'day');

		const weekdayStr = date.format('周dd'); // 周X

		let timeStr = ''

		if (date.isSame(today, 'day')) {
			timeStr = '今天'
		} else if (date.isSame(yesterday, 'day')) {
			timeStr = '昨天'
		} else if (date.year() === today.year()) {
			timeStr = `${date.format('M月D日')}`
		} else {
			timeStr = `${date.format('YYYY-M-D')}`
		}
		return {
			timeStr,
			weekdayStr,
			dateKey: date.format('YYYY-M-D')
		}
	};

	// 计算每日汇总
	const calculateDailySummary = (transactions: Transaction[]) => {
		const summary: Record<string, { income: number; expense: number }> = {};

		transactions.forEach((t) => {
			const dateKey = t.date.split(" ")[0]; // 取日期部分
			if (!summary[dateKey]) {
				summary[dateKey] = { income: 0, expense: 0 };
			}

			if (t.type === "income") {
				summary[dateKey].income += t.amount;
			} else {
				summary[dateKey].expense += t.amount;
			}
		});

		return summary;
	};

	// 模拟数据（包含完整日期时间）
	const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2023-08-28 08:45:30",
    category: "交通出行",
    subCategory: "网约车",
    amount: 28.5,
    note: "早高峰加价",
    type: "expense"
  },
  {
    id: "2",
    date: "2023-08-28 18:20:15",
    category: "食品餐饮",
    subCategory: "咖啡",
    amount: 35.0,
    type: "expense"
  },
  {
    id: "3",
    date: "2023-08-28 12:05:40",
    category: "服饰鞋包",
    subCategory: "夏季促销",
    amount: 199.0,
    note: "满减活动",
    type: "expense"
  },
  {
    id: "4",
    date: "2023-08-28 23:55:00",
    category: "休闲娱乐",
    subCategory: "电影票",
    amount: 45.0,
    type: "expense"
  },
  {
    id: "5",
    date: "2023-08-29 09:30:00",
    category: "学习成长",
    subCategory: "在线课程",
    amount: 299.0,
    note: "限时折扣",
    type: "expense"
  },
  {
    id: "6",
    date: "2023-08-29 14:15:20",
    category: "医疗健康",
    subCategory: "药品",
    amount: 76.8,
    type: "expense"
  },
  {
    id: "7",
    date: "2023-08-29 19:45:30",
    category: "居家生活",
    subCategory: "水电费",
    amount: 256.3,
    note: "阶梯电价",
    type: "expense"
  },
  {
    id: "8",
    date: "2023-08-29 22:10:50",
    category: "数码电子",
    subCategory: "手机配件",
    amount: 89.0,
    type: "expense"
  },
  {
    id: "9",
    date: "2023-08-30 11:25:15",
    category: "社交应酬",
    subCategory: "朋友聚餐",
    amount: 120.0,
    note: "AA制",
    type: "expense"
  },
  {
    id: "10",
    date: "2023-08-30 16:40:05",
    category: "旅行住宿",
    subCategory: "酒店预订",
    amount: 580.0,
    note: "周末特惠",
    type: "expense"
  }
];
;

	// 加载更多数据
	const loadMoreTransactions = useCallback(async () => {
		console.log("Loading more transactions...");
		if (loading || !hasMore) return;

		setLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const newData = [...mockTransactions].map((t, i) => ({
			...t,
			id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			date: `2023-08-${26 - page} ${Math.floor(
				Math.random() * 24
			)}:${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60)}`,
		}));

		setTransactions((prev) => [...prev, ...newData]);
		setPage((prev) => prev + 1);
		setHasMore(page < 3);
		setLoading(false);
	}, [page, loading, hasMore]);

	useEffect(() => {
		loadMoreTransactions();
	}, []);

	// 渲染单个交易项
	const renderItem = ({ item }: { item: Transaction }) => (
		<View style={styles.transactionItem}>
			<View style={styles.transactionLeft}>
				<Text style={styles.transactionCategory}>
					{item.category}-{item.subCategory}
				</Text>
				{item.note && <Text style={styles.transactionNote}>{item.note}</Text>}
			</View>
			<Text
				style={[
					styles.transactionAmount,
					item.type === "expense" ? styles.expense : styles.income,
				]}>
				{item.type === "expense" ? "-" : "+"}
				{item.amount.toFixed(2)}
			</Text>
		</View>
	);

	/* 顶部概览 */
	const renderTopOverview = () => {
		return (
			<LinearGradient
				colors={["#4c669f", "#3b5998", "#192f6a"]}
				style={styles.overviewContainer}>
				<View style={styles.overviewTop}>
					<View style={styles.overviewItem}>
						<Text style={styles.overviewLabel}>本月收入</Text>
						<Text style={styles.overviewValue}>10,927.14</Text>
					</View>
					<View style={styles.overviewItem}>
						<Text style={styles.overviewLabel}>本月结余</Text>
						<Text style={styles.overviewValue}>8,921.47</Text>
					</View>
					<View style={styles.overviewItem}>
						<Text style={styles.overviewLabel}>剩余预算</Text>
						<TouchableOpacity>
							<Text style={styles.overviewValue}>点击设置</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.overviewItem}>
					<Text style={styles.overviewLabel}>本月支出</Text>
					<Text style={styles.overviewValue}>2,005.67</Text>
				</View>
			</LinearGradient>
		);
	};

	// 将数据按日期分组
	const groupedTransactions = transactions.reduce((acc, transaction) => {
		const { timeStr, weekdayStr, dateKey } = formatDisplayDate(transaction.date);
		const existingGroup = acc.find((group) => group.dateKey === dateKey);

		if (existingGroup) {
			existingGroup.data.push(transaction);
		} else {
			acc.push({ timeStr, weekdayStr, dateKey, data: [transaction] });
		}
		return acc;
	}, [] as { 	timeStr: string; weekdayStr: string; dateKey: string; data: Transaction[] }[]);

	// 计算每日汇总
	const dailySummary = calculateDailySummary(transactions);

	return (
		<View style={styles.container}>
			<View style={styles.nav}>
				<Text>日常账本</Text>
				<View>
					<Text>筛选</Text>
				</View>
			</View>
			{/* 记账列表 */}
			<FlatList
				data={groupedTransactions}
				keyExtractor={(item, index) => `${item.dateKey}-${index}`}
				ListHeaderComponent={renderTopOverview()}
				renderItem={({ item }) => {
					const dateKey = item.data[0].date.split(" ")[0];
					const summary = dailySummary[dateKey] || { income: 0, expense: 0 };

					return (
						<View>
							<View style={styles.sectionHeaderContainer}>
								<View style={styles.sectionHeader}>
									<Text style={styles.sectionHeaderDate}>{item.timeStr}</Text>
									<Text style={styles.sectionHeaderWeek}>{item.weekdayStr}</Text>
								</View>
								<View style={styles.dailySummary}>
									<Text>收</Text>
									<Text style={styles.income}>{summary.income.toFixed(2)}</Text>
									<Text>支</Text>
									<Text style={[styles.expense]}>
										{summary.expense.toFixed(2)}
									</Text>
								</View>
							</View>
							<FlatList
								data={item.data}
								renderItem={renderItem}
								keyExtractor={(transaction) => transaction.id}
							/>
						</View>
					);
				}}
				onEndReached={loadMoreTransactions}
				onEndReachedThreshold={0.5}
				ListFooterComponent={() =>
					loading ? <ActivityIndicator size="large" color="#4c669f" /> : null
				}
				contentContainerStyle={styles.listContainer}
			/>

			{/* 添加按钮 */}
			<TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
				<Text style={styles.addButtonText}>添加一条新记账</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	nav: {
	  // padding: '20 40',
		padding: 20,
		paddingTop: 10,
		paddingBottom: 10,
	  flexDirection: "row",
	  justifyContent: "space-between",
	},
	overviewContainer: {
		padding: 20,
		borderRadius: 10,
		margin: 10,
		marginTop: 0
	},
	overviewTop: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		elevation: 3,
		marginBottom: 15,
	},
	overviewItem: {
		// width: '48%',
	},
	overviewLabel: {
		color: "rgba(255,255,255,0.7)",
		fontSize: 12,
	},
	overviewValue: {
		color: "white",
		fontSize: 14,
		marginTop: 5,
	},
	listContainer: {
		paddingBottom: 80,
	},
	sectionHeaderContainer: {
		// backgroundColor: '#eaeaea',
		paddingVertical: 8,
		paddingHorizontal: 15,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
	},
	sectionHeaderDate: {
		fontSize: 15,
		color: "#333",
		fontWeight: 600,
		marginRight: 5,
	},
	sectionHeaderWeek: {
		fontSize: 12,
		color: "#3333338c",
		fontWeight: 400,
	},
	dailySummary: {
		flexDirection: "row",
		gap: 10,
		fontSize: 13,
		color: "#666",
	},
	// dailySummaryIncomeAmt: {
	// 	color: '#7cb5a2'
	// },
	// dailySummaryExpenseAmt: {
	// 	color: '#de8d93'
	// },
	transactionItem: {
		backgroundColor: "white",
		padding: 12,
		marginHorizontal: 10,
		marginVertical: 5,
		borderRadius: 8,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		elevation: 1,
	},
	transactionLeft: {
		flex: 1,
	},
	transactionCategory: {
		fontSize: 14,
		color: "#333",
	},
	transactionNote: {
		fontSize: 12,
		color: "#666",
		marginTop: 4,
	},
	transactionAmount: {
		fontSize: 14,
	},
	expense: {
		color: "#ff4757",
	},
	income: {
		color: "#69b49bff",
	},
	addButton: {
		position: "absolute",
		bottom: 20,
		right: 20,
		backgroundColor: "#4c669f",
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 30,
		elevation: 5,
	},
	addButtonText: {
		color: "white",
		fontSize: 14,
	},
});

export default AccountBook;
