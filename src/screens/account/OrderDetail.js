import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

const OrderDetail = ({ route }) => {
  const { orderID } = route.params || {};
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `http://14.225.220.108:2602/orderDetail/get-order-details/${orderID}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.isSuccess && data.result) {
          setOrderDetails(data.result);
        } else {
          console.error('Dữ liệu trả về không hợp lệ:', data.messages);
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderID) {
      fetchOrderDetails();
    }
  }, [orderID]);

  // Render từng chi tiết đơn hàng
  const renderOrderDetailItem = ({ item }) => {
    const {
      productName,
      productPrice,
      productPriceTotal,
      discount,
      periodRental,
      productQuality,
      product, // Bên trong có productDescription, depositProduct...
    } = item;

    // Ép kiểu periodRental nếu có
    let periodRentalDisplay = null;
    if (periodRental) {
      periodRentalDisplay = new Date(periodRental).toLocaleString();
    }

    return (
      <View style={styles.detailContainer}>
        {/* Tên sản phẩm */}
        <Text style={styles.productName}>{productName}</Text>

        {/* Mô tả sản phẩm (nếu có) */}
        {product?.productDescription ? (
          <Text style={styles.description}>{product.productDescription}</Text>
        ) : null}

        {/* Hiển thị chất lượng sản phẩm */}
        <Text style={styles.infoText}>
          <Text style={styles.label}>Chất lượng: </Text>
          {productQuality || 'N/A'}
        </Text>

        {/* Deposit (tiền cọc) nếu có */}
        {product?.depositProduct ? (
          <Text style={styles.infoText}>
            <Text style={styles.label}>Giá cọc: </Text>
            {product.depositProduct.toLocaleString()} VND
          </Text>
        ) : null}

        {/* Giá của từng sản phẩm */}
        <Text style={styles.infoText}>
          <Text style={styles.label}>Giá thuê/mua: </Text>
          {productPrice?.toLocaleString()} VND
        </Text>

        {/* Tổng tiền sản phẩm (sau khi nhân số lượng, discount, v.v...) */}
        <Text style={styles.infoText}>
          <Text style={styles.label}>Thành tiền: </Text>
          {productPriceTotal?.toLocaleString()} VND
        </Text>

        {/* Discount (nếu có) */}
        {!!discount && discount > 0 && (
          <Text style={styles.infoText}>
            <Text style={styles.label}>Giảm giá: </Text>
            {discount} VND
          </Text>
        )}

        {/* periodRental nếu != null */}
        {periodRentalDisplay && (
          <Text style={styles.infoText}>
            <Text style={styles.label}>Ngày thuê: </Text>
            {periodRentalDisplay}
          </Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e86de" />
        <Text style={styles.loadingText}>Đang tải chi tiết đơn hàng...</Text>
      </View>
    );
  }

  if (!orderDetails || orderDetails.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không có chi tiết nào cho đơn hàng này.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết đơn hàng</Text>
      <FlatList
        data={orderDetails}
        keyExtractor={(item) => item.orderDetailsID}
        renderItem={renderOrderDetailItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  detailContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#2c3e50',
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
    color: '#555',
  },
  infoText: {
    fontSize: 15,
    marginBottom: 6,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },
});
