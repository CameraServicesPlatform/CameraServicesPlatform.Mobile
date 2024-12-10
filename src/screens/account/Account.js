import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Account = ({ navigation }) => {
  const handleNavigate = (screen) => {
    navigation.navigate(screen); // Điều hướng đến màn hình tương ứng
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tài khoản của bạn</Text>
      <TouchableOpacity style={styles.item} onPress={() => handleNavigate('AccountDetails')}>
        <Text style={styles.itemText}>Tài khoản</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => handleNavigate('Reviews')}>
        <Text style={styles.itemText}>Đánh giá</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => handleNavigate('OrderHistory')}>
        <Text style={styles.itemText}>Lịch sử đơn hàng</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => handleNavigate('SavedDataScreen')}>
        <Text style={styles.itemText}>Lịch sử đơn hàng đang giao dịch</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => handleNavigate('Reports')}>
        <Text style={styles.itemText}>Báo cáo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 3, // Hiệu ứng đổ bóng
  },
  itemText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default Account;
