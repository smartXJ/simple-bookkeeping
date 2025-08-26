/*
 * @Author: xiaojun
 * @Date: 2025-08-26 15:09:54
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-26 16:45:20
 * @Description: 对应操作
 */
import { Text, View } from "react-native";

export default function HomeScreen() {
	return (
		<View style={{ flex: 1 }}>
			{/* <StatusBar backgroundColor="white" barStyle="dark-content" /> */}
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text>首页内容</Text>
			</View>
		</View>
	);
}
