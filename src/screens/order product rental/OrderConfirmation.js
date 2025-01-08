import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';

const OrderConfirmation = ({ route }) => {
  const {
    productID,
    voucherID,
    shippingAddress,
    deliveryMethod,
    supplierID,
    startDate,
    endDate,
    returnDate,
    productPriceRent,
    totalPrice,
    durationUnit,
    durationValue,
    shippingMethod,
  } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const fetchReservationMoney = async () => {
    try {
      const response = await fetch('http://14.225.220.108:2602/SystemAdmin/get-new-reservation-money');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.isSuccess && data.result) {
        return data.result.reservationMoney;
      } else {
        throw new Error(data.messages?.[0] || 'Không thể lấy giá trị reservationMoney');
      }
    } catch (error) {
      console.error('Lỗi khi lấy reservationMoney:', error);
      throw error;
    }
  };

  const handleCompleteOrder = async () => {
    setLoading(true);
    const accountID = await AsyncStorage.getItem('accountId');
    if (!accountID) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin tài khoản.');
      setLoading(false);
      return;
    }

    // Chuyển đổi durationUnit từ chuỗi sang số
    let durationUnitValue;
    switch (durationUnit) {
      case 'hour':
        durationUnitValue = 0;
        break;
      case 'day':
        durationUnitValue = 1;
        break;
      case 'week':
        durationUnitValue = 2;
        break;
      case 'month':
        durationUnitValue = 3;
        break;
      default:
        durationUnitValue = null;
        break;
    }

    if (durationUnitValue === null) {
      Alert.alert('Lỗi', 'Đơn vị thời gian không hợp lệ.');
      setLoading(false);
      return;
    }

    try {
      const reservationMoney = await fetchReservationMoney();

      const orderPayload = {
        supplierID: supplierID || '',
        accountID: accountID,
        productID,
        productPriceRent: productPriceRent || 0,
        voucherID: voucherID || '',
        orderStatus: 0,
        totalAmount: totalPrice || 0,
        orderType: 0, // Đặt hàng thuê
        shippingAddress: shippingAddress || '',
        deposit: totalPrice - productPriceRent, // Giá cọc
        rentalStartDate: startDate,
        rentalEndDate: endDate,
        durationUnit: durationUnitValue,
        durationValue: durationValue,
        returnDate,
        deliveryMethod: shippingMethod,
        reservationMoney, // Giá trị từ API
      };

      console.log('Payload gửi đi:', JSON.stringify(orderPayload, null, 2));
      const response = await fetch('http://14.225.220.108:2602/order/create-order-rent-with-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const textResponse = await response.text();
      const data = JSON.parse(textResponse);

      if (response.ok && data?.result) {
        setApiResponse(data.result);

        const newEntry = {
          productName: productID,
          paymentLink: data.result,
          timestamp: new Date().toISOString(),
        };

        const savedData = JSON.parse(await AsyncStorage.getItem('savedData')) || [];
        const updatedData = [newEntry, ...savedData].slice(0, 10);
        await AsyncStorage.setItem('savedData', JSON.stringify(updatedData));

        Alert.alert('Thành công', 'Đơn hàng đã được tạo thành công!');
      } else {
        console.error('Lỗi khi tạo đơn hàng:', data.messages || 'Lỗi không xác định.');
        Alert.alert('Lỗi', 'Không thể tạo đơn hàng.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xử lý đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (apiResponse) {
      Linking.openURL(apiResponse).catch((err) =>
        Alert.alert('Lỗi', 'Không thể mở đường dẫn thanh toán: ' + err)
      );
    } else {
      Alert.alert('Thông báo', 'Không có đường dẫn thanh toán.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang xử lý đơn hàng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận Đơn hàng</Text>
      <Text style={styles.text}>Mã sản phẩm: {productID}</Text>
      <Text style={styles.text}>Phương thức giao hàng: {deliveryMethod === 0 ? 'Giao hàng tận nơi' : 'Nhận tại cửa hàng'}</Text>
      {deliveryMethod === 1 && (
        <Text style={styles.text}>Địa chỉ giao hàng: {shippingAddress}</Text>
      )}
      <Text style={styles.text}>Voucher: {voucherID || 'Không có'}</Text>
      <Text style={styles.text}>Nhà cung cấp: {supplierID}</Text>
      <Button title="Hoàn tất Đặt hàng" onPress={handleCompleteOrder} />
      {apiResponse && (
        <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
          <Text style={styles.paymentButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  paymentButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderConfirmation;
