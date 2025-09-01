/*
 * @Author: xiaojun
 * @Date: 2025-08-30 13:53:24
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-09-01 16:50:45
 * @Description: 对应操作
 */
import { useState } from "react";
import {
	Alert,
	StyleProp,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ViewStyle,
} from "react-native";

const btnList = [1, 2, 3, 4, 5, 6, 7, 8, 9, "再记", 0, "."];
const operatorBtnList = ["+", "-", "x", "÷"];

export default function NumericKeypad() {
	const [input, setInput] = useState("");
	const renderButton = (item: number | string, index: number) => {
		const [isPressed, setIsPressed] = useState(false);
		const style: StyleProp<ViewStyle> = [styles.center];

		const handlePressIn = () => setIsPressed(true);
		const handlePressOut = () => setIsPressed(false);

		if (btnList.includes(item)) {
			style.push(styles.itemBtn);
		}
		if (operatorBtnList.includes(item + "")) style.push(styles.operatorBtn);
		if (["取消", "删除", "再记", "=", "完成"].includes(item + ""))
			style.push(styles.funBtn);
		if (item === "=" || item === "完成") style.push(styles.finishBtnColor);

		return (
			<TouchableOpacity
				activeOpacity={0.7}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				onPress={() => onPress(item)}
				key={index}
				style={[style, isPressed && styles.pressedBtn]}>
				<Text style={styles.btnText}>{item}</Text>
			</TouchableOpacity>
		);
	};
	const onPress = (value: number | string) => {
		// 处理不同按钮的点击逻辑
		if (value === "删除") {
			setInput((prev) => prev.slice(0, -1));
		} else if (value === "取消") {
			setInput("");
		} else if (value === "再记") {
		} else if (value === "完成") {
		} else if (value === "=") {
			try {
				const result = eval(input.replaceAll("x", "*").replaceAll("÷", "/")).toString()
				setInput(result);
			} catch (error) {
				Alert.alert("计算错误");
				console.log(error);
			}
		} else {
			setInput((prev) => prev + value);
		}
	};

	const getLastBtnLabel = (str: string) => {
		if (!str) return "取消";
		if (/[\+\-x\÷]/.test(str)) return "=";
		return "完成";
	};

	return (
		<>
			<View style={styles.displayContainer}>
				<Text style={styles.displayText}>{input || "0"}</Text>
			</View>
			<View style={styles.container}>
				<View style={styles.left}>
					{btnList.map((item, index) => renderButton(item, index))}
				</View>
				<View style={[styles.right]}>
					{renderButton("删除", 0)}
					<View
						style={[styles.itemBtn, styles.funBtn, styles.operatorContainer]}>
						{operatorBtnList.map((item, index) => renderButton(item, index))}
					</View>
					{renderButton(getLastBtnLabel(input), 1)}
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		gap: 5,
		padding: 7,
		fontWeight: "bold",
	},
	displayContainer: {
		marginLeft: 7,
		marginRight: 7,
		backgroundColor: "#fff",
		// padding: 20,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 10,
		alignItems: "flex-end",
	},
	displayText: {
		fontSize: 24,
		fontWeight: "bold",
	},
	center: {
		justifyContent: "center",
		alignItems: "center",
	},
	left: {
		flexDirection: "row",
		flexWrap: "wrap",
		flex: 3,
		gap: 5,
	},
	right: {
		flex: 1,
		gap: 5,
	},
	itemBtn: {
		height: 50,
		backgroundColor: "#ffffffff",
		flex: 1,
		minWidth: "30%",
		borderRadius: 5,
	},
	funBtn: {
		height: 50,
		backgroundColor: "#eae9e7",
		borderRadius: 5,
	},
	operatorContainer: {
		flexWrap: "wrap",
		flexDirection: "row",
		flex: 2,
		gap: 5,
	},
	operatorBtn: {
		minWidth: "45%",
		flex: 1,
		height: 50,
		borderRadius: 5,
	},
	finishBtnColor: {
		backgroundColor: "#53a456",
	},
	btnText: {
		fontSize: 18,
		fontWeight: "500",
	},
	pressedBtn: {
		backgroundColor: "#e0e0e0",
		transform: [{ scale: 0.95 }],
	},
});
