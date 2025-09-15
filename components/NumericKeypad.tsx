/*
 * @Author: xiaojun
 * @Date: 2025-08-30 13:53:24
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-09-01 21:54:30
 * @Description: 对应操作
 */
import { forwardRef, useImperativeHandle, useState } from "react";
import {
  Alert,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const btnList = [1, 2, 3, 4, 5, 6, 7, 8, 9, "再记", 0, "."];
const operatorBtnList = ["+", "-", "x", "÷"];
// 定义组件的 ref 类型
export interface NumericKeypadRef {
  setInput: (value: string) => void;
  // input: string;
}
interface NumericKeypadProps {
  onCompleted: (input: string) => void;
}

 function NumericKeypad(props: NumericKeypadProps, ref: React.Ref<NumericKeypadRef>) {
  const [input, setInput] = useState("");
  const BKButton = ({ item }: { item: number | string }) => {
    const [isPressed, setIsPressed] = useState(false);
    const style: StyleProp<ViewStyle> = [styles.center];

    const handlePressIn = () => setIsPressed(true);
    const handlePressOut = () => setIsPressed(false);

    useImperativeHandle(ref, () => ({
      setInput,
    }))

    if (btnList.includes(item)) {
      style.push(styles.itemBtn);
    }
    if (operatorBtnList.includes(item + "")) style.push(styles.operatorBtn);
    if (["取消", "删除", "再记", "=", "完成"].includes(item + ""))
      style.push(styles.funBtn);
    if (item === "=" || item === "完成") style.push(styles.finishBtnColor);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onPress(item)}
        style={[style, isPressed && styles.pressedBtn]}
      >
        <Text style={styles.btnText}>{item}</Text>
      </TouchableOpacity>
    );
  };
  const onPress = (value: number | string) => {
    // 处理不同按钮的点击逻辑
    if (value === "删除") {
      setInput((prev) => prev.slice(0, -1));
    } else if (value === "取消") {
      setInput("");
    } else if (value === "再记") {
    } else if (value === "完成") {
      props.onCompleted(input);
    } else if (value === "=") {
      try {
        const result = eval(
          input.replaceAll("x", "*").replaceAll("÷", "/")
        ).toString();
        setInput(result);
      } catch (error) {
        console.log(error);
        Alert.alert("警告", "数据异常");
      }
    } else {
      setInput((prev) => prev + value);
    }
  };

  const getLastBtnLabel = (str: string) => {
    if (!str) return "取消";
    if (/[\+\-x\÷]/.test(str)) return "=";
    return "完成";
  };

  return (
    <>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{input || "0"}</Text>
      </View>
      <View style={styles.container}>
        {/* 数字键盘 */}
        <View style={styles.left}>
          {btnList.map((item, index) => (
            <BKButton key={index} item={item} />
          ))}
        </View>
        <View style={[styles.right]}>
          <BKButton item={"删除"} />
          <View
            style={[styles.itemBtn, styles.funBtn, styles.operatorContainer]}
          >
            {operatorBtnList.map((item, index) => (
              <BKButton key={index} item={item} />
            ))}
          </View>
          <BKButton item={getLastBtnLabel(input)} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 5,
    padding: 7,
    fontWeight: "bold",
  },
  displayContainer: {
    marginHorizontal: 7,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "flex-end",
  },
  displayText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  left: {
    flexWrap: "wrap",
    flexDirection: "row",
    flex: 3,
    gap: 5,
    width: "100%",
  },
  right: {
    flex: 1,
    gap: 5,
  },
  itemBtn: {
    height: 50,
    backgroundColor: "#ffffffff",
    flex: 1,
    minWidth: Platform.select({
      android: "20%", // Android专用值
      web: "30%", // Web专用值
      default: "23%", // 其他平台默认值
    }),
    borderRadius: 5,
  },
  funBtn: {
    height: 50,
    backgroundColor: "#eae9e7",
    borderRadius: 5,
  },
  operatorContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    flex: 2,
    gap: 5,
  },
  operatorBtn: {
    minWidth: "45%",
    flex: 1,
    height: 50,
    borderRadius: 5,
  },
  finishBtnColor: {
    backgroundColor: "#53a456",
  },
  btnText: {
    fontSize: 18,
    fontWeight: "500",
  },
  pressedBtn: {
    backgroundColor: "#e0e0e0",
    transform: [{ scale: 0.95 }],
  },
});

export default forwardRef(NumericKeypad);