import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Thêm thư viện Picker
import AsyncStorage from '@react-native-async-storage/async-storage';

const ORDER_STATUS_DETAILS = {
  0: { text: "Chờ xử lý", color: "blue", icon: "fa-hourglass-start" },
  1: { text: "Sản phẩm sẵn sàng được giao", color: "green", icon: "fa-check-circle" },
  2: { text: "Hoàn thành", color: "yellow", icon: "fa-clipboard-check" },
  3: { text: "Đã nhận sản phẩm", color: "purple", icon: "fa-shopping-cart" },
  4: { text: "Đã giao hàng", color: "cyan", icon: "fa-truck" },
  5: { text: "Thanh toán thất bại", color: "cyan", icon: "fa-money-bill-wave" },
  6: { text: "Đang hủy", color: "lime", icon: "fa-box-open" },
  7: { text: "Đã hủy thành công", color: "red", icon: "fa-times-circle" },
  8: { text: "Đã Thanh toán", color: "orange", icon: "fa-money-bill-wave" },
  9: { text: "Hoàn tiền đang chờ xử lý", color: "pink", icon: "fa-clock" },
  10: { text: "Hoàn tiền thành công", color: "brown", icon: "fa-undo" },
  11: { text: "Hoàn trả tiền đặt cọc", color: "gold", icon: "fa-piggy-bank" },
  12: { text: "Gia hạn", color: "violet", icon: "fa-calendar-plus" },
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
          `http://14.225.220.108:2602/order/get-order-of-account?AccountID=${accountID}&pageIndex=1&pageSize=10000`
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
    if (filterType !== 'ALL') {
      const rental = isRentalOrder(order);
      if (filterType === 'RENT' && !rental) return false;
      if (filterType === 'BUY' && rental) return false;
    }

    if (filterStatus !== 'ALL') {
      return order.orderStatus.toString() === filterStatus;
    }

    return true;
  });

  const sortedOrders = filteredOrders.sort((a, b) => {
    const dateA = new Date(a.orderDate).getTime();
    const dateB = new Date(b.orderDate).getTime();
    if (sortType === 'NEWEST') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  const renderOrder = ({ item }) => {
    const statusDetails = ORDER_STATUS_DETAILS[item.orderStatus] || {
      text: "Không xác định",
      color: "gray",
      icon: "fa-question-circle",
    };
    const orderType = item.orderType === 0 ? "Mua" : "Thuê";
    const orderDate = new Date(item.orderDate).toLocaleString();
    const rentalStartDateRaw = item.rentalEndDate;
    const rentalStartDate = new Date(item.rentalStartDate).toLocaleString(); 
    const rentalEndDate = new Date(item.rentalEndDate).toLocaleString();
    const returnDate = new Date(item.returnDate).toLocaleString(); 

    let periodRentalDisplay = null;
    if (item.orderDetails && item.orderDetails.length > 0) {
      const detail = item.orderDetails[0];
      if (detail.periodRental) {
        periodRentalDisplay = new Date(detail.periodRental).toLocaleString();
      }
    }

    return (
      <View style={[styles.orderContainer, { borderLeftColor: statusDetails.color, borderLeftWidth: 4 }]}>
        <Text style={styles.text}>
          <Text style={styles.label}>Mã đơn hàng: </Text>
          {item.orderID}
        </Text>
        <Text style={[styles.text, { color: statusDetails.color }]}>
          <Text style={styles.label}>Trạng thái: </Text>
          {statusDetails.text}
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
        {periodRentalDisplay && (
  <View style={styles.text}>
    <Text style={styles.label}>Ngày thuê: </Text>
    <Text>{rentalStartDate}</Text>
    <Text style={styles.label}>Ngày hết hạn thuê: </Text>
    <Text>{rentalEndDate}</Text>
    <Text style={styles.label}>Ngày trả thiết bị: </Text>
    <Text>{periodRentalDisplay}</Text>
  </View>
)}

        <Button
          title="Xem chi tiết"
          onPress={() => {
            navigation.navigate("OrderDetail", { orderID: item.orderID, ...item, // Truyền toàn bộ thông tin của đơn hàng hiện tại
              rentalStartDate, // Truyền Ngày thuê (nếu có)
              rentalStartDateRaw, // Truyền Ngày hết hạn thuê (nếu có)
              returnDate });
          }}
        />
      </View>
    );
  };

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
            {Object.entries(ORDER_STATUS_DETAILS).map(([key, value]) => (
              <Picker.Item key={key} label={value.text} value={key} />
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
