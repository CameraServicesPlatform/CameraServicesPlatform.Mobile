import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ORDER_STATUS_MAP = {
  0: { label: "Đang xử lý", color: "#ff9900" },
  1: { label: "Đã phê duyệt", color: "#007bff" },
  2: { label: "Hoàn thành", color: "#28a745" },
  3: { label: "Đã đặt", color: "#17a2b8" },
  4: { label: "Đã giao hàng", color: "#6f42c1" },
  5: { label: "Thanh toán thất bại", color: "#dc3545" },
  6: { label: "Đang hủy", color: "#ffc107" },
  7: { label: "Đã hủy", color: "#dc3545" },
  8: { label: "Đã thanh toán", color: "#20c997" },
  9: { label: "Đang hoàn tiền", color: "#ff9800" },
  10: { label: "Đã hoàn tiền", color: "#4caf50" },
  11: { label: "Trả cọc", color: "#9c27b0" },
  12: { label: "Gia hạn", color: "#3f51b5" },
  default: { label: "Không xác định", color: "#555" },
};

const OrderHistory = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState('ALL');
  const [sortType, setSortType] = useState('NEWEST');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const accountID = await AsyncStorage.getItem('accountId');
        if (!accountID) {
          console.error('Không tìm thấy accountID trong AsyncStorage');
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
          setOrders(data.result);
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

  const isRentalOrder = (order) => {
    if (!order.orderDetails || order.orderDetails.length === 0) return false;
    return order.orderDetails.some((detail) => detail.periodRental);
  };

  const filteredOrders = orders.filter((order) => {
    // Filter by type
    if (filterType !== 'ALL') {
      const rental = isRentalOrder(order);
      if (filterType === 'RENT' && !rental) return false;
      if (filterType === 'BUY' && rental) return false;
    }

    // Filter by status
    if (filterStatus !== 'ALL') {
      return order.orderStatus.toString() === filterStatus;
    }

    return true;
  });

  const sortedOrders = filteredOrders.sort((a, b) => {
    const dateA = new Date(a.orderDate).getTime();
    const dateB = new Date(b.orderDate).getTime();
    return sortType === 'NEWEST' ? dateB - dateA : dateA - dateB;
  });

  const renderOrder = ({ item }) => {
    const orderStatus =
      ORDER_STATUS_MAP[item.orderStatus] || ORDER_STATUS_MAP.default;
    const orderType = item.orderType === 0 ? 'Nhận tại cửa hàng' : 'Giao hàng';
    const orderDate = new Date(item.orderDate).toLocaleString();

    return (
      <View style={styles.orderContainer}>
        <Text style={styles.text}>
          <Text style={styles.label}>Mã đơn hàng: </Text>
          {item.orderID}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Trạng thái: </Text>
          <Text style={{ color: orderStatus.color }}>{orderStatus.label}</Text>
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
        <Button
          title="Xem chi tiết"
          onPress={() =>
            navigation.navigate('OrderDetail', { orderID: item.orderID })
          }
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

  // if (!sortedOrders.length) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.errorText}>Không có đơn hàng nào.</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <View style={styles.dropdownRow}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Loại đơn hàng:</Text>
          <Picker
            selectedValue={filterType}
            onValueChange={(val) => setFilterType(val)}
            style={styles.picker}
          >
            <Picker.Item label="Tất cả" value="ALL" />
            <Picker.Item label="Mua" value="BUY" />
            <Picker.Item label="Thuê" value="RENT" />
          </Picker>
        </View>

        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Trạng thái:</Text>
          <Picker
            selectedValue={filterStatus}
            onValueChange={(val) => setFilterStatus(val)}
            style={styles.picker}
          >
            <Picker.Item label="Tất cả" value="ALL" />
            {Object.entries(ORDER_STATUS_MAP).map(([key, value]) => (
              <Picker.Item key={key} label={value.label} value={key} />
            ))}
          </Picker>
        </View>

        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Sắp xếp:</Text>
          <Picker
            selectedValue={sortType}
            onValueChange={(val) => setSortType(val)}
            style={styles.picker}
          >
            <Picker.Item label="Mới nhất" value="NEWEST" />
            <Picker.Item label="Cũ nhất" value="OLDEST" />
          </Picker>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : sortedOrders.length ? (
        <FlatList
          data={sortedOrders}
          keyExtractor={(item) => item.orderID}
          renderItem={renderOrder}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.errorText}>Không có đơn hàng nào phù hợp với bộ lọc.</Text>
      )}
    </View>
  );
};

export default OrderHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dropdownContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  dropdownLabel: {
    marginBottom: 5,
    fontWeight: '600',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 3,
  },
  orderContainer: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
  },
  label: {
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'red',
  },
});
