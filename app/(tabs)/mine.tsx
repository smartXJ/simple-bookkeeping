/*
 * @Author: xiaojun
 * @Date: 2025-08-26 15:10:03
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-29 16:21:10
 * @Description: 对应操作
 */
import { addLedger, deleteLedger, getAllLedgers, Ledger } from '@/db/services/ledgers';
import MainLayout from '@/layouts/MainLayout';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function MineScreen() {
  const [name, setName] = useState('')
  const [ledgers, setLedgers] = useState<Ledger[]>([])
  // useEffect(() => {
  //   getList()
  // })
  const onAddLedger = async () => {
    await addLedger({ name })
    getList()
  }
  const getList = async () => {
    setLedgers(await getAllLedgers())
    console.log(ledgers, 'ledgers')
  }
  const onDelete = async (id: number) => {
    await deleteLedger(id)
    getList()
  }
  return (
    <MainLayout>
      <View>
        <Text style={styles.title}>sql 测试</Text>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
      />
      <Button
        onPress={() =>onAddLedger()}
        title="添加账本"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <Button
        onPress={() => getList()}
        title="获取列表"
        color="#158450ff"
      />
      <View>
        {ledgers.map((item) => (
          <View key={item.id}>
            <Text>{item.name}-{item.id}</Text>
            <Button onPress={() => onDelete(item.id)} title="删除" color="#841515ff" />
          </View>
        ))}
      </View>
      {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>mine</Text>
      </View> */}
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});