import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';

const OrderProductSale = ({ route, navigation }) => {
  const { productID } = route.params || {};
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Gọi API để lấy chi tiết sản phẩm
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `http://14.225.220.108:2602/product/get-product-by-id?id=${productID}`
        );
        const data = await response.json();

        if (data.isSuccess) {
          setProduct(data.result);
        } else {
          Alert.alert('Lỗi', 'Không thể lấy thông tin sản phẩm.');
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        Alert.alert('Lỗi', 'Không thể kết nối tới máy chủ.');
      } finally {
        setLoading(false);
      }
    };

    if (productID) {
      fetchProductDetails();
    }
  }, [productID]);

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Đang tải thông tin sản phẩm...</Text>
      </View>
    );
  }

  // Hiển thị thông tin sản phẩm
  return (
    <View style={styles.container}>
      {product ? (
        <>
          <Text style={styles.title}>{product.productName}</Text>
          <Text style={styles.text}>Giá mua: {product.priceBuy} đ</Text>
          <Text style={styles.text}>Chất lượng: {product.quality}</Text>
          <Text style={styles.text}>Mô tả: {product.productDescription}</Text>
          <Button
            title="Tiếp theo"
            onPress={() => navigation.navigate('ShippingMethod', { productID })}
          />
        </>
      ) : (
        <Text style={styles.errorText}>Không tìm thấy thông tin sản phẩm.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default OrderProductSale;
