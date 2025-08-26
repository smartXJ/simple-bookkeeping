/*
 * @Author: xiaojun
 * @Date: 2025-08-26 16:55:58
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-26 17:05:31
 * @Description: 对应操作
 */

import React, { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View, ViewStyle } from 'react-native';

interface MainLayoutProps {
  children: ReactNode;
  // header?: ReactNode;
  // footer?: ReactNode;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  // header,
  // footer,
  containerStyle,
  contentStyle,
}) => {
  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      {/* <StatusBar style="auto" /> */}
      {/* {header && <View style={[styles.header, headerStyle]}>{header}</View>} */}
      <View style={[styles.content, contentStyle]}>{children}</View>
      {/* {footer && <View style={[styles.footer, footerStyle]}>{footer}</View>} */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  // header: {
  //   padding: 16,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#eee',
  // },
  content: {
    flex: 1,
    padding: 16,
  },
  // footer: {
  //   padding: 16,
  //   borderTopWidth: 1,
  //   borderTopColor: '#eee',
  // },
});

export default MainLayout;
