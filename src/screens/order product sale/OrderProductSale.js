import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Image, TouchableOpacity, ScrollView } from 'react-native';

const OrderProductSale = ({ route, navigation }) => {
  const { productID } = route.params || {};
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantityToBuy, setQuantityToBuy] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

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
          setTotalPrice(data.result.priceBuy || 0);
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

  // Cập nhật totalPrice khi quantityToBuy hoặc product thay đổi
  useEffect(() => {
    if (product && product.priceBuy) {
      setTotalPrice(quantityToBuy * product.priceBuy);
    }
  }, [quantityToBuy, product]);

  const handleIncreaseQuantity = () => {
    if (quantityToBuy < product.quantity) {
      setQuantityToBuy(quantityToBuy + 1);
    } else {
      Alert.alert('Thông báo', 'Không đủ số lượng sản phẩm trong kho.');
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantityToBuy > 1) {
      setQuantityToBuy(quantityToBuy - 1);
    }
  };

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
            {product.quantity > 0 ? (
              <>
                <Text style={styles.text}>Giá mua: {product.priceBuy ? `${product.priceBuy} vnđ` : 'Không có giá mua'}</Text>
                <Text style={styles.text}>Chất lượng: {product.quality}</Text>
                <Text style={styles.text}>Số lượng còn lại: {product.quantity}</Text>
                <Text style={styles.text}>Mô tả: {product.productDescription || 'Không có mô tả'}</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity style={styles.quantityButton} onPress={handleDecreaseQuantity}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantityToBuy}</Text>
                  <TouchableOpacity style={styles.quantityButton} onPress={handleIncreaseQuantity}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.text}>Tổng giá: {totalPrice.toLocaleString()} vnđ</Text>
              </>
            ) : (
              <Text style={styles.errorText}>Đã hết hàng</Text>
            )}
          </View>

          {product.quantity > 0 && (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() =>
                navigation.navigate('ShippingMethod', {
                  productID,
                  quantityToBuy,
                  totalPrice,
                })
              }
            >
              <Text style={styles.nextButtonText}>Tiếp theo</Text>
            </TouchableOpacity>
          )}
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
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
