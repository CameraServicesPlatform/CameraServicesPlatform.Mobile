import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Thêm thư viện Picker
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

const OrderHistory = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // filterType: ALL | BUY | RENT
  const [filterType, setFilterType] = useState('ALL');
  // sortType: NEWEST | OLDEST
  const [sortType, setSortType] = useState('NEWEST');

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

  // Xác định đơn hàng là thuê hay mua
  const isRentalOrder = (order) => {
    if (!order.orderDetails || order.orderDetails.length === 0) return false;
    // Nếu có ít nhất 1 detail có periodRental => đơn hàng thuê
    return order.orderDetails.some((detail) => detail.periodRental);
  };

  // 1) Lọc
  const filteredOrders = orders.filter((order) => {
    if (filterType === 'ALL') return true;
    const rental = isRentalOrder(order);
    if (filterType === 'RENT') {
      return rental === true;  // chỉ giữ đơn hàng thuê
    } else if (filterType === 'BUY') {
      return rental === false; // chỉ giữ đơn hàng mua
    }
    return true;
  });

  // 2) Sắp xếp (theo ngày orderDate)
  const sortedOrders = filteredOrders.sort((a, b) => {
    const dateA = new Date(a.orderDate).getTime();
    const dateB = new Date(b.orderDate).getTime();
    if (sortType === 'NEWEST') {
      return dateB - dateA; // Mới nhất
    } else {
      return dateA - dateB; // Cũ nhất
    }
  });

  const renderOrder = ({ item }) => {
    const orderStatus = ORDER_STATUS_MAP[item.orderStatus] || 'Không xác định';
    const orderType = item.orderType === 0 ? 'Nhận tại cửa hàng' : 'Giao hàng';
    const orderDate = new Date(item.orderDate).toLocaleString();

    // periodRental để hiển thị ngày thuê (nếu có)
    let periodRentalDisplay = null;
    if (item.orderDetails && item.orderDetails.length > 0) {
      const detail = item.orderDetails[0];
      if (detail.periodRental) {
        periodRentalDisplay = new Date(detail.periodRental).toLocaleString();
      }
    }

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
        {/* Chỉ hiển thị periodRental nếu có */}
        {periodRentalDisplay && (
          <Text style={styles.text}>
            <Text style={styles.label}>Ngày thuê: </Text>
            {periodRentalDisplay}
          </Text>
        )}
        <Button
        title="Xem chi tiết"
        onPress={() => {
          // Điều hướng sang OrderDetail, kèm orderID
          navigation.navigate('OrderDetail', { orderID: item.orderID });
        }}
      />
      </View>
    );
  };

  // Màn hình loading
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Đang tải dữ liệu đơn hàng...</Text>
      </View>
    );
  }

  // Không có đơn hàng
  if (!sortedOrders.length) {
    return (
      <View style={styles.container}>
        {/* Dropdown lọc */}
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

          {/* Dropdown sắp xếp */}
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

        <Text style={styles.errorText}>Không có đơn hàng nào.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Dropdown filter & sort */}
      <View style={styles.dropdownRow}>
        {/* Lọc Mua/Thuê/Tất cả */}
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

        {/* Sắp xếp Mới nhất / Cũ nhất */}
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

      {/* Danh sách đơn hàng */}
      <FlatList
        data={sortedOrders}
        keyExtractor={(item) => item.orderID}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
      />
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
    marginRight: 10, // chút khoảng cách giữa 2 dropdown
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
    marginTop: 10,
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
    marginBottom: 6,
  },
  label: {
    fontWeight: 'bold',
  },
});
