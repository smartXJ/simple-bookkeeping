// import React from 'react';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet, Text } from "react-native";
import ExpenseScreen from "./expense";
import IncomeScreen from "./income";
// 创建顶部标签导航器
const Tab = createMaterialTopTabNavigator();


export default function BookkeepingLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#44a991", // 激活标签颜色
        tabBarInactiveTintColor: "#999", // 非激活标签颜色
        tabBarIndicatorStyle: {
          backgroundColor: "#44a991", // 指示器颜色
          height: 3, // 指示器高度
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: "bold",
          color: "#292F36", // 标签文字颜色
        },
        tabBarStyle: {
          backgroundColor: "#FFF", // 标签栏背景色
          elevation: 0, // 去除阴影
          height: 0
        },
        tabBarShowLabel: false,
        tabBarLabel: () => {
          return <Text>{route.name === "expense" ? "支出" : "收入"}</Text>;
        },
      })}
    >
      <Tab.Screen name="expense" component={ExpenseScreen} />
      <Tab.Screen name="income" component={IncomeScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FFF7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#292F36",
  },
});
