
import NumericKeypad from '@/components/NumericKeypad';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Button, Dimensions, ScrollView, StyleSheet, TextInput, View } from 'react-native';
const { width } = Dimensions.get('window');

const ScrollInputLayout = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToInput = (index: number) => {
    setActiveIndex(index);
    scrollRef.current?.scrollTo({ x: width * index, animated: true });
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  return (
    <View style={styles.container}>
      {/* 顶部区域 - 带高亮的控制按钮 */}
      <View style={styles.topSection}>
        <Button onPress={() => { router.back() }} title='<' />


        <Button 
          title="支出" 
          onPress={() => scrollToInput(0)}
          color={activeIndex === 0 ? '#007AFF' : '#8E8E93'}
        />
        <Button 
          title="收入" 
          onPress={() => scrollToInput(1)}
          color={activeIndex === 1 ? '#007AFF' : '#8E8E93'}
        />
      </View>

      {/* 中间区域 - 可滚动输入框 */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        // onMomentumScrollEnd={handleScroll}
        onScroll={handleScroll}
        scrollEventThrottle={200}
        style={styles.middleSection}
      >
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="第一个输入框" 
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="第二个输入框" 
          />
        </View>
      </ScrollView>

      {/* 底部区域 */}
      <View style={styles.bottomSection}>
        <NumericKeypad />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  topSection: {
    // height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  middleSection: {
    flex: 1,
  },
  inputContainer: {
    width: width,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  bottomSection: {
    // height: 80,
    // backgroundColor: '#f5f5f5',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

export default ScrollInputLayout;