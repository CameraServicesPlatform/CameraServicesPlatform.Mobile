import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';

const OrderConfirmation = ({ route }) => {
  const { productID, voucherID, shippingAddress, deliveryMethod, supplierID } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const handleCompleteOrder = async () => {
    setLoading(true);
    const accountID = await AsyncStorage.getItem('accountId'); // Lấy accountID từ AsyncStorage
    if (!accountID) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin tài khoản.');
      setLoading(false);
      return;
    }

    const orderPayload = {
      supplierID: supplierID || '', // Đảm bảo supplierID được gửi
      accountID: accountID,
      vourcherID: voucherID || '',
      productID,
      orderDate: new Date().toISOString(),
      orderStatus: 0,
      totalAmount: 0,
      orderType: 0, // Đặt hàng mua
      shippingAddress: shippingAddress || '',
      deliveryMethod: deliveryMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      console.log('Payload gửi đi:', JSON.stringify(orderPayload, null, 2));
      const response = await fetch('http://14.225.220.108:2602/order/create-order-buy-with-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const textResponse = await response.text();
      const data = JSON.parse(textResponse);

      if (response.ok && data?.result) {
        setApiResponse(data.result); // Lưu đường link trả về

        // Lưu dữ liệu vào mảng trong AsyncStorage
        const newEntry = {
          productName: productID,
          paymentLink: data.result,
          timestamp: new Date().toISOString(),
        };

        const savedData = JSON.parse(await AsyncStorage.getItem('savedData')) || [];
        const updatedData = [newEntry, ...savedData].slice(0, 10); // Giới hạn tối đa 10 mục
        await AsyncStorage.setItem('savedData', JSON.stringify(updatedData));

        Alert.alert('Thành công', 'Đơn hàng đã được tạo thành công!');
      } else {
        console.error('Lỗi khi tạo đơn hàng:', data.messages || 'Lỗi không xác định.');
        Alert.alert('Lỗi', 'Không thể tạo đơn hàng.');
      }
    } catch (error) {
      console.error('Lỗi khi gửi đơn hàng:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi gửi đơn hàng.');
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
      <Text style={styles.text}>Phương thức giao hàng: {deliveryMethod === 0 ? 'Nhận tại cửa hàng' : 'Giao hàng tận nơi'}</Text>
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
