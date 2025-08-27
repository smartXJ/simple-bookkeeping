/*
 * @Author: xiaojun
 * @Date: 2025-08-26 15:09:54
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-27 14:36:40
 * @Description: 对应操作
 */
// import { init } from "@/storage";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
export default function HomeScreen() {
	const [text, setText] = useState("");

	return (
		<View style={{ flex: 1 }}>
			{/* <StatusBar backgroundColor="white" barStyle="dark-content" /> */}
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text>首页内容</Text>
				{/* <Button title="初始化" onPress={init} /> */}
				<TextInput
					style={{ height: 40 }}
					placeholder="Type here to translate!"
					onChangeText={(text) => setText(text)}
					defaultValue={text}
				/>
				<Text style={{ padding: 10, fontSize: 42 }}>
					{text}
					{/* {text
						.split(" ")
						.map((word) => word && "🍕")
						.join(" ")} */}
				</Text>
			</View>
		</View>
	);
}
