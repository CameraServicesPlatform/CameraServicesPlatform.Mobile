import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const OrderDetail = ({ route }) => {
  const { orderID } = route.params;
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await fetch(
          `http://14.225.220.108:2602/order/get-order-of-account-by-order-id?OrderID=${orderID}`
        );
        const data = await response.json();
        if (data.isSuccess) {
          setOrderDetail(data.result[0]);
        } else {
          throw new Error(data.messages || "Failed to fetch order details");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [orderID]);
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
        <Text style={styles.errorText}>Error: {error || "Order details not found."}</Text>
      </View>
    );
  }
  const {
    orderID: orderId,
    iD,
    orderDate,
    totalAmount,
    orderStatus,
    orderDetails = [],
    deposit,
    reservationMoney,
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
        <Text style={styles.text}>Ngày đặt: {new Date(orderDate).toLocaleDateString() || "N/A"}</Text>
        {orderType === 1 && (
          <>
            <Text style={styles.text}>Ngày nhận: {new Date(rentalStartDate).toLocaleDateString() || "N/A"}</Text>
            <Text style={styles.text}>Ngày kết thúc: {new Date(rentalEndDate).toLocaleDateString() || "N/A"}</Text>
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
        {orderType === 1 && (
          <TouchableOpacity style={[styles.button, styles.buttonPrimary]}>
            <Text style={styles.buttonText}>Gia hạn đơn thuê</Text>
          </TouchableOpacity>
        )}
        {orderType === 0 && (
          <TouchableOpacity style={[styles.button, styles.buttonSecondary]}>
            <Text style={styles.buttonText}>Quay lại trang chủ</Text>
          </TouchableOpacity>
        )}
         {/* {orderStatus === 2 && (
        <TouchableOpacity style={[styles.button, styles.buttonDanger]}>
          <Text style={styles.buttonText}>Đánh giá</Text>
        </TouchableOpacity>
         )} */}
         <TouchableOpacity
          style={[styles.button, styles.buttonDanger]}
          onPress={() => navigation.navigate('RatingProduct', {
            productID: orderDetails[0]?.productID, 
            accountID: iD, 
          })}
        >
          <Text style={styles.buttonText}>Đánh giá</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  statusContainer: { alignItems: "center", marginVertical: 16 },
  statusText: { fontSize: 16, color: "#4caf50", fontWeight: "bold" },
  orderInfoSection: { backgroundColor: "#fff", padding: 16, borderRadius: 8, marginBottom: 16, elevation: 3 },
  orderSummary: { borderWidth: 2, padding: 15, marginBottom: 4 },
  productInfoSection: { backgroundColor: "#fff", padding: 16, borderRadius: 8, marginBottom: 16, elevation: 3 },
  text: { fontSize: 17, marginBottom: 8 },
  text1: { fontSize: 16, marginBottom: 4, textAlign: "center"},
  subTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8, textAlign: "center" },
  total: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginVertical: 16 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
  button: { flex: 1, padding: 12, borderRadius: 8, marginBottom: 4, marginHorizontal: 4, alignItems: "center" },
  buttonPrimary: { backgroundColor: "#007bff" },
  buttonSecondary: { backgroundColor: "#6c757d" },
  buttonDanger: { backgroundColor: "#007bff" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, marginTop: 10, color: "#555" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "red" },
});
export default OrderDetail;