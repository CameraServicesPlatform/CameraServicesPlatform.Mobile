import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ORDER_STATUS_MAP = [
  'Pending',
  'Approved',
  'Completed',
  'Placed',
  'Shipped',
  'PaymentFail',
  'Canceling',
  'Cancelled',
  'Payment',
  'PendingRefund',
  'Refund',
  'DepositReturn',
  'Extend',
];

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const accountID = await AsyncStorage.getItem('accountId');
        if (!accountID) {
          console.error('Không tìm thấy accountID');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://14.225.220.108:2602/order/get-order-of-account?AccountID=${accountID}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.isSuccess && data.result) {
          // Sắp xếp đơn hàng theo ngày gần nhất
          const sortedOrders = data.result.sort(
            (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
          );
          setOrders(sortedOrders);
        } else {
          console.error('Dữ liệu không hợp lệ:', data.messages);
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderOrder = ({ item }) => {
    const orderStatus = ORDER_STATUS_MAP[item.orderStatus] || 'Không xác định';
    const orderType = item.orderType === 0 ? 'Nhận tại cửa hàng' : 'Giao hàng';
    const orderDate = new Date(item.orderDate).toLocaleString(); // Hiển thị ngày tạo đơn hàng
    const periodRental =
      item.orderDetails.length > 0 && item.orderDetails[0].periodRental
        ? new Date(item.orderDetails[0].periodRental).toLocaleString()
        : null; // Xử lý periodRental

    return (
      <View style={styles.orderContainer}>
        <Text style={styles.text}>
          <Text style={styles.label}>Mã đơn hàng: </Text>
          {item.orderID}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Trạng thái: </Text>
          {orderStatus}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Tổng tiền: </Text>
          {item.totalAmount} VND
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Loại đơn hàng: </Text>
          {orderType}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Ngày tạo: </Text>
          {orderDate}
        </Text>
        {periodRental && (
          <Text style={styles.text}>
            <Text style={styles.label}>Ngày thuê: </Text>
            {periodRental}
          </Text>
        )}
        <Button
          title="Xem chi tiết"
          onPress={() => {
            console.log(`Xem chi tiết đơn hàng: ${item.orderID}`);
            // Thực hiện hành động khi nhấn nút
          }}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Đang tải dữ liệu đơn hàng...</Text>
      </View>
    );
  }

  if (!orders.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không có đơn hàng nào.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.orderID}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  list: {
    paddingBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
  },
  orderContainer: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
});

export default OrderHistory;
