/*
 * @Author: xiaojun
 * @Date: 2025-08-29 21:15:50
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-29 21:38:51
 * @Description: 页面介绍
 */
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function IncomeScreen() {
  return (
    <View>
      <Text>Income Screen</Text>
      <Link href="/bookkeeping/expense">
        <Text>Go to Expense Detail</Text>
      </Link>
    </View>
  );
}