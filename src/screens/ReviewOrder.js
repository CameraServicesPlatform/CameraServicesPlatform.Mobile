import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';

const ReviewOrder = ({ route, navigation }) => {
  const { productID, shippingMethod, address, voucherID } = route.params || {};

  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API để lấy thông tin sản phẩm
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://14.225.220.108:2602/product/get-product-by-id?id=${productID}`);
        const data = await response.json();
        if (data.isSuccess) {
          setProductDetails(data.result);
        } else {
          Alert.alert('Lỗi', 'Không thể lấy thông tin sản phẩm.');
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productID]);

  const handleConfirm = () => {
    if (!productDetails) {
      Alert.alert('Lỗi', 'Không thể tiếp tục vì thiếu thông tin sản phẩm.');
      return;
    }

    const { supplierID } = productDetails; // Lấy supplierID từ thông tin sản phẩm

    navigation.navigate('OrderConfirmation', {
      productID,
      voucherID: voucherID || '',
      shippingAddress: address || '',
      deliveryMethod: shippingMethod,
      supplierID, // Chuyển thêm supplierID qua
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải thông tin sản phẩm...</Text>
      </View>
    );
  }

  if (!productDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không thể tải thông tin sản phẩm.</Text>
      </View>
    );
  }

  const { productName, priceBuy, quality, productDescription } = productDetails;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xem lại đơn hàng</Text>

      <Text style={styles.text}>
        <Text style={styles.label}>Tên sản phẩm: </Text>
        {productName}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.label}>Giá: </Text>
        {priceBuy} đ
      </Text>
      <Text style={styles.text}>
        <Text style={styles.label}>Chất lượng: </Text>
        {quality}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.label}>Mô tả: </Text>
        {productDescription || 'Không có mô tả.'}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.label}>Phương thức giao hàng: </Text>
        {shippingMethod === 0 ? 'Nhận tại cửa hàng' : 'Giao hàng tận nơi'}
      </Text>
      {shippingMethod === 1 && (
        <Text style={styles.text}>
          <Text style={styles.label}>Địa chỉ giao hàng: </Text>
          {address}
        </Text>
      )}
      <Text style={styles.text}>
        <Text style={styles.label}>Voucher: </Text>
        Không có
      </Text>

      <Button title="Tiếp theo" onPress={handleConfirm} />
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
  label: {
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
  },
});

export default ReviewOrder;
