/*
 * @Author: xiaojun
 * @Date: 2025-08-26 15:10:03
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-26 16:58:39
 * @Description: 对应操作
 */
import MainLayout from '@/layouts/MainLayout';
import { Text, View } from 'react-native';

export default function MineScreen() {
  return (
    <MainLayout>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>mine</Text>
      </View>
    </MainLayout>
  );
}