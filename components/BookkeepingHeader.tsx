/*
 * @Author: xiaojun
 * @Date: 2025-08-29 22:10:09
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-29 23:06:39
 * @Description: 页面介绍
 */
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function BookkeepingHeader(props: NativeStackHeaderProps) {
  const router = useRouter();

  // const [roeuteName, setRouteName] = useState()
  const isActive = (type: string) => {
    // 安卓拿不到state
    // console.log(props.route, 'props.route')
    // const state = (props.route as any).state
    // const routeNames: string[] = state.routeNames || state.routes.map((route: any) => route.name);
    // const index = state.index || 0
    // return routeNames[index].includes(type);
    return false
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>←</Text>
      </TouchableOpacity>
      <View style={styles.tabs}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: isActive('expense') ? '#5ab09d' : '' }}>支出</Text>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: isActive('income') ? '#5ab09d' : ''  }}>收入</Text>
      </View>
      <TouchableOpacity style={styles.headerButton}>
        <Text style={styles.buttonText}>编辑</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    justifyContent: 'space-between',
    flexDirection: "row",
  },
  tabs:{
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerButton: {
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
  },
});
