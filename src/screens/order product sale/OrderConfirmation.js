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
    startDate, 
    endDate, 
    returnDate, 
    totalPrice, 
    durationUnit, 
    durationValue 
  } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [voucherInfo, setVoucherInfo] = useState(null);
  const [voucherLoading, setVoucherLoading] = useState(true);
  const [supplierID, setSupplierID] = useState(''); // Lưu supplierID sau khi fetch product

  // Gọi API để lấy sản phẩm và supplierID
  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        const response = await fetch(`http://14.225.220.108:2602/product/get-product-by-id?id=${productID}`);
        const data = await response.json();
        if (data.isSuccess && data.result) {
          // Lấy supplierID từ kết quả
          setSupplierID(data.result.supplierID || '');
        } else {
          Alert.alert('Lỗi', 'Không thể lấy thông tin sản phẩm.');
        }
      } catch (error) {
        console.error('Lỗi khi gọi API sản phẩm:', error);
        Alert.alert('Lỗi', 'Không thể kết nối tới máy chủ sản phẩm.');
      }
    };
    fetchProductInfo();
  }, [productID]);

  // Gọi API để lấy voucher
  useEffect(() => {
    const fetchVoucherInfo = async () => {
      if (!voucherID) {
        setVoucherLoading(false);
        return; // Không có voucher
      }
      try {
        const response = await fetch(`http://14.225.220.108:2602/voucher/get-voucher-by-id?id=${voucherID}`);
        const data = await response.json();
        if (data.isSuccess && data.result) {
          setVoucherInfo(data.result);
        } else {
          Alert.alert('Lỗi', 'Không thể lấy thông tin voucher.');
        }
      } catch (error) {
        console.error('Lỗi khi gọi API voucher:', error);
        Alert.alert('Lỗi', 'Không thể kết nối tới máy chủ voucher.');
      } finally {
        setVoucherLoading(false);
      }
    };
    fetchVoucherInfo();
  }, [voucherID]);

  const handleCompleteOrder = async () => {
    setLoading(true);
    const accountID = await AsyncStorage.getItem('accountId');
    if (!accountID) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin tài khoản.');
      setLoading(false);
      return;
    }

    const orderPayload = {
      supplierID: supplierID || '',
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

  if (loading || voucherLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang xử lý...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận Đơn hàng</Text>
      <Text style={styles.text}>Mã sản phẩm: {productID}</Text>
      <Text style={styles.text}>
        Phương thức giao hàng: {deliveryMethod === 0 ? 'Nhận tại cửa hàng' : 'Giao hàng tận nơi'}
      </Text>
      {deliveryMethod === 1 && (
        <Text style={styles.text}>Địa chỉ giao hàng: {shippingAddress}</Text>
      )}

      {voucherID ? (
        voucherInfo ? (
          <View style={styles.voucherContainer}>
            <Text style={styles.text}>Voucher ID: {voucherInfo.vourcherID}</Text>
            <Text style={styles.text}>Mô tả: {voucherInfo.description}</Text>
            <Text style={styles.text}>Giảm giá: {voucherInfo.discountAmount.toLocaleString()} đ</Text>
          </View>
        ) : (
          <Text style={styles.text}>Không thể lấy thông tin voucher.</Text>
        )
      ) : (
        <Text style={styles.text}>Voucher: Không có</Text>
      )}

      <Text style={styles.text}>Nhà cung cấp (SupplierID): {supplierID || 'Không có'}</Text>
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
  voucherContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#e6ffe6',
    borderRadius: 8,
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
