import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import thư viện icon

const Account = ({ navigation }) => {
  const handleNavigate = (screen) => {
    navigation.navigate(screen); // Điều hướng đến màn hình tương ứng
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tài khoản của bạn</Text>
      
      <TouchableOpacity style={styles.item} onPress={() => handleNavigate('AccountDetails')}>
        <Ionicons name="person-circle" size={24} color="black" style={styles.icon} />
        <Text style={styles.itemText}>Tài khoản</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.item} onPress={() => handleNavigate('Reviews')}>
        <Ionicons name="star" size={24} color="black" style={styles.icon} />
        <Text style={styles.itemText}>Đánh giá</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.item} onPress={() => handleNavigate('OrderHistory')}>
        <Ionicons name="document-text" size={24} color="black" style={styles.icon} />
        <Text style={styles.itemText}>Lịch sử đơn hàng</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.item} onPress={() => handleNavigate('SavedDataScreen')}>
        <Ionicons name="cart" size={24} color="black" style={styles.icon} />
        <Text style={styles.itemText}>Lịch sử đơn hàng đang giao dịch</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.item} onPress={() => handleNavigate('Reports')}>
        <Ionicons name="bar-chart" size={24} color="black" style={styles.icon} />
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
    flexDirection: 'row', // Đặt các phần tử theo hàng ngang
    alignItems: 'center', // Căn giữa icon và text theo chiều dọc
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 3, // Hiệu ứng đổ bóng
  },
  icon: {
    marginRight: 10, // Khoảng cách giữa icon và text
  },
  itemText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default Account;
