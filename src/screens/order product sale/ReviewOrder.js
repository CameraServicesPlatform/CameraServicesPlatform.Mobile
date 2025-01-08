import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Image, TouchableOpacity, ScrollView } from 'react-native';

const ReviewOrder = ({ route, navigation }) => {
  const { 
    productID, 
    shippingMethod, 
    address, 
    voucherID, 
    startDate, 
    endDate, 
    returnDate, 
    totalPrice, 
    durationUnit, 
    durationValue, 
    supplierID, 
    quantityToBuy // Nhận thêm quantityToBuy
  } = route.params || {};

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

    // Chuyển sang OrderConfirmation
    navigation.navigate('OrderConfirmation', {
      productID,
      voucherID: voucherID || '',
      shippingAddress: address || '',
      deliveryMethod: shippingMethod,
      supplierID,
      startDate,
      endDate,
      returnDate,
      totalPrice,
      durationUnit,
      durationValue,
      quantityToBuy // Chuyển quantityToBuy
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
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

  const { productName, priceBuy, quality, productDescription, listImage } = productDetails;
  const productImage = listImage && listImage.length > 0 ? listImage[0].image : null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Xem lại đơn hàng</Text>

      {productImage && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: productImage }} 
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.itemText}>
          <Text style={styles.label}>Tên sản phẩm: </Text>
          {productName}
        </Text>
        <Text style={styles.itemText}>
          <Text style={styles.label}>Giá: </Text>
          {priceBuy ? `${priceBuy.toLocaleString()} vnđ` : 'Không có giá mua'}
        </Text>
        <Text style={styles.itemText}>
          <Text style={styles.label}>Chất lượng: </Text>
          {quality}
        </Text>
        <Text style={styles.itemText}>
          <Text style={styles.label}>Mô tả: </Text>
          {productDescription || 'Không có mô tả.'}
        </Text>
        <Text style={styles.itemText}>
          <Text style={styles.label}>Phương thức giao hàng: </Text>
          {shippingMethod === 0 ? 'Giao hàng tận nơi' : 'Nhận tại cửa hàng'}
        </Text>
        {shippingMethod === 1 && (
          <Text style={styles.itemText}>
            <Text style={styles.label}>Địa chỉ giao hàng: </Text>
            {address}
          </Text>
        )}
        <Text style={styles.itemText}>
          <Text style={styles.label}>Voucher: </Text>
          {voucherID ? voucherID : 'Không có'}
        </Text>
        <Text style={styles.itemText}>
          <Text style={styles.label}>Số lượng mua: </Text>
          {quantityToBuy}
        </Text>
        <Text style={styles.itemText}>
          <Text style={styles.label}>Tổng giá trị: </Text>
          {totalPrice.toLocaleString()} vnđ
        </Text>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Tiếp theo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
    margin: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  infoContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    lineHeight: 22,
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },
  confirmButton: {
    backgroundColor: '#007BFF',
    marginHorizontal: 15,
    marginBottom: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReviewOrder;
