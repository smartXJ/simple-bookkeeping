import NumericKeypad from "@/components/NumericKeypad";
import { Category } from "@/db/services/categories";
import { createTransaction, getAllTransactions, TransactionReq, updateTransaction } from "@/db/services/transactions";
import { useCategoryStore } from "@/store/categoryStore";
import { useLedgerStore } from "@/store/ledgerStore";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
	Alert,
	Button,
	Dimensions,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';

const { width } = Dimensions.get("window");

export default function Modify() {
	const scrollRef = useRef<ScrollView>(null);

	const numericKeypadRef = useRef<React.ComponentRef<typeof NumericKeypad>>(null);
	const categories = useCategoryStore((state) => state.categories);

	const defaultLedger = useLedgerStore((state) => state.ledger);

	const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
	const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);

	const [transactionData, setTransactionData] = useState<TransactionReq>({
		category_Id: 0,
		description: "",
		ledger_Id: defaultLedger.id,
		type: "expense",
		amount: 0,
	});

	useEffect(() => {
		setExpenseCategories(categories.filter((item) => item.type === "expense"));
		setIncomeCategories(categories.filter((item) => item.type === "income"));
	}, [categories]);

	const [activeIndex, setActiveIndex] = useState(0);
	const [categoryId, setCategoryId] = useState(0);

	const initCategoryId = () => {
		setCategoryId(
			activeIndex === 0 ? expenseCategories[0]?.id : incomeCategories[0]?.id
		);
	};

	useEffect(() => {
		// setType(activeIndex === 0 ? "expense" : "income");
		initCategoryId();
	}, [activeIndex]);

	const scrollToInput = (index: number) => {
		setActiveIndex(index);
		scrollRef.current?.scrollTo({ x: width * index, animated: true });
	};

	const handleScroll = (event: any) => {
		const offsetX = event.nativeEvent.contentOffset.x;
		const newIndex = Math.round(offsetX / width);

		if (newIndex !== activeIndex) {
			setActiveIndex(newIndex);
		}
	};


	const CategoryButton = ({ category }: { category: Category }) => {
		return (
			<TouchableOpacity
				style={[styles.CBtn, categoryId === category.id && styles.CBtnActive]}
				onPress={() => setCategoryId(category.id)}>
				<Text
					style={{
						color: categoryId === category.id ? "#fff" : "#000",
					}}>
					{category.name}
				</Text>
			</TouchableOpacity>
		);
	};

	const back = () => {
		router.back();
	};

	const onCompleted = async (value: string) => {
		const params = {
			...transactionData,
			category_Id: categoryId,
			amount: Number(value),
		}
		if (params.id) {
			await updateTransaction(params)
		} else {
			await createTransaction(params)
		}
		const list = await getAllTransactions()
		console.log(params, '完成', list);
		Alert.alert('操作成功')
		back()
	}

	return (
		<View style={styles.container}>
			{/* 顶部区域 - 带高亮的控制按钮 */}
			<View style={styles.topSection}>
				<Button onPress={back} title="<" />
				<Button
					title="支出"
					onPress={() => scrollToInput(0)}
					color={activeIndex === 0 ? "#007AFF" : "#8E8E93"}
				/>
				<Button
					title="收入"
					onPress={() => scrollToInput(1)}
					color={activeIndex === 1 ? "#007AFF" : "#8E8E93"}
				/>
				<Button title="编辑" />
			</View>

			{/* 中间区域 - 可滚动输入框 */}
			<ScrollView
				ref={scrollRef}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				// onMomentumScrollEnd={handleScroll}
				onScroll={handleScroll}
				scrollEventThrottle={200}
				style={styles.middleSection}>
				<View style={styles.contentContainer}>
					{expenseCategories.map((category) => (
						<CategoryButton key={category.id} category={category} />
					))}
				</View>
				<View style={styles.contentContainer}>
					{incomeCategories.map((category) => (
						<CategoryButton key={category.id} category={category} />
					))}
				</View>
			</ScrollView>

			{/* 底部区域 */}
			<View style={styles.bottomSection}>
				<TextInput
					style={styles.remarkInput}
					placeholder="备注"
					value={transactionData.description}
					onChangeText={(text) =>
						setTransactionData({ ...transactionData, description: text })
					}
				/>
				<NumericKeypad onCompleted={onCompleted} ref={numericKeypadRef}/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		// backgroundColor: "#d31111ff",
	},
	remarkInput: {
		height: 40,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		marginBottom: 10,
		paddingHorizontal: 10,
	},
	topSection: {
		// height: 80,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		// paddingHorizontal: 20,
		paddingVertical: 10,
		// backgroundColor: "#f5f5f5",
	},
	middleSection: {
		flex: 1,
	},
	contentContainer: {
		width: width,
		flexDirection: "row",
		flexWrap: "wrap",
		padding: 10,
		// gap: 10,
	},
	CBtn: {
		// minWidth: "30%",
		width: (width - 20) / 3 - 10,
		marginInline: 5,
		// marginRight: 5,
		marginBottom: 5,
		// flex: 1,
		height: 40,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "#ccc",
	},
	CBtnActive: {
		backgroundColor: "#007AFF",
	},
	bottomSection: {
		// height: 80,
		// backgroundColor: '#f5f5f5',
		// justifyContent: 'center',
		// alignItems: 'center',
	},
});
