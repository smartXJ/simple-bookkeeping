
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Transaction = {
  id: string;
  date: string; // 原始格式 yyyy-mm-dd HH:MM:ss
  category: string;
  subCategory: string;
  amount: number;
  note?: string;
  type: 'income' | 'expense';
};

const AccountBook = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 格式化日期显示
  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今天 ' + ['周日','周一','周二','周三','周四','周五','周六'][date.getDay()];
    if (diffDays === 1) return '昨天 ' + ['周日','周一','周二','周三','周四','周五','周六'][date.getDay()];

    return `${date.getMonth()+1}月${date.getDate()}日 ${['周日','周一','周二','周三','周四','周五','周六'][date.getDay()]}`;
  };

  // 计算每日汇总
  const calculateDailySummary = (transactions: Transaction[]) => {
    const summary: Record<string, { income: number; expense: number }> = {};
    
    transactions.forEach(t => {
      const dateKey = t.date.split(' ')[0]; // 取日期部分
      if (!summary[dateKey]) {
        summary[dateKey] = { income: 0, expense: 0 };
      }
      
      if (t.type === 'income') {
        summary[dateKey].income += t.amount;
      } else {
        summary[dateKey].expense += t.amount;
      }
    });
    
    return summary;
  };

  // 模拟数据（包含完整日期时间）
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      date: '2023-08-27 18:30:45',
      category: '食品餐饮',
      subCategory: '晚餐',
      amount: 13.82,
      note: '米厨',
      type: 'expense'
    },
    {
      id: '2',
      date: '2023-08-27 12:15:22',
      category: '食品餐饮',
      subCategory: '午餐',
      amount: 12.00,
      type: 'expense'
    },
    {
      id: '3',
      date: '2023-08-26 19:45:30',
      category: '食品餐饮',
      subCategory: '晚餐',
      amount: 16.90,
      note: '干蒸排骨',
      type: 'expense'
    },
    {
      id: '4',
      date: '2023-08-26 10:20:15',
      category: '居家生活',
      subCategory: '话费宽带',
      amount: 97.60,
      note: '优惠 2.4',
      type: 'expense'
    }
  ];

  // 加载更多数据
  const loadMoreTransactions = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newData = [...mockTransactions].map((t, i) => ({
      ...t,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: `2023-08-${26 - page} ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60)}`
    }));
    
    setTransactions(prev => [...prev, ...newData]);
    setPage(prev => prev + 1);
    setHasMore(page < 3);
    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadMoreTransactions();
  }, []);

  // 渲染单个交易项
  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <Text style={styles.transactionCategory}>{item.category}-{item.subCategory}</Text>
        {item.note && <Text style={styles.transactionNote}>{item.note}</Text>}
      </View>
      <Text style={[styles.transactionAmount, item.type === 'expense' ? styles.expense : styles.income]}>
        {item.type === 'expense' ? '-' : '+'}{item.amount.toFixed(2)}
      </Text>
    </View>
  );

  // 将数据按日期分组
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const displayDate = formatDisplayDate(transaction.date);
    const existingGroup = acc.find(group => group.title === displayDate);
    
    if (existingGroup) {
      existingGroup.data.push(transaction);
    } else {
      acc.push({ title: displayDate, data: [transaction] });
    }
    return acc;
  }, [] as { title: string; data: Transaction[] }[]);

  // 计算每日汇总
  const dailySummary = calculateDailySummary(transactions);

  return (
    <View style={styles.container}>
      {/* 顶部概览 */}
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.overviewContainer}>
				<View style={styles.overviewTop}>
        <View style={styles.overviewItem}>
          <Text style={styles.overviewLabel}>本月收入</Text>
          <Text style={styles.overviewValue}>10,927.14</Text>
        </View>
        <View style={styles.overviewItem}>
          <Text style={styles.overviewLabel}>本月结余</Text>
          <Text style={styles.overviewValue}>8,921.47</Text>
        </View>
        <View style={styles.overviewItem}>
          <Text style={styles.overviewLabel}>剩余预算</Text>
          <TouchableOpacity>
            <Text style={styles.overviewValue}>点击设置</Text>
          </TouchableOpacity>
        </View>
				</View>
        <View style={styles.overviewItem}>
          <Text style={styles.overviewLabel}>本月支出</Text>
          <Text style={styles.overviewValue}>2,005.67</Text>
        </View>
      </LinearGradient>

      {/* 记账列表 */}
      <FlatList
        data={groupedTransactions}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        renderItem={({ item }) => {
          const dateKey = item.data[0].date.split(' ')[0];
          const summary = dailySummary[dateKey] || { income: 0, expense: 0 };
          
          return (
            <View>
              <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionHeader}>{item.title}</Text>
                <View style={styles.dailySummary}>
									<Text>收</Text>
                  <Text style={styles.income}>{summary.income.toFixed(2)}</Text>
									<Text>支</Text>
                  <Text style={[styles.expense]}>{summary.expense.toFixed(2)}</Text>
                </View>
              </View>
              <FlatList
                data={item.data}
                renderItem={renderItem}
                keyExtractor={transaction => transaction.id}
              />
            </View>
          );
        }}
        onEndReached={loadMoreTransactions}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          loading ? <ActivityIndicator size="large" color="#4c669f" /> : null
        )}
        contentContainerStyle={styles.listContainer}
      />

      {/* 添加按钮 */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>添加一条新记账</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  overviewContainer: {
    padding: 20,
    borderRadius: 10,
    margin: 10,
  },
	overviewTop: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		elevation: 3,
		marginBottom: 15,
	},
  overviewItem: {
    // width: '48%',
  },
  overviewLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  overviewValue: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  listContainer: {
    paddingBottom: 80,
  },
  sectionHeaderContainer: {
    // backgroundColor: '#eaeaea',
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 14,
    color: '#333',
		fontWeight: 600
  },
  dailySummary: {
    flexDirection: 'row',
    gap: 10,
		fontSize: 13,
		color: '#666',
  },
	// dailySummaryIncomeAmt: {
	// 	color: '#7cb5a2'
	// },
	// dailySummaryExpenseAmt: {
	// 	color: '#de8d93'
	// },
  transactionItem: {
    backgroundColor: 'white',
    padding: 12,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#333',
  },
  transactionNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 14,
  },
  expense: {
    color: '#ff4757',
  },
  income: {
    color: '#69b49bff',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4c669f',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default AccountBook;
