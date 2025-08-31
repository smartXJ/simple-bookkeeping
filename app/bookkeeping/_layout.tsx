

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRouter } from "expo-router";
// import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ExpenseScreen from "./expense";
import IncomeScreen from "./income";

const Tab = createMaterialTopTabNavigator();

export default function BookkeepingLayout() {
  const router = useRouter();
  // 不再需要自定义动画值，直接用 props.position

  return (
    <>
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { height: 0 },
        swipeEnabled: true,
        animationEnabled: true,
        lazy: true, // 改为 true
        lazyPreloadDistance: 1,
        tabBarIndicatorStyle: {
          backgroundColor: '#44a991',
          height: 3,
          borderRadius: 2,
          width: 100,
          left: 0,
        },
      }}
      tabBar={props => {
        const { state, navigation } = props;
        return (

          <View style={styles.header}>

            <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
              <Text style={styles.headerBtnText}>{'<'} 返回</Text>
            </TouchableOpacity>
            <View style={styles.tabBar}>
              {state.routeNames.map((name, idx) => (
                <TouchableOpacity
                  key={name}
                  style={styles.tabItem}
                  onPress={() => navigation.navigate(name)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabText, state.index === idx && styles.tabTextActive]}>
                    {name === 'expense' ? '支出' : '收入'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.headerBtn} onPress={() => {/* 编辑功能 */}}>
              <Text style={styles.headerBtnText}>编辑</Text>
            </TouchableOpacity>
          </View>
        );
      }}
    >
      <Tab.Screen name="expense" component={ExpenseScreen} />
      <Tab.Screen name="income" component={IncomeScreen} />
    </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#fff',
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerBtn: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  headerBtnText: {
    fontSize: 16,
    color: '#292F36',
    fontWeight: '500',
  },
  tabBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 40,
    marginHorizontal: 20,
  },
  tabItem: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  tabText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: '#44a991',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#44a991',
    borderRadius: 2,
    left: 0
  },
});
