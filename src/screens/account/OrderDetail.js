import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Button, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OrderDetail = ({ route }) => {
  const { orderID } = route.params;
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelMessage, setCancelMessage] = useState('');  // New state for cancel message
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  const fetchOrderDetail = async () => {
    try {
      const response = await fetch(`http://14.225.220.108:2602/order/get-order-of-account-by-order-id?OrderID=${orderID}`);
      const data = await response.json();
      if (data.isSuccess) {
        setOrderDetail(data.result[0]);
      } else {
        throw new Error(data.messages || 'Failed to fetch order details');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderID]);

  const reloadOrderDetails = () => {
    setLoading(true);
    setError(null);
    fetchOrderDetail();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (error || !orderDetail) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error || 'Order details not found.'}</Text>
      </View>
    );
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Không có dữ liệu';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const {
    orderID: orderId,
    iD,
    orderDate,
    totalAmount,
    orderStatus,
    orderDetails = [],
    deposit,
    reservationMoney,
    returnDate,
    rentalStartDate,
    rentalEndDate,
    orderType,
  } = orderDetail;

  const orderStatusReturnMapping = {
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

  const statusInfo = orderStatusReturnMapping[orderStatus] || orderStatusReturnMapping.default;

  const handlePickup = async () => {
    try {
      const response = await fetch(`http://14.225.220.108:2602/order/update-order-status-placed/${orderID}`, {
        method: 'PUT',
      });
      if (response.ok) {
        Alert.alert('Thành công', 'Trạng thái đã được cập nhật thành công.');
        reloadOrderDetails();
      } else {
        throw new Error('Cập nhật trạng thái thất bại.');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái.');
    }
  };

  const handleReturn = async () => {
    const returnDate = new Date().toISOString();
    const body = { orderID, returnDate, condition: "" };

    try {
      const response = await fetch('http://14.225.220.108:2602/returnDetail/create-return-for-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        Alert.alert('Thành công', 'Đã tạo yêu cầu trả hàng thành công.');
        reloadOrderDetails();
      } else {
        throw new Error('Tạo yêu cầu trả hàng thất bại.');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      Alert.alert('Lỗi', 'Không thể tạo yêu cầu trả hàng.');
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelMessage.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập lý do hủy đơn hàng.');
      return;
    }

    const body = {
      orderID,
      cancelMessage,
    };

    try {
      const response = await fetch('http://14.225.220.108:2602/order/cancel-order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        Alert.alert('Thành công', 'Đơn hàng đã được hủy.');
        reloadOrderDetails();
        setIsModalVisible(false);  // Đóng modal
      } else {
        throw new Error('Không thể hủy đơn hàng.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể hủy đơn hàng.');
    }
  };

  const handleExtend = () => {
    // Ensure you pass all necessary params to the navigation
    navigation.navigate('OrderExtend', {
      orderID,
      rentalStartDate,
      rentalEndDate,
      returnDate,
      orderStatus,
      orderType,
      product: orderDetails[0],  // Example of passing product data
    });
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chi tiết Đơn Hàng</Text>
      <View style={[styles.orderSummary, { borderColor: statusInfo.color }]}>
        <Text style={[styles.text1, { color: statusInfo.color }]}>
          Trạng thái đơn hàng: {statusInfo.label}
        </Text>
      </View>
      <View style={styles.orderInfoSection}>
        <Text style={styles.text}>Hóa đơn: {orderId || "N/A"}</Text>
        <Text style={styles.text}>Loại hóa đơn: {orderType === 1 ? "Thuê" : "Mua"}</Text>
        <Text style={styles.text}>Ngày đặt: {formatDateTime(orderDate) || "N/A"}</Text>
        {orderType === 1 && (
          <>
            <Text style={styles.text}>Ngày nhận: {formatDateTime(rentalStartDate) || "N/A"}</Text>
            <Text style={styles.text}>Ngày kết thúc: {formatDateTime(rentalEndDate) || "N/A"}</Text>
            <Text style={styles.text}>Ngày trả: {formatDateTime(returnDate) || "N/A"}</Text>
          </>
        )}
      </View>
      <View style={styles.productInfoSection}>
        <Text style={styles.subTitle}>Thông tin sản phẩm</Text>
        <Text style={styles.text}>Tên sản phẩm: {orderDetails[0]?.productName || "N/A"}</Text>
        <Text style={styles.text}>Mã sản phẩm: {orderDetails[0]?.serialNumber || "N/A"}</Text>
        <Text style={styles.text}>Giá: {orderDetails[0]?.productPrice?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "N/A"}</Text>
        {orderType === 1 && (
          <>
            <Text style={styles.text}>Tiền cọc: {deposit?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "N/A"}</Text>
            <Text style={styles.text}>Giữ chỗ: {reservationMoney?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "N/A"}</Text>
          </>
        )}
        <Text style={styles.text}>Giảm giá: {orderDetails[0]?.discount || 0}%</Text>
      </View>
      <Text style={styles.total}>Tổng cộng: {totalAmount?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "N/A"}</Text>
      <View style={styles.buttonContainer}>
        {/* Extend rental button */}
        {orderType === 1 && (
          <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleExtend}>
            <Text style={styles.buttonText}>Gia hạn đơn thuê</Text>
          </TouchableOpacity>
        )}

        {/* Review button (if order status is 'Completed') */}
        {orderStatus === 2 && (
          <TouchableOpacity
            style={[styles.button, styles.buttonDanger]}
            onPress={() => navigation.navigate('RatingProduct', {
              productID: orderDetails[0]?.productID,
              accountID: iD,
            })}
          >
            <Text style={styles.buttonText}>Đánh giá</Text>
          </TouchableOpacity>
        )}

        {/* Return product button (if order status is 'Shipped' and order type is 'Purchase') */}
        {orderStatus === 2 && orderType === 0 && (
          <TouchableOpacity style={[styles.button, styles.buttonReturn]} onPress={handleReturn}>
            <Text style={styles.buttonText}>Trả hàng</Text>
          </TouchableOpacity>
        )}

        {/* Cancel order button */}
        {orderStatus === 0 && (
        <TouchableOpacity
          style={[styles.button, styles.buttonCancel]}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.buttonText}>Hủy đơn hàng</Text>
        </TouchableOpacity>
                )}
      </View>
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Lý do hủy đơn hàng</Text>
            <TextInput
              style={styles.modalInput}
              value={cancelMessage}
              onChangeText={setCancelMessage}
              placeholder="Nhập lý do hủy"
              multiline
            />
            <View style={styles.modalButtons}>
              <Button title="Hủy" onPress={() => setIsModalVisible(false)} />
              <Button title="Xác nhận" onPress={handleCancelOrder} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  orderSummary: { borderWidth: 2, padding: 15, marginBottom: 4 },
  orderInfoSection: { backgroundColor: "#fff", padding: 16, borderRadius: 8, marginBottom: 16, elevation: 3 },
  productInfoSection: { backgroundColor: "#fff", padding: 16, borderRadius: 8, marginBottom: 16, elevation: 3 },
  text: { fontSize: 17, marginBottom: 8 },
  text1: { fontSize: 16, marginBottom: 4, textAlign: "center" },
  subTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8, textAlign: "center" },
  total: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginVertical: 16 },
  buttonContainer: {
    flexDirection: 'column',
    marginTop: 20,
  },
  button: {
    marginBottom: 10, // Ensures spacing between buttons
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#007bff',
  },
  buttonDanger: {
    backgroundColor: '#dc3545',
  },
  buttonReturn: {
    backgroundColor: '#28a745',
  },
  buttonCancel: {
    backgroundColor: '#ffc107',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, marginTop: 10, color: "#555" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "red" },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    padding: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default OrderDetail;
