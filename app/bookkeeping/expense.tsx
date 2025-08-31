/*
 * @Author: xiaojun
 * @Date: 2025-08-29 21:16:51
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-31 10:47:58
 * @Description: 页面介绍
 */
import { Link } from 'expo-router';
import { Text, View } from "react-native";

export default function ExpenseScreen() {
  return (
    <View>
      <Text>expense Screen</Text>
      <Link href="/bookkeeping/income">
        <Text>Go to Income Detail</Text>
      </Link>
    </View>
  );
}