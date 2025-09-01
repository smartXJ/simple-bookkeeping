/*
 * @Author: xiaojun
 * @Date: 2025-08-25 15:38:34
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-09-01 22:03:22
 * @Description: 对应操作
 */
// import React from "react";
// import { useColorScheme } from "@/hooks/useColorScheme";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import { Text, View } from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import { StatusBar } from 'react-native';
import HomeScreen from ".";
import MineScreen from "./mine";

const Tab = createMaterialTopTabNavigator();
export default function TabLayout() {
	// const colorScheme = useColorScheme();

	return (
		<Tab.Navigator
			tabBarPosition="bottom"
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color }) => {
    			let iconName: keyof typeof MaterialIcons.glyphMap = 'home';
					if (route.name === "index") {
						iconName = focused ? "home-filled" : "home";
					} else if (route.name === "mine") {
						iconName = focused ? "person-4" : "person";
					}
					return <MaterialIcons name={iconName} size={24} color={color} />;
				},
				swipeMinDistance: 50,      // 滑动距离需超过50px才切换
				tabBarLabelPosition: 'beside-icon',
				tabBarActiveTintColor: "#007AFF",
				tabBarInactiveTintColor: "#8E8E93",
				tabBarIndicatorStyle: { backgroundColor: "white" },
				tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
        tabBarShowLabel: false, // 完全隐藏文字标签
        tabBarStyle: {
          backgroundColor: 'white',
          // height: 56, // 标准底部导航栏高度
          // paddingVertical: 8, // 垂直内边距
        },
        // tabBarItemStyle: {
        //   height: 48, // 图标容器高度
        // },
			})}>
			<Tab.Screen name="index" component={HomeScreen} />
			<Tab.Screen name="mine" component={MineScreen} />
		</Tab.Navigator>
	);
}
