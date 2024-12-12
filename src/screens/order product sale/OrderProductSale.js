import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Image, TouchableOpacity, ScrollView } from 'react-native';

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Đang tải thông tin sản phẩm...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {product ? (
        <>
          {product.listImage && product.listImage.length > 0 && (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: product.listImage[0].image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>
          )}
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{product.productName}</Text>
            <Text style={styles.text}>Giá mua: {product.priceBuy ? `${product.priceBuy} đ` : 'Không có giá mua'}</Text>
            <Text style={styles.text}>Chất lượng: {product.quality}</Text>
            <Text style={styles.text}>Mô tả: {product.productDescription || 'Không có mô tả'}</Text>
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('ShippingMethod', { productID })}>
            <Text style={styles.nextButtonText}>Tiếp theo</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.errorText}>Không tìm thấy thông tin sản phẩm.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  productImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  infoContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
  nextButton: {
    backgroundColor: '#007BFF',
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderProductSale;
